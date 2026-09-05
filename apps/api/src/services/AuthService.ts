import { User, UserRole, UserStatus, Profile } from '../models';
import { generateToken } from '../utils/jwt';
import { AuditService } from './AuditService';
import { emailService } from './EmailService';
import { DEPARTMENTS_BY_ORG, DESIGNATIONS_BY_DEPT, FUNCTIONAL_ROLES_BY_DESIG, ORGANIZATIONS } from '../data/organizationStructure';

export class AuthService {
  static async register(payload: any, role: UserRole = UserRole.LEARNER) {
    const { email, password, firstName, lastName, ...profileData } = payload;
    
    if (profileData.organization) {
      const org = ORGANIZATIONS.find(o => o.id === profileData.organization);
      if (!org) throw new Error('Invalid organization selected');
      
      if (profileData.departmentName) {
        const validDepts = DEPARTMENTS_BY_ORG[profileData.organization] || [];
        const dept = validDepts.find(d => d.id === profileData.departmentName);
        if (!dept) throw new Error('Invalid department for the selected organization');
        
        if (profileData.designationName) {
          const validDesigs = DESIGNATIONS_BY_DEPT[profileData.departmentName] || [];
          const desig = validDesigs.find(d => d.id === profileData.designationName);
          if (!desig && validDesigs.length > 0) throw new Error('Invalid designation for the selected department');
          
          if (profileData.functionalRole) {
            const validRoles = FUNCTIONAL_ROLES_BY_DESIG[profileData.designationName] || [];
            const roleObj = validRoles.find(r => r.id === profileData.functionalRole);
            if (!roleObj && validRoles.length > 0) throw new Error('Invalid functional role for the selected designation');
            if (roleObj) profileData.functionalRole = roleObj.name;
          }
          if (desig) profileData.designationName = desig.name;
        }
        profileData.departmentName = dept.name;
      }
      profileData.organization = org.name;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error('Email already registered');
    }
    
    // Generate a 6-digit OTP
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setMinutes(emailVerificationExpires.getMinutes() + 15); // 15 mins expiry

    const user = new User({ 
      email, 
      passwordHash: password, 
      role, 
      status: UserStatus.ACTIVE,
      emailVerificationToken,
      emailVerificationExpires,
      verificationAttempts: 0
    });
    await user.save();

    await Profile.create({ 
      user: user._id, 
      firstName, 
      lastName,
      ...profileData
    });
    
    // Send email using real SMTP
    await emailService.sendVerificationEmail(email, emailVerificationToken);
    
    await AuditService.log(user._id.toString(), 'REGISTER', user._id.toString(), { role });
    
    return { user: { id: user._id, email: user.email, role: user.role }, token: generateToken(user._id.toString(), user.role) };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email, status: { $ne: UserStatus.INACTIVE } });
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid email or password');
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new Error('Account is suspended');
    }
    
    user.lastLoginAt = new Date();
    await user.save();
    
    await AuditService.log(user._id.toString(), 'LOGIN', user._id.toString(), {});
    return { user: { id: user._id, email: user.email, role: user.role }, token: generateToken(user._id.toString(), user.role) };
  }
  
  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      // Return true to avoid email enumeration
      return true;
    }
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 15); // 15 mins expiry
    
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = expires;
    await user.save();
    
    console.log(`[Email Mock] Password reset OTP sent to ${email}: ${otp}`);
    return true;
  }
  
  static async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await User.findOne({ 
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: new Date() }
    });
    
    if (!user) {
      throw new Error('Invalid or expired reset code');
    }
    
    user.passwordHash = newPassword; // pre-save hook will hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    await AuditService.log(user._id.toString(), 'PASSWORD_RESET', user._id.toString(), {});
    return true;
  }
  
  static async verifyEmail(email: string, otp: string) {
    const user = await User.findOne({ email });
    
    if (!user) throw new Error("User not found");
    if (user.emailVerified) throw new Error("Email is already verified");
    
    if (!user.emailVerificationToken || !user.emailVerificationExpires) {
      throw new Error("No verification code found. Please request a new one.");
    }
    
    if (new Date() > user.emailVerificationExpires) {
      throw new Error("Verification code has expired. Please request a new one.");
    }
    
    if (user.verificationAttempts && user.verificationAttempts >= 5) {
      throw new Error("Too many failed attempts. Please request a new code.");
    }
    
    if (user.emailVerificationToken !== otp) {
      user.verificationAttempts = (user.verificationAttempts || 0) + 1;
      await user.save();
      throw new Error("Invalid verification code");
    }
    
    user.emailVerified = true; 
    user.emailVerificationToken = undefined; 
    user.emailVerificationExpires = undefined;
    user.verificationAttempts = 0;
    await user.save(); 
    return true; 
  }
  
  static async resendVerification(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't leak user existence
      return true;
    }
    
    if (user.emailVerified) {
      throw new Error('Email is already verified');
    }
    
    // Generate new OTP
    const emailVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const emailVerificationExpires = new Date();
    emailVerificationExpires.setMinutes(emailVerificationExpires.getMinutes() + 15);
    
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    user.verificationAttempts = 0;
    await user.save();
    
    await emailService.sendVerificationEmail(email, emailVerificationToken);
    
    return true;
  }
}


