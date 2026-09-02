import { AIJob } from '../models';
import { logger } from '../utils/logger';

export class JobService {
  private static activeJobs: Set<Promise<any>> = new Set();
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

  static async processNextJob() {
    if (this.activeJobs.size >= this.MAX_CONCURRENT_JOBS) return;

    // Find next QUEUED job
    const job = await AIJob.findOneAndUpdate(
      { status: 'QUEUED' },
      { status: 'PROCESSING', startedAt: new Date() },
      { sort: { createdAt: 1 }, new: true }
    );

    if (!job) return;

    let jobPromise: Promise<any> | null = null;
    const runner = async () => {
      try {
        let result;
        if (job.type === 'MATERIAL_PROCESSING') {
          const { MaterialService } = require('./MaterialService');
          result = await MaterialService.processJob(job);
        } else if (job.type === 'MCQ_GENERATION') {
          const { AIAssessmentService } = require('./AIAssessmentService');
          result = await AIAssessmentService.processJob(job);
        } else if (job.type === 'CATALOG_SYNC') {
          const { IntegrationSyncService } = require('./IntegrationSyncService');
          result = await IntegrationSyncService.processJob(job);
        } else {
          throw new Error(`Unknown job type: ${job.type}`);
        }
        await this.updateJobStatus(job._id.toString(), 'COMPLETED', { resultReference: result });
      } catch (error: any) {
        logger.error(`Job ${job._id} failed:`, { error });
        await this.updateJobStatus(job._id.toString(), 'FAILED', { error: error.message });
      } finally {
        if (jobPromise) {
          JobService.activeJobs.delete(jobPromise);
        }
        // Fetch next job when done
        JobService.processNextJob();
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
