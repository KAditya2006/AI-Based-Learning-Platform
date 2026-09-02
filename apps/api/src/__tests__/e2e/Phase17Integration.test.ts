import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { LearningResource, IntegrationConfig, IntegrationStatus, IntegrationSyncJob, SyncJobStatus } from '../../models';
import { IntegrationSyncService } from '../../services/IntegrationSyncService';

describe('Phase 17 - Integration Validation E2E', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    await IntegrationConfig.create({
      provider: 'IGOT',
      isEnabled: true,
      status: IntegrationStatus.HEALTHY,
      lastSuccessfulSyncAt: new Date()
    });
  });

  afterAll(async () => {
    const { JobService } = require('../../services/JobService');
    await JobService.drainActiveJobs(2000);
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const waitForJob = async (jobId: string, timeoutMs = 5000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const job = await IntegrationSyncJob.findById(jobId);
      if (job && (job.status === SyncJobStatus.COMPLETED || job.status === SyncJobStatus.FAILED)) {
        return job;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    throw new Error('Job timeout');
  };

  it('1. Should perform a full catalog sync idempotently without duplicating resources', async () => {
    // First sync
    const jobId1 = await IntegrationSyncService.syncCatalog('IGOT', 'test-corr-1');
    await waitForJob(jobId1);

    const firstCount = await LearningResource.countDocuments({ provider: 'IGOT' });
    expect(firstCount).toBeGreaterThan(0);

    // Second sync (Idempotency test)
    const jobId2 = await IntegrationSyncService.syncCatalog('IGOT', 'test-corr-2');
    await waitForJob(jobId2);
    
    const secondCount = await LearningResource.countDocuments({ provider: 'IGOT' });
    
    // The count should remain identical, proving bulkWrite update is working correctly
    expect(secondCount).toBe(firstCount);
  });

  it('2. Should fail gracefully and record job failure if the integration is disabled', async () => {
    await IntegrationConfig.updateOne({ provider: 'IGOT' }, { isEnabled: false });

    // The mock healthCheck returns true when disabled, but let's see how syncProvider behaves
    // The syncProvider should either skip or return error if provider fails health check
    // Since Mock healthCheck returns true when disabled, it actually falls back to mock catalog.
    // Let's force an error to test the catch block.

    const jobId = await IntegrationSyncService.syncCatalog('IGOT', 'test-corr-3');
    const job = await waitForJob(jobId);

    expect(job!.status).toBe(SyncJobStatus.FAILED);
  });
});
