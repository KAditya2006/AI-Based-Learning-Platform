import { Request, Response, NextFunction } from 'express';
import { CompetencyService } from '../services';
import { Competency } from '../models';

export const getAllCompetencies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const competencies = await CompetencyService.getAllCompetencies();
    res.status(200).json({ success: true, data: competencies });
  } catch (error) {
    next(error);
  }
};

export const getCompetencyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const competency = await Competency.findById(req.params.id);
    if (!competency) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Competency not found' } });
    res.status(200).json({ success: true, data: competency });
  } catch (error) {
    next(error);
  }
};
