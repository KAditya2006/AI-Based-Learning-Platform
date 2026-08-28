import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICompetency } from './Competency';
import { ICompetencyAssessment } from './CompetencyAssessment';

export interface ICompetencyHistory extends Document {
  learner: IUser['_id'];
  competency: ICompetency['_id'];
  previousLevel?: number;
  newLevel: number;
  source: string;
  reason?: string;
  assessmentReference?: ICompetencyAssessment['_id'];
  timestamp: Date;
}

const competencyHistorySchema = new Schema<ICompetencyHistory>(
  {
    learner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    previousLevel: { type: Number, min: 1, max: 5 },
    newLevel: { type: Number, required: true, min: 1, max: 5 },
    source: { type: String, required: true },
    reason: { type: String },
    assessmentReference: { type: Schema.Types.ObjectId, ref: 'CompetencyAssessment' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
); // explicit timestamp set above, don't need mongoose timestamps for history ledger

competencyHistorySchema.index({ learner: 1, competency: 1, timestamp: -1 });

export const CompetencyHistory = mongoose.model<ICompetencyHistory>('CompetencyHistory', competencyHistorySchema);
