import mongoose, { Document, Schema } from 'mongoose';

export enum ResourceSource {
  INTERNAL = 'INTERNAL',
  IGOT = 'IGOT',
  NSSTA = 'NSSTA',
  TPAC = 'TPAC'
}

export interface ILearningResource extends Document {
  title: string;
  description: string;
  provider: string;
  source: ResourceSource;
  type: 'COURSE' | 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE';
  durationMinutes: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  competencies: mongoose.Types.ObjectId[];
  externalId?: string;
  externalUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const learningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    provider: { type: String, required: true },
    source: { type: String, enum: Object.values(ResourceSource), default: ResourceSource.INTERNAL },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    difficulty: { type: String, required: true },
    competencies: [{ type: Schema.Types.ObjectId, ref: 'Competency' }],
    externalId: { type: String },
    externalUrl: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

learningResourceSchema.index({ isActive: 1, competencies: 1 });

export const LearningResource = mongoose.model<ILearningResource>('LearningResource', learningResourceSchema);
