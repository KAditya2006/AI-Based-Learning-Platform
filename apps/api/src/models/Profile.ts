import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IDepartment } from './Department';
import { IRole } from './Role';

export enum ProfileStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface IProfile extends Document {
  user: IUser['_id'];
  firstName: string;
  lastName: string;
  
  // Legacy references (kept for backward compatibility)
  department?: IDepartment['_id'];
  designation?: IRole['_id'];
  currentAssignment?: string;
  education?: string;
  workExperience?: string;
  trainingHistory?: string[];
  learningGoals?: string[];
  
  // New Comprehensive Registration Fields
  mobileNumber?: string;
  employeeId?: string;
  organization?: string;
  departmentName?: string;
  designationName?: string;
  functionalRole?: string;
  
  experience?: {
    totalExperience: string;
    currentRoleExperience: string;
    previousDesignation: string;
    previousOrganization: string;
    majorResponsibilities: string;
  };
  
  skills?: {
    skill: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  }[];
  
  learningPreferences?: {
    preferredFormats: string[];
    preferredLanguage: string;
    learningGoals: string[];
  };

  onboardingStatus: ProfileStatus;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    
    // Legacy
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    designation: { type: Schema.Types.ObjectId, ref: 'Role' },
    currentAssignment: { type: String },
    education: { type: String },
    workExperience: { type: String },
    trainingHistory: [{ type: String }],
    learningGoals: [{ type: String }],
    
    // New Fields
    mobileNumber: { type: String },
    employeeId: { type: String },
    organization: { type: String },
    departmentName: { type: String },
    designationName: { type: String },
    functionalRole: { type: String },
    
    experience: {
      totalExperience: { type: String },
      currentRoleExperience: { type: String },
      previousDesignation: { type: String },
      previousOrganization: { type: String },
      majorResponsibilities: { type: String }
    },
    
    skills: [
      {
        skill: { type: String },
        proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
      }
    ],
    
    learningPreferences: {
      preferredFormats: [{ type: String }],
      preferredLanguage: { type: String },
      learningGoals: [{ type: String }]
    },

    onboardingStatus: { type: String, enum: Object.values(ProfileStatus), default: ProfileStatus.NOT_STARTED }
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
