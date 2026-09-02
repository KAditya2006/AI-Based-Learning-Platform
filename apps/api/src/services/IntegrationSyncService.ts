import { JobService } from './JobService';
import { IntegrationConfig, IntegrationSyncJob, SyncJobStatus, IntegrationStatus, LearningResource, ResourceSource, Competency, AIJob } from '../models';
import { IntegrationProvider } from '../integrations/IntegrationProvider';
import { IGOTProvider } from '../integrations/igot/IGOTProvider';
import { ProgrammeProvider } from '../integrations/nssta/ProgrammeProvider';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export class IntegrationSyncService {
  private static providers: Record<string, IntegrationProvider> = {
    'IGOT': new IGOTProvider(),
    'NSSTA': new ProgrammeProvider()
  };

  /**
   * Initializes config documents for any missing providers.
   */
  static async initializeProviders() {
    for (const providerId of Object.keys(this.providers)) {
      await IntegrationConfig.updateOne(
        { provider: providerId },
        { $setOnInsert: { provider: providerId, isEnabled: false, status: IntegrationStatus.CONFIGURED } },
        { upsert: true }
      );
    }
  }

  static getProvider(providerId: string): IntegrationProvider {
    const provider = this.providers[providerId];
    if (!provider) throw new Error(`Unknown provider: ${providerId}`);
    return provider;
  }

  static async syncCatalog(providerId: string, correlationId: string): Promise<string> {
    const provider = this.getProvider(providerId);
    
    // Create a sync job
    const job = await IntegrationSyncJob.create({
      provider: providerId,
      jobType: 'CATALOG_SYNC',
      status: SyncJobStatus.PENDING,
      correlationId
    });

    // Enqueue a real background job instead of executeAsync with a closure
    const aiJob = await AIJob.create({
      requesterId: new mongoose.Types.ObjectId(),
      type: 'CATALOG_SYNC',
      status: 'QUEUED',
      metadata: { syncJobId: job._id.toString(), providerId, correlationId }
    });

    JobService.processNextJob();

    return job._id.toString();
  }

  static async processJob(aiJob: any) {
    const { syncJobId, providerId, correlationId } = aiJob.metadata;
    const provider = this.getProvider(providerId);

    const job = await IntegrationSyncJob.findById(syncJobId);
    if (!job) throw new Error(`IntegrationSyncJob ${syncJobId} not found`);

    try {
      job.status = SyncJobStatus.PROCESSING;
      job.startedAt = new Date();
      await job.save();

      const config = await IntegrationConfig.findOne({ provider: providerId });
      if (!config || !config.isEnabled) {
        throw new Error('Provider is disabled. Cannot sync.');
      }

      const isHealthy = await provider.healthCheck();
      if (!isHealthy) {
        config.status = IntegrationStatus.UNAVAILABLE;
        await config.save();
        throw new Error('Provider health check failed. Unavailable.');
      }

      const externalResources = await provider.fetchCatalog();
      
      const allTags = new Set<string>();
      externalResources.forEach(r => r.competencyTags.forEach(t => allTags.add(t)));
      
      const allTagsArray = Array.from(allTags);
      const existingComps = await Competency.find({ name: { $in: allTagsArray.map(t => new RegExp('^' + t + '$', 'i')) } }).lean();
      const existingCompNames = new Set(existingComps.map(c => c.name.toLowerCase()));
      
      const defaultFramework = await mongoose.model('CompetencyFramework').findOne().sort({ createdAt: -1 }).lean() as any;
      const frameworkId = defaultFramework ? defaultFramework._id : new mongoose.Types.ObjectId();

      const newComps = allTagsArray
        .filter(t => !existingCompNames.has(t.toLowerCase()))
        .map(t => ({
           name: t,
           code: `AUTO-${t.substring(0, 5).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
           domain: 'TECHNICAL',
           framework: frameworkId,
           description: `Auto-generated from ${providerId} tag: ${t}`
        }));
        
      if (newComps.length > 0) {
          await Competency.insertMany(newComps);
      }

      const allComps = await Competency.find({ name: { $in: allTagsArray.map(t => new RegExp('^' + t + '$', 'i')) } }).lean();
      const competencyMap = new Map<string, string>();
      allComps.forEach(c => competencyMap.set(c.name.toLowerCase(), c._id.toString()));

      const bulkOps = [];
      for (const er of externalResources) {
        const mappedCompetencies = er.competencyTags
          .map(t => competencyMap.get(t.toLowerCase()))
          .filter((t): t is string => !!t);
        
        bulkOps.push({
          updateOne: {
            filter: { source: er.provider, externalId: er.externalId },
            update: {
              $set: {
                title: er.title,
                description: er.description,
                provider: er.provider,
                durationMinutes: er.durationMinutes,
                competencies: mappedCompetencies as any,
                source: er.provider as ResourceSource,
                type: er.type,
                difficulty: er.difficulty,
                isActive: true,
                externalId: er.externalId,
                externalUrl: er.url
              }
            },
            upsert: true
          }
        });
      }

      if (bulkOps.length > 0) {
         const bulkResult = await LearningResource.bulkWrite(bulkOps);
         job.recordsCreated = bulkResult.upsertedCount;
         job.recordsUpdated = bulkResult.modifiedCount;
         job.recordsProcessed = externalResources.length;
      }

      job.status = job.errorCount > 0 ? SyncJobStatus.PARTIAL_SUCCESS : SyncJobStatus.COMPLETED;
      job.completedAt = new Date();
      await job.save();

      config.status = IntegrationStatus.HEALTHY;
      config.lastSuccessfulSyncAt = new Date();
      await config.save();

      return { recordsProcessed: externalResources.length };
    } catch (err: any) {
      logger.error(`Catalog sync failed for ${providerId}`, { error: err, correlationId });
      job.status = SyncJobStatus.FAILED;
      await job.save();
      throw err;
    }
  }
}
