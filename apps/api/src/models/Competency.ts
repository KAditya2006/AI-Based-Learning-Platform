import mongoose, { Document, Schema } from 'mongoose';
import { ICompetencyFramework } from './CompetencyFramework';

export enum CompetencyDomain {
  STATISTICAL = 'STATISTICAL',
  TECHNICAL = 'TECHNICAL',
  DIGITAL_GOVERNANCE = 'DIGITAL_GOVERNANCE',
  BEHAVIOURAL_MANAGERIAL = 'BEHAVIOURAL_MANAGERIAL'
}

export interface ICompetency extends Document {
  framework: ICompetencyFramework['_id'];
  name: string;
  code: string;
  domain: CompetencyDomain;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const competencySchema = new Schema<ICompetency>(
  {
    framework: { type: Schema.Types.ObjectId, ref: 'CompetencyFramework', required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    domain: { type: String, enum: Object.values(CompetencyDomain), required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Competency = mongoose.model<ICompetency>('Competency', competencySchema);
