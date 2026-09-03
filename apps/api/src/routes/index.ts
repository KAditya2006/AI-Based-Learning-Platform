import { Router } from 'express';
import authRoutes from './authRoutes';
import metadataRoutes from './metadataRoutes';
import profileRoutes from './profileRoutes';
import competencyRoutes from './competencyRoutes';
import assessmentRoutes from './assessmentRoutes';
import skillGapRoutes from './skillGapRoutes';
import adminRoutes from './adminRoutes';
import learningRoutes from './learningRoutes';
import quizRoutes from './quizRoutes';
import { aiRoutes } from './aiRoutes';
import notificationRoutes from './notificationRoutes';
import { integrationsRouter } from './admin/integrations';
import { intelligenceRouter } from './admin/intelligenceRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/metadata', metadataRoutes);
router.use('/profile', profileRoutes);
router.use('/competencies', competencyRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/skill-gaps', skillGapRoutes);
router.use('/admin', adminRoutes);
router.use('/admin/intelligence', intelligenceRouter);
router.use('/learning', learningRoutes);
router.use('/admin/integrations', integrationsRouter);
router.use('/quizzes', quizRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

export default router;

