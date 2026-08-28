import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AssessmentService } from '../services';
import { AssessmentType, CompetencyAssessment } from '../models';

export const assessmentSchema = z.object({
  body: z.object({
    competencyId: z.string(),
    level: z.number().min(1).max(5),
    assessmentType: z.nativeEnum(AssessmentType),
    source: z.string(),
    evidence: z.string().optional()
  })
});

export const submitAssessment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { competencyId, level, assessmentType, source, evidence } = req.body;
    const learnerId = req.user?.userId;
    
    if (!learnerId) {
      const err: any = new Error('Not authenticated');
      err.statusCode = 401;
      err.code = 'UNAUTHORIZED';
      throw err;
    }

    const result = await AssessmentService.submitAssessment(learnerId, competencyId, level, assessmentType, source, evidence);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getMyAssessments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessments = await CompetencyAssessment.find({ learner: req.user?.userId }).populate('competency');
    res.status(200).json({ success: true, data: assessments });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assessment = await CompetencyAssessment.findOne({ _id: req.params.id, learner: req.user?.userId });
    if (!assessment) {
      const err: any = new Error('Assessment not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
    res.status(200).json({ success: true, data: assessment });
  } catch (error) {
    next(error);
  }
};
