import { Request, Response, NextFunction } from 'express';
import { User, Competency } from '../models';
import { CompetencyService } from '../services';
import { AdminService } from '../services/AdminService';

export const getWorkforce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-passwordHash').skip(skip).limit(limit).lean(),
      User.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({ 
      success: true, 
      data: { items: users, page, limit, total, totalPages }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getAdminCompetencies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const competencies = await CompetencyService.getAllCompetencies();
    res.status(200).json({ success: true, data: competencies });
  } catch (error) {
    next(error);
  }
};

export const createAdminCompetency = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { frameworkId, name, code, domain, description } = req.body;
    const competency = await CompetencyService.createCompetency(frameworkId, name, code, domain, description);
    res.status(201).json({ success: true, data: competency });
  } catch (error) {
    next(error);
  }
};

export const updateAdminCompetency = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const competency = await Competency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: competency });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const workforce = await AdminService.getWorkforceAnalytics();
    const skills = await AdminService.getSkillGapAnalytics();

    res.status(200).json({
      success: true,
      data: {
        workforce,
        skills
      }
    });
  } catch (error) {
    next(error);
  }
};
