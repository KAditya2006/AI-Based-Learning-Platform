import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICompetency } from './Competency';

export enum SkillGapLevel {
  NO_GAP = 0,
  LOW = 1,
  MODERATE = 2,
  HIGH = 3,
  CRITICAL = 4
}

export interface ISkillGap extends Document {
  learner: IUser['_id'];
  competency: ICompetency['_id'];
  currentLevel: number;
  requiredLevel: number;
  gapSize: number;
  gapClassification: SkillGapLevel;
  evidence?: string;
  lastCalculatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const skillGapSchema = new Schema<ISkillGap>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    currentLevel: { type: Number, required: true, min: 1, max: 5 },
    requiredLevel: { type: Number, required: true, min: 1, max: 5 },
    gapSize: { type: Number, required: true },
    gapClassification: { type: Number, enum: [0, 1, 2, 3, 4], required: true },
    evidence: { type: String },
    lastCalculatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Prevent duplicate skill gap records for the same learner and competency
skillGapSchema.index({ learner: 1, competency: 1 }, { unique: true });

export const SkillGap = mongoose.model<ISkillGap>('SkillGap', skillGapSchema);
