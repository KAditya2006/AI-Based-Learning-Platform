import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validate';
import { generateQuestionsSchema, chatSchema } from '../schemas';
import { UserRole } from '../models/User';
import * as materialController from '../controllers/materialController';
import * as aiController from '../controllers/aiController';
import multer from 'multer';
import path from 'path';

const upload = multer({
  dest: path.join(__dirname, '../../uploads/'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, PPTX, and TXT are allowed.'));
    }
  }
});

export const aiRoutes = Router();

// Material Ingestion (Admin Only)
aiRoutes.post('/materials', authenticate, authorize([UserRole.ADMIN]), upload.single('file'), materialController.uploadMaterial);
aiRoutes.get('/materials', authenticate, authorize([UserRole.ADMIN]), materialController.getMaterials);
aiRoutes.get('/materials/:id', authenticate, authorize([UserRole.ADMIN]), materialController.getMaterialStatus);
aiRoutes.post('/materials/:id/process', authenticate, authorize([UserRole.ADMIN]), materialController.processMaterial);

// Admin AI Endpoints
aiRoutes.post('/admin/generate-mcqs', authenticate, authorize([UserRole.ADMIN]), validateRequest(generateQuestionsSchema), aiController.generateQuestions);
aiRoutes.get('/admin/review-queue', authenticate, authorize([UserRole.ADMIN]), aiController.getReviewQueue);
aiRoutes.post('/admin/questions/:id/approve', authenticate, authorize([UserRole.ADMIN]), aiController.approveQuestion);
aiRoutes.post('/admin/questions/:id/reject', authenticate, authorize([UserRole.ADMIN]), aiController.rejectQuestion);

// Shared Job Endpoints
aiRoutes.get('/jobs/:id', authenticate, aiController.getJobStatus);

// Learner AI Endpoints
aiRoutes.get('/learner/recommendations', authenticate, authorize([UserRole.LEARNER]), aiController.getRecommendations);
aiRoutes.get('/learner/competency-insights', authenticate, authorize([UserRole.LEARNER]), aiController.getCompetencyInsights);
aiRoutes.post('/learner/chat', authenticate, authorize([UserRole.LEARNER]), validateRequest(chatSchema), aiController.chat);
aiRoutes.get('/learner/chat/:conversationId', authenticate, authorize([UserRole.LEARNER]), aiController.getChatHistory);
