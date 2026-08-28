import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: mongoose.Types.ObjectId;
  processingStatus: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
  failureReason?: string;
  pageCount?: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  processingStatus: {
    type: String,
    enum: ['UPLOADED', 'PROCESSING', 'READY', 'FAILED'],
    default: 'UPLOADED'
  },
  failureReason: { type: String },
  pageCount: { type: Number },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

MaterialSchema.index({ uploadedBy: 1, processingStatus: 1 });

export const Material = mongoose.model<IMaterial>('Material', MaterialSchema);
