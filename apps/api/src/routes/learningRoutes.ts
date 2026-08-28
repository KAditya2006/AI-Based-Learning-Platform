import { Router } from 'express';
import { learningController } from '../controllers/learningController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validate';
import { createLearningResourceSchema, updateLearningResourceSchema, updateProgressSchema } from '../schemas';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);

// Learner endpoints
router.get('/library', learningController.getLibrary);
router.get('/enrollments', learningController.getEnrollments);
router.get('/resources/:id', learningController.getResource);
router.post('/resources/:id/enroll', learningController.enroll);
router.put('/resources/:id/progress', validateRequest(updateProgressSchema), learningController.updateProgress);

router.get('/path', learningController.getPath);
router.post('/path/generate', learningController.generatePath);

// Admin endpoints
router.post('/resources', authorize([UserRole.ADMIN]), validateRequest(createLearningResourceSchema), learningController.createResource);
router.put('/resources/:id', authorize([UserRole.ADMIN]), validateRequest(updateLearningResourceSchema), learningController.updateResource);

export default router;
