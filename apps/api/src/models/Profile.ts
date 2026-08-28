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
  department?: IDepartment['_id'];
  designation?: IRole['_id'];
  currentAssignment?: string;
  education?: string;
  workExperience?: string;
  trainingHistory?: string[];
  learningGoals?: string[];
  onboardingStatus: ProfileStatus;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    designation: { type: Schema.Types.ObjectId, ref: 'Role' },
    currentAssignment: { type: String },
    education: { type: String },
    workExperience: { type: String },
    trainingHistory: [{ type: String }],
    learningGoals: [{ type: String }],
    onboardingStatus: { type: String, enum: Object.values(ProfileStatus), default: ProfileStatus.NOT_STARTED }
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
