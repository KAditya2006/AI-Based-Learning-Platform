import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneratedQuestion extends Document {
  jobId: mongoose.Types.ObjectId;
  materialId?: mongoose.Types.ObjectId;
  competencyId?: mongoose.Types.ObjectId;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  aiConfidenceScore?: number;
  sourceReference?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedQuestionSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'AIJob', required: true },
  materialId: { type: Schema.Types.ObjectId, ref: 'Material' },
  competencyId: { type: Schema.Types.ObjectId, ref: 'Competency' },
  text: { type: String, required: true },
  options: [{
    id: { type: String, required: true },
    text: { type: String, required: true }
  }],
  correctOptionId: { type: String, required: true },
  explanation: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'REVIEW', 'APPROVED', 'REJECTED'],
    default: 'DRAFT'
  },
  aiConfidenceScore: { type: Number },
  sourceReference: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const GeneratedQuestion = mongoose.model<IGeneratedQuestion>('GeneratedQuestion', GeneratedQuestionSchema);
