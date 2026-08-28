import mongoose, { Document, Schema } from 'mongoose';

export enum InsightType {
  SKILL_GAP_SPIKE = 'SKILL_GAP_SPIKE',
  CRITICAL_WORKFORCE_GAP = 'CRITICAL_WORKFORCE_GAP',
  LOW_LEARNING_ENGAGEMENT = 'LOW_LEARNING_ENGAGEMENT',
  IMPROVING_COMPETENCY = 'IMPROVING_COMPETENCY',
  STAGNANT_COMPETENCY = 'STAGNANT_COMPETENCY',
  LEARNING_COMPLETION_DROP = 'LEARNING_COMPLETION_DROP',
  ASSESSMENT_PERFORMANCE_CHANGE = 'ASSESSMENT_PERFORMANCE_CHANGE'
}

export enum InsightSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export enum InsightScope {
  LEARNER = 'LEARNER',
  DEPARTMENT = 'DEPARTMENT',
  ROLE = 'ROLE',
  GLOBAL = 'GLOBAL'
}

export interface IInsight extends Document {
  type: InsightType;
  severity: InsightSeverity;
  scope: InsightScope;
  title: string;
  explanation: string;
  supportingMetrics: any;
  targetId?: string; // e.g., Learner ID, Dept ID, Role ID (if not GLOBAL)
  generatedAt: Date;
  expiresAt?: Date;
  isRead: boolean;
}

const insightSchema = new Schema<IInsight>(
  {
    type: { type: String, enum: Object.values(InsightType), required: true },
    severity: { type: String, enum: Object.values(InsightSeverity), required: true },
    scope: { type: String, enum: Object.values(InsightScope), required: true },
    title: { type: String, required: true },
    explanation: { type: String, required: true },
    supportingMetrics: { type: Schema.Types.Mixed },
    targetId: { type: String },
    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

insightSchema.index({ scope: 1, targetId: 1, generatedAt: -1 });

export const Insight = mongoose.model<IInsight>('Insight', insightSchema);
