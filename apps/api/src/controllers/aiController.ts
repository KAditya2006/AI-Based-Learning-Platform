import { Request, Response, NextFunction } from 'express';
import { AIAssessmentService } from '../services/AIAssessmentService';
import { AILearnerService } from '../services/AILearnerService';
import { GeneratedQuestion, AIJob, Recommendation, AIConversation, AIMessage } from '../models';

// ========================
// Learner AI Endpoints
// ========================

export const getRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Return cached if recently generated, otherwise generate
    let recs = await Recommendation.find({ learnerId: req.user!.userId });
    if (recs.length === 0) {
      recs = await AILearnerService.generateRecommendations(req.user!.userId);
    }
    res.json({ success: true, data: recs });
  } catch (error) {
    next(error);
  }
};

export const chat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId, message } = req.body;
    const result = await AILearnerService.chat(req.user!.userId, conversationId, message);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getCompetencyInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a real app we might fetch user data, but the service handles it
    const { aiService } = require('../ai/AIService');
    const result = await aiService.analyzeCompetency(req.user!.userId, { learnerId: req.user!.userId });
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { conversationId } = req.params;
    const history = await AIMessage.find({ conversationId }).sort({ createdAt: 1 });
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

// ========================
// Admin AI Endpoints
// ========================

export const generateQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { materialId, competencyId, difficulty, count } = req.body;
    const job = await AIAssessmentService.generateQuestions(
      req.user!.userId, materialId, competencyId, difficulty, count
    );
    res.status(202).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const getReviewQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const questions = await GeneratedQuestion.find({ status: 'DRAFT' })
      .populate('materialId')
      .populate('competencyId');
    res.json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

export const approveQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const q = await AIAssessmentService.updateQuestionStatus(id, 'APPROVED');
    res.json({ success: true, data: q });
  } catch (error) {
    next(error);
  }
};

export const rejectQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const q = await AIAssessmentService.updateQuestionStatus(id, 'REJECTED');
    res.json({ success: true, data: q });
  } catch (error) {
    next(error);
  }
};

export const getJobStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await AIJob.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Job not found' } });
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};
