import { Request, Response, NextFunction } from 'express';
import { User, Profile, Competency, AuditLog, UserStatus } from '../models';
import { CompetencyService } from '../services';
import { AdminService } from '../services/AdminService';

export const getWorkforce = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.aggregate([
        { $skip: skip },
        { $limit: limit },
        { $lookup: { from: 'profiles', localField: '_id', foreignField: 'user', as: 'profile' } },
        { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
        { $project: { passwordHash: 0 } }
      ]),
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
    const mongoose = require('mongoose');
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      { $lookup: { from: 'profiles', localField: '_id', foreignField: 'user', as: 'profile' } },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      { $project: { passwordHash: 0 } }
    ]);
    if (!user || user.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.status(200).json({ success: true, data: user[0] });
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

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, role, department, designation } = req.body;
    
    // Create User (using a default dummy password for now, since it's an admin create - in real life we'd send an invite)
    const { AuthService } = require('../services/AuthService');
    const authService = new AuthService();
    
    const user = await User.create({
      email,
      role: role || 'LEARNER',
      passwordHash: 'dummy_hash_to_be_reset', // In a real system, send a password reset link
      status: UserStatus.ACTIVE,
      emailVerified: true
    });

    const [firstName, ...lastNameParts] = (name || '').split(' ');
    const lastName = lastNameParts.join(' ') || ' ';

    const profile = await Profile.create({
      user: user._id,
      firstName: firstName || 'Unknown',
      lastName: lastName,
      departmentName: department,
      designationName: designation,
      onboardingStatus: 'NOT_STARTED'
    });

    res.status(201).json({ success: true, data: { user, profile } });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, role, department, designation, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });
    
    if (role) user.role = role;
    if (status) user.status = status;
    await user.save();

    let profile = await Profile.findOne({ user: user._id });
    if (profile) {
      if (name) {
        const [firstName, ...lastNameParts] = name.split(' ');
        profile.firstName = firstName;
        profile.lastName = lastNameParts.join(' ') || ' ';
      }
      if (department) profile.departmentName = department;
      if (designation) profile.designationName = designation;
      await profile.save();
    }

    res.status(200).json({ success: true, data: { user, profile } });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });
    
    user.status = UserStatus.INACTIVE;
    await user.save();
    
    res.status(200).json({ success: true, data: user, message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AuditLog.find().sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments()
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({ 
      success: true, 
      data: { items: logs, page, limit, total, totalPages }
    });
  } catch (error) {
    next(error);
  }
};
