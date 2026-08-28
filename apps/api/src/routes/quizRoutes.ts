import { Router } from 'express';
import { quizController } from '../controllers/quizController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validate';
import { createQuestionSchema } from '../schemas';
import { UserRole } from '../models';

const router = Router();

router.use(authenticate);

// Learner endpoints
router.get('/assessments', quizController.getAssessments);
router.get('/assessments/:id', quizController.getAssessment);
router.post('/assessments/:id/submit', quizController.submitAssessment);

// Admin endpoints
router.post('/assessments', authorize([UserRole.ADMIN]), quizController.createAssessment);
router.put('/assessments/:id', authorize([UserRole.ADMIN]), quizController.updateAssessment);

router.get('/questions', authorize([UserRole.ADMIN]), quizController.getQuestions);
router.post('/questions', authorize([UserRole.ADMIN]), validateRequest(createQuestionSchema), quizController.createQuestion);

export default router;
