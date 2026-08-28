import mongoose, { Document, Schema } from 'mongoose';

export enum QuestionStatus {
  DRAFT = 'DRAFT',
  REVIEW = 'REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED'
}

export interface IQuestion extends Document {
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  competency: mongoose.Types.ObjectId;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  source: string;
  status: QuestionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: { type: String, required: true },
    options: [{
      id: { type: String, required: true },
      text: { type: String, required: true }
    }],
    correctOptionId: { type: String, required: true },
    explanation: { type: String, required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    difficulty: { type: String, required: true },
    source: { type: String, default: 'INTERNAL' },
    status: { type: String, enum: Object.values(QuestionStatus), default: QuestionStatus.DRAFT }
  },
  { timestamps: true }
);

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
