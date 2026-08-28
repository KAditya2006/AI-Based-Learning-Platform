import { Request, Response, NextFunction } from 'express';
import { Profile } from '../models';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findOne({ user: req.user?.userId }).populate('department').populate('designation');
    if (!profile) {
      const err: any = new Error('Profile not found');
      err.statusCode = 404;
      err.code = 'NOT_FOUND';
      throw err;
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      firstName, lastName, department, designation, currentAssignment, 
      education, workExperience, trainingHistory, learningGoals, onboardingStatus 
    } = req.body;

    const updates: any = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (department !== undefined) updates.department = department;
    if (designation !== undefined) updates.designation = designation;
    if (currentAssignment !== undefined) updates.currentAssignment = currentAssignment;
    if (education !== undefined) updates.education = education;
    if (workExperience !== undefined) updates.workExperience = workExperience;
    if (trainingHistory !== undefined) updates.trainingHistory = trainingHistory;
    if (learningGoals !== undefined) updates.learningGoals = learningGoals;
    if (onboardingStatus !== undefined) updates.onboardingStatus = onboardingStatus;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user?.userId }, 
      { $set: updates }, 
      { new: true }
    ).populate('department').populate('designation');
    
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

import { Department, Role } from '../models';
import { CacheService } from '../services/CacheService';

export const getMetadata = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await CacheService.getOrSet('metadata:departments', async () => {
      return await Department.find({}).select('_id name').lean();
    }, 3600);
    
    const roles = await CacheService.getOrSet('metadata:roles', async () => {
      return await Role.find({}).select('_id name department').lean();
    }, 3600);
    
    res.status(200).json({ success: true, data: { departments, roles } });
  } catch (error) {
    next(error);
  }
};
