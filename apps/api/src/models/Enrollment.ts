import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ILearningResource } from './LearningResource';

export enum EnrollmentStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED'
}

export interface IEnrollment extends Document {
  learner: IUser['_id'];
  resource: ILearningResource['_id'];
  status: EnrollmentStatus;
  progressPercentage: number;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resource: { type: Schema.Types.ObjectId, ref: 'LearningResource', required: true },
    status: { type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.IN_PROGRESS },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate active enrollments
enrollmentSchema.index({ learner: 1, resource: 1 }, { unique: true });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
