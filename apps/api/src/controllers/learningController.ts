import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { LearningResource } from '../models';
import { LearningService } from '../services/LearningService';

export const learningController = {
  getLibrary: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: any = {};
      
      // If not admin, only show active resources
      if (req.user?.role !== 'ADMIN') {
        query.isActive = true;
      }
      
      if (req.query.competency) {
        query.competencies = req.query.competency;
      }

      const limit = parseInt(req.query.limit as string) || 100;
      const skip = parseInt(req.query.skip as string) || 0;
      const resources = await LearningResource.find(query)
        .populate('competencies')
        .skip(skip)
        .limit(Math.min(limit, 100))
        .lean();
      res.json({ success: true, data: resources });
    } catch (error) {
      next(error);
    }
  },

  getResource: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await LearningResource.findById(req.params.id).populate('competencies');
      if (!resource) {
        const err: any = new Error('Resource not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
      }
      res.json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  },

  createResource: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await LearningResource.create(req.body);
      res.status(201).json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  },

  updateResource: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await LearningResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!resource) {
        const err: any = new Error('Resource not found');
        err.statusCode = 404;
        err.code = 'NOT_FOUND';
        throw err;
      }
      res.json({ success: true, data: resource });
    } catch (error) {
      next(error);
    }
  },

  enroll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enrollment = await LearningService.enroll(req.user!.userId, req.params.id);
      res.status(201).json({ success: true, data: enrollment });
    } catch (error: any) {
      error.statusCode = 400;
      next(error);
    }
  },

  updateProgress: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { progressPercentage } = req.body;
      const enrollment = await LearningService.updateProgress(req.user!.userId, req.params.id, progressPercentage);
      res.json({ success: true, data: enrollment });
    } catch (error: any) {
      error.statusCode = 400;
      next(error);
    }
  },

  getEnrollments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enrollments = await LearningService.getEnrollments(req.user!.userId);
      res.json({ success: true, data: enrollments });
    } catch (error) {
      next(error);
    }
  },

  getPath: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { LearningPathService } = require('../services/LearningPathService');
      const path = await LearningPathService.getActiveLearningPath(req.user!.userId);
      res.json({ success: true, data: path });
    } catch (error) {
      next(error);
    }
  },

  generatePath: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { LearningPathService } = require('../services/LearningPathService');
      const path = await LearningPathService.generateLearningPath(req.user!.userId);
      res.status(201).json({ success: true, data: path });
    } catch (error: any) {
      error.statusCode = 400;
      next(error);
    }
  }
};
