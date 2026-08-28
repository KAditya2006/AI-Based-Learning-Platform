import { Router } from 'express';
import { z } from 'zod';
import { IntegrationConfig, IntegrationSyncJob, IntegrationStatus } from '../../models';
import { IntegrationSyncService } from '../../services/IntegrationSyncService';
import { logger } from '../../utils/logger';

const router = Router();

// GET /api/admin/integrations - List all integration configs
router.get('/', async (req, res, next) => {
  try {
    const configs = await IntegrationConfig.find().sort({ provider: 1 });
    res.json(configs);
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/integrations/:provider/health - Trigger a health check
router.post('/:provider/health', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const providerImpl = IntegrationSyncService.getProvider(provider);
    
    const isHealthy = await providerImpl.healthCheck();
    
    // Update config status
    const config = await IntegrationConfig.findOne({ provider });
    if (config) {
      // Don't override completely disabled statuses if it's currently DISABLED
      if (config.status !== IntegrationStatus.DISABLED) {
        config.status = isHealthy ? IntegrationStatus.HEALTHY : IntegrationStatus.UNAVAILABLE;
        config.lastHealthCheckAt = new Date();
        await config.save();
      }
    }

    res.json({ provider, isHealthy, status: config?.status });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/integrations/:provider/sync - Trigger catalog sync
router.post('/:provider/sync', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const correlationId = (req as any).correlationId || `sync-${Date.now()}`;
    
    const jobId = await IntegrationSyncService.syncCatalog(provider, correlationId);
    
    logger.info(`Integration sync triggered for ${provider}`, { jobId, correlationId });
    res.status(202).json({ message: 'Sync job enqueued', jobId });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/integrations/:provider/sync-history - Get recent sync jobs
router.get('/:provider/sync-history', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const jobs = await IntegrationSyncJob.find({ provider })
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/integrations/:provider/toggle - Enable/Disable
const toggleSchema = z.object({
  isEnabled: z.boolean()
});

router.patch('/:provider/toggle', async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { isEnabled } = toggleSchema.parse(req.body);
    
    const config = await IntegrationConfig.findOne({ provider });
    if (!config) {
      return res.status(404).json({ message: 'Provider config not found' });
    }
    
    config.isEnabled = isEnabled;
    config.status = isEnabled ? IntegrationStatus.CONFIGURED : IntegrationStatus.DISABLED;
    await config.save();
    
    res.json({ message: `Provider ${provider} ${isEnabled ? 'enabled' : 'disabled'}` });
  } catch (err) {
    next(err);
  }
});

export { router as integrationsRouter };
