import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICompetency } from './Competency';

export enum AssessmentType {
  SELF = 'SELF',
  SYSTEM = 'SYSTEM',
  QUIZ = 'QUIZ',
  ADMIN = 'ADMIN',
  AI_ASSISTED = 'AI_ASSISTED'
}

export interface ICompetencyAssessment extends Document {
  learner: IUser['_id'];
  competency: ICompetency['_id'];
  assessmentType: AssessmentType;
  score?: number;
  level: number; // 1 to 5
  evidence?: string;
  source?: string; // E.g. "Quiz 101", "Admin John"
  assessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const competencyAssessmentSchema = new Schema<ICompetencyAssessment>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    assessmentType: { type: String, enum: Object.values(AssessmentType), required: true },
    score: { type: Number },
    level: { type: Number, required: true, min: 1, max: 5 },
    evidence: { type: String },
    source: { type: String },
    assessedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

competencyAssessmentSchema.index({ learner: 1, competency: 1 });

export const CompetencyAssessment = mongoose.model<ICompetencyAssessment>('CompetencyAssessment', competencyAssessmentSchema);
