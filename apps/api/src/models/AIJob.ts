import mongoose, { Schema, Document } from 'mongoose';

export interface IAIJob extends Document {
  type: 'MATERIAL_PROCESSING' | 'MCQ_GENERATION' | 'QUIZ_GENERATION' | 'RECOMMENDATION_GENERATION' | 'LEARNING_PATH_GENERATION' | 'COMPETENCY_ANALYSIS';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  requesterId: mongoose.Types.ObjectId;
  metadata: any;
  resultReference?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AIJobSchema = new Schema({
  type: {
    type: String,
    enum: ['MATERIAL_PROCESSING', 'MCQ_GENERATION', 'QUIZ_GENERATION', 'RECOMMENDATION_GENERATION', 'LEARNING_PATH_GENERATION', 'COMPETENCY_ANALYSIS'],
    required: true
  },
  status: {
    type: String,
    enum: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'QUEUED'
  },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: { type: Schema.Types.Mixed },
  resultReference: { type: Schema.Types.Mixed },
  error: { type: String },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

AIJobSchema.index({ requesterId: 1, status: 1 });

export const AIJob = mongoose.model<IAIJob>('AIJob', AIJobSchema);
