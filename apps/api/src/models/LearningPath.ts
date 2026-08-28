import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningPath extends Document {
  learnerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  sequence: {
    stepIndex: number;
    resourceId?: mongoose.Types.ObjectId;
    externalId?: string;
    source: 'INTERNAL' | 'IGOT' | 'NSSTA';
    title: string;
    reasoning: string;
  }[];
  jobId?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema({
  learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  sequence: [{
    stepIndex: { type: Number, required: true },
    resourceId: { type: Schema.Types.ObjectId, ref: 'LearningResource' },
    externalId: { type: String },
    source: { type: String, enum: ['INTERNAL', 'IGOT', 'NSSTA'], default: 'INTERNAL' },
    title: { type: String, required: true },
    reasoning: { type: String, required: true }
  }],
  jobId: { type: Schema.Types.ObjectId, ref: 'AIJob' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

LearningPathSchema.index({ learnerId: 1, isActive: 1 });

export const LearningPath = mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);
