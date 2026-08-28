import { Request, Response, NextFunction } from 'express';
import { Assessment, Question } from '../models';
import { QuizService } from '../services/QuizService';

export const quizController = {
  getAssessments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: any = {};
      if (req.user?.role !== 'ADMIN') {
        query.isPublished = true;
      }
      if (req.query.competency) {
        query.competency = req.query.competency;
      }
      const limit = parseInt(req.query.limit as string) || 100;
      const skip = parseInt(req.query.skip as string) || 0;
      const assessments = await Assessment.find(query)
        .populate('competency')
        .skip(skip)
        .limit(Math.min(limit, 100))
        .lean();
      res.json({ success: true, data: assessments });
    } catch (error) {
      next(error);
    }
  },

  getAssessment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lean populate to avoid returning correctOptionId and explanation to learners
      const assessment = await Assessment.findById(req.params.id)
        .populate('competency')
        .lean();
        
      if (!assessment) {
        const err: any = new Error('Assessment not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
      }
      
      const questions = await Question.find({ _id: { $in: assessment.questions } }).lean();
      
      if (req.user?.role !== 'ADMIN') {
        // Strip sensitive info
        questions.forEach(q => {
          delete (q as any).correctOptionId;
          delete (q as any).explanation;
        });
      }
      
      assessment.questions = questions as any;
      res.json({ success: true, data: assessment });
    } catch (error) {
      next(error);
    }
  },

  createAssessment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assessment = await Assessment.create(req.body);
      res.status(201).json({ success: true, data: assessment });
    } catch (error) {
      next(error);
    }
  },
  
  updateAssessment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assessment = await Assessment.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!assessment) {
        const err: any = new Error('Assessment not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
      }
      res.json({ success: true, data: assessment });
    } catch (error) {
      next(error);
    }
  },

  getQuestions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const skip = parseInt(req.query.skip as string) || 0;
      const questions = await Question.find()
        .populate('competency')
        .skip(skip)
        .limit(Math.min(limit, 100))
        .lean();
      res.json({ success: true, data: questions });
    } catch (error) {
      next(error);
    }
  },

  createQuestion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const question = await Question.create(req.body);
      res.status(201).json({ success: true, data: question });
    } catch (error) {
      next(error);
    }
  },

  submitAssessment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answers } = req.body;
      const result = await QuizService.submitQuiz(req.user!.userId, req.params.id, answers);
      res.json({ success: true, data: result });
    } catch (error: any) {
      error.statusCode = 400;
      next(error);
    }
  }
};
