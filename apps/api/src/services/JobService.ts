import { AIJob } from '../models';
import { logger } from '../utils/logger';

export class JobService {
  private static activeJobs: Set<Promise<any>> = new Set();
  private static queue: { jobId: string, task: () => Promise<any> }[] = [];
  private static MAX_CONCURRENT_JOBS = 20;
  /**
   * Enqueues a new background job.
   */
  static async createJob(requesterId: string, type: string, metadata: any) {
    const job = await AIJob.create({
      requesterId,
      type,
      status: 'QUEUED',
      metadata
    });
    return job;
  }

  /**
   * Updates job status
   */
  static async updateJobStatus(jobId: string, status: 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED', data?: { resultReference?: any, error?: string }) {
    const updatePayload: any = { status };
    if (status === 'PROCESSING') updatePayload.startedAt = new Date();
    if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(status)) updatePayload.completedAt = new Date();
    
    if (data?.resultReference) updatePayload.resultReference = data.resultReference;
    if (data?.error) updatePayload.error = data.error;

    return AIJob.findByIdAndUpdate(jobId, updatePayload, { new: true });
  }

  /**
   * Safe async executor wrapper with bounded concurrency queue
   */
  static async executeAsync(jobId: string, task: () => Promise<any>) {
    if (this.activeJobs.size >= this.MAX_CONCURRENT_JOBS) {
      this.queue.push({ jobId, task });
      logger.info(`Job ${jobId} added to queue. Queue size: ${this.queue.length}`);
      return;
    }
    
    this._runTask(jobId, task);
  }

  private static _runTask(jobId: string, task: () => Promise<any>) {
    let jobPromise: Promise<any> | null = null;
    const runner = async () => {
      try {
        await this.updateJobStatus(jobId, 'PROCESSING');
        const result = await task();
        await this.updateJobStatus(jobId, 'COMPLETED', { resultReference: result });
      } catch (error: any) {
        logger.error(`Job ${jobId} failed:`, { error });
        await this.updateJobStatus(jobId, 'FAILED', { error: error.message });
      } finally {
        if (jobPromise) {
          JobService.activeJobs.delete(jobPromise);
        }
        if (JobService.queue.length > 0) {
          const next = JobService.queue.shift();
          if (next) JobService._runTask(next.jobId, next.task);
        }
      }
    };
    
    jobPromise = runner();
    JobService.activeJobs.add(jobPromise);
  }

  /**
   * Waits for all active jobs to complete (used during graceful shutdown)
   */
  static async drainActiveJobs(timeoutMs = 10000) {
    if (this.activeJobs.size === 0) return;
    logger.info(`Draining ${this.activeJobs.size} active background jobs...`);
    const timeout = new Promise(resolve => setTimeout(resolve, timeoutMs));
    await Promise.race([Promise.all(this.activeJobs), timeout]);
  }

  /**
   * Recovers jobs that were stuck in PROCESSING state due to a hard crash
   */
  static async recoverStaleJobs() {
    const threshold = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes
    const staleJobs = await AIJob.updateMany(
      { status: 'PROCESSING', startedAt: { $lt: threshold } },
      { $set: { status: 'FAILED', error: 'Job timed out or worker crashed' } }
    );
    if (staleJobs.modifiedCount > 0) {
      logger.warn(`Recovered ${staleJobs.modifiedCount} stale jobs that were stuck in PROCESSING.`);
    }
  }
}
