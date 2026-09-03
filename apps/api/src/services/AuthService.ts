import { User, Profile, UserRole, UserStatus } from '../models';
import { generateToken } from '../utils/jwt';
import { AuditService } from './AuditService';
import crypto from 'crypto';
import { DEPARTMENTS_BY_ORG, DESIGNATIONS_BY_DEPT, FUNCTIONAL_ROLES_BY_DESIG, ORGANIZATIONS } from '../data/organizationStructure';

export class AuthService {
  static async register(payload: any, role: UserRole = UserRole.LEARNER) {
    const { email, password, firstName, lastName, ...profileData } = payload;
    
    // Cross-validation of organizational hierarchy
    if (profileData.organization) {
      const orgExists = ORGANIZATIONS.some(o => o.id === profileData.organization);
      if (!orgExists) throw new Error('Invalid organization selected');
      
      if (profileData.departmentName) {
        const validDepts = DEPARTMENTS_BY_ORG[profileData.organization] || [];
        const deptExists = validDepts.some(d => d.id === profileData.departmentName);
        if (!deptExists) throw new Error('Invalid department for the selected organization');
        
        if (profileData.designationName) {
          const validDesigs = DESIGNATIONS_BY_DEPT[profileData.departmentName] || [];
          const desigExists = validDesigs.some(d => d.id === profileData.designationName) || validDesigs.length === 0; 
          // If no mapping exists, we shouldn't strictly block it unless we have full data, but based on requirements we should.
          if (!desigExists && validDesigs.length > 0) throw new Error('Invalid designation for the selected department');
          
          if (profileData.functionalRole) {
            const validRoles = FUNCTIONAL_ROLES_BY_DESIG[profileData.designationName] || [];
            const roleExists = validRoles.some(r => r.id === profileData.functionalRole) || validRoles.length === 0;
            if (!roleExists && validRoles.length > 0) throw new Error('Invalid functional role for the selected designation');
          }
        }
      }
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error('Email already registered');
    }
    
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({ 
      email, 
      passwordHash: password, 
      role, 
      status: UserStatus.ACTIVE,
      emailVerificationToken
    });
    await user.save();

    await Profile.create({ 
      user: user._id, 
      firstName, 
      lastName,
      ...profileData
    });
    await AuditService.log(user._id.toString(), 'REGISTER', user._id.toString(), { role });
    
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
    if (!user) return; 

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); 
    await user.save();

    await AuditService.log(user._id.toString(), 'PASSWORD_RESET_REQUESTED');
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
