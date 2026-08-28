import mongoose, { Document, Schema } from 'mongoose';

export interface ICompetencyFramework extends Document {
  name: string;
  version: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const competencyFrameworkSchema = new Schema<ICompetencyFramework>(
  {
    name: { type: String, required: true, trim: true },
    version: { type: String, required: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CompetencyFramework = mongoose.model<ICompetencyFramework>('CompetencyFramework', competencyFrameworkSchema);
