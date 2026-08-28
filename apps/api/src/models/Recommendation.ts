import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  learnerId: mongoose.Types.ObjectId;
  source: 'INTERNAL' | 'IGOT' | 'NSSTA';
  title: string;
  resourceId?: mongoose.Types.ObjectId;
  externalId?: string;
  relatedSkillGapId?: mongoose.Types.ObjectId;
  targetCompetencyId?: mongoose.Types.ObjectId;
  reason: string;
  expectedOutcome?: string;
  estimatedEffortMinutes?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema = new Schema({
  learnerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, enum: ['INTERNAL', 'IGOT', 'NSSTA'], required: true },
  title: { type: String, required: true },
  resourceId: { type: Schema.Types.ObjectId, ref: 'LearningResource' },
  externalId: { type: String },
  relatedSkillGapId: { type: Schema.Types.ObjectId, ref: 'SkillGap' },
  targetCompetencyId: { type: Schema.Types.ObjectId, ref: 'Competency' },
  reason: { type: String, required: true },
  expectedOutcome: { type: String },
  estimatedEffortMinutes: { type: Number },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true }
}, { timestamps: true });

RecommendationSchema.index({ learnerId: 1, priority: -1 });

export const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
