import mongoose, { Document, Schema } from 'mongoose';
import { IQuestion } from './Question';

export enum AttemptPolicy {
  ONE_ATTEMPT = 'ONE_ATTEMPT',
  MULTIPLE_ATTEMPTS = 'MULTIPLE_ATTEMPTS',
  UNLIMITED = 'UNLIMITED'
}

export interface IAssessment extends Document {
  title: string;
  description: string;
  competency: mongoose.Types.ObjectId;
  passingScore: number; // percentage
  durationMinutes?: number;
  attemptPolicy: AttemptPolicy;
  questions: IQuestion['_id'][];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    passingScore: { type: Number, required: true, min: 0, max: 100 },
    durationMinutes: { type: Number },
    attemptPolicy: { type: String, enum: Object.values(AttemptPolicy), default: AttemptPolicy.UNLIMITED },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
