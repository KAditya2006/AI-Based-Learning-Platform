import mongoose, { Schema, Document } from 'mongoose';

export interface IAIRequestLog extends Document {
  operation: string;
  requesterId: string;
  provider: string;
  modelName: string;
  status: 'SUCCESS' | 'ERROR';
  durationMs: number;
  jobId?: string;
  resourceReference?: string;
  errorDetails?: string;
  createdAt: Date;
}

const AIRequestLogSchema = new Schema({
  operation: { type: String, required: true },
  requesterId: { type: String, required: true },
  provider: { type: String, required: true },
  modelName: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'ERROR'], required: true },
  durationMs: { type: Number, required: true },
  jobId: { type: String },
  resourceReference: { type: String },
  errorDetails: { type: String }
}, { timestamps: { createdAt: true, updatedAt: false } });

AIRequestLogSchema.index({ requesterId: 1, createdAt: -1 });

export const AIRequestLog = mongoose.model<IAIRequestLog>('AIRequestLog', AIRequestLogSchema);
