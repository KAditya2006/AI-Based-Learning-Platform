import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';
import { InsightService } from '../services/InsightService';
import { Insight } from '../models';

export const getDepartmentIntelligence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getDepartmentIntelligence();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getRoleIntelligence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getRoleIntelligence();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCompetencyHeatmap = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getCompetencyHeatmap();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getLearningEffectiveness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getLearningEffectiveness();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Insight.find().sort({ generatedAt: -1 }).limit(20).lean();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const generateInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await InsightService.generateWorkforceInsights();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
