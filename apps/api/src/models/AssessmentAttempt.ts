import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IAssessment } from './Assessment';

export interface IAssessmentAttempt extends Document {
  learner: IUser['_id'];
  assessment: IAssessment['_id'];
  answers: { questionId: string; selectedOptionId: string }[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
}

const assessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    answers: [{
      questionId: { type: String, required: true },
      selectedOptionId: { type: String, required: true }
    }],
    score: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    startedAt: { type: Date, required: true },
    completedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ learner: 1, assessment: 1 });

export const AssessmentAttempt = mongoose.model<IAssessmentAttempt>('AssessmentAttempt', assessmentAttemptSchema);
