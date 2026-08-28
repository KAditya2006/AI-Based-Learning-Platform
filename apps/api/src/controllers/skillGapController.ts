import { Request, Response, NextFunction } from 'express';
import { SkillGap } from '../models';

export const getMySkillGaps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;
    const gaps = await SkillGap.find({ learner: req.user?.userId })
      .populate('competency')
      .skip(skip)
      .limit(Math.min(limit, 100))
      .lean();
    res.status(200).json({ success: true, data: gaps });
  } catch (error) {
    next(error);
  }
};

export const getSkillGapById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gap = await SkillGap.findOne({ _id: req.params.id, learner: req.user?.userId }).populate('competency');
    if (!gap) {
      const err: any = new Error('Skill gap not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
    res.status(200).json({ success: true, data: gap });
  } catch (error) {
    next(error);
  }
};
