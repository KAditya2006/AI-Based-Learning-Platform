import { User, Profile, UserRole, UserStatus } from '../models';
import { generateToken } from '../utils/jwt';
import { AuditService } from './AuditService';
import crypto from 'crypto';

export class AuthService {
  static async register(email: string, passwordPlain: string, firstName: string, lastName: string, role: UserRole = UserRole.LEARNER) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error('Email already registered');
    }
    
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({ 
      email, 
      passwordHash: passwordPlain, 
      role, 
      status: UserStatus.ACTIVE,
      emailVerificationToken
    });
    await user.save();

    await Profile.create({ user: user._id, firstName, lastName });
    await AuditService.log(user._id.toString(), 'REGISTER', user._id.toString(), { role });
    
    // In a real app, send email here with the verification token
    console.log(`[Email Mock] Verification sent to ${email} with token: ${emailVerificationToken}`);

    const token = generateToken(user._id.toString(), user.role);
    return { user: { _id: user._id, email: user.email, role: user.role }, token };
  }

  static async login(email: string, passwordCandidate: string) {
    const user = await User.findOne({ email });
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new Error('Invalid credentials or inactive account');
    }

    const isValid = await user.comparePassword(passwordCandidate);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await user.save();
    
    await AuditService.log(user._id.toString(), 'LOGIN');
    
    const token = generateToken(user._id.toString(), user.role);
    return { user: { _id: user._id, email: user.email, role: user.role }, token };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) return; // Silent return to prevent email enumeration

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await AuditService.log(user._id.toString(), 'PASSWORD_RESET_REQUESTED');
    console.log(`[Email Mock] Password reset for ${email}. Token: ${resetToken}`);
  }

  static async resetPassword(token: string, newPasswordPlain: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new Error('Password reset token is invalid or has expired');
    }

    user.passwordHash = newPasswordPlain;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await AuditService.log(user._id.toString(), 'PASSWORD_RESET_COMPLETED');
  }

  static async verifyEmail(token: string) {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      throw new Error('Invalid verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    await AuditService.log(user._id.toString(), 'EMAIL_VERIFIED');
  }
}
