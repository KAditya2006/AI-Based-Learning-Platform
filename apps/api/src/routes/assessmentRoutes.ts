import { Router } from 'express';
import { submitAssessment, getMyAssessments, getAssessmentById, assessmentSchema } from '../controllers/assessmentController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validate';
import { UserRole } from '../models';

const router = Router();

router.post('/', authenticate, authorize([UserRole.ADMIN]), validateRequest(assessmentSchema), submitAssessment);
router.get('/', authenticate, getMyAssessments);
router.get('/:id', authenticate, getAssessmentById);

export default router;
