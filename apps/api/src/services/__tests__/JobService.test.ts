import { JobService } from '../JobService';
import { AIJob } from '../../models/AIJob';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('JobService', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await AIJob.deleteMany({});
  });

  describe('createJob', () => {
    it('should create a new pending job', async () => {
      const requesterId = new mongoose.Types.ObjectId().toString();
      const jobId = (await JobService.createJob(requesterId, 'MCQ_GENERATION', { count: 5 }))._id.toString();
      expect(jobId).toBeDefined();

      const job = await AIJob.findById(jobId);
      expect(job?.status).toBe('QUEUED');
      expect(job?.type).toBe('MCQ_GENERATION');
      expect(job?.requesterId.toString()).toBe(requesterId);
      expect(job?.metadata.count).toBe(5);
    });
  });

  describe('updateJobStatus', () => {
    it('should transition job to COMPLETED', async () => {
      const requesterId = new mongoose.Types.ObjectId().toString();
      const jobDoc = await JobService.createJob(requesterId, 'MCQ_GENERATION', {});
      const jobId = jobDoc._id.toString();
      await JobService.updateJobStatus(jobId, 'COMPLETED', { resultReference: { success: true } });

      const job = await AIJob.findById(jobId);
      expect(job?.status).toBe('COMPLETED');
      expect(job?.resultReference.success).toBe(true);
      expect(job?.completedAt).toBeDefined();
    });

    it('should transition job to FAILED', async () => {
      const requesterId = new mongoose.Types.ObjectId().toString();
      const jobDoc = await JobService.createJob(requesterId, 'MCQ_GENERATION', {});
      const jobId = jobDoc._id.toString();
      await JobService.updateJobStatus(jobId, 'FAILED', { error: 'API timeout' });

      const job = await AIJob.findById(jobId);
      expect(job?.status).toBe('FAILED');
      expect(job?.error).toBe('API timeout');
      expect(job?.completedAt).toBeDefined();
    });
  });
});
