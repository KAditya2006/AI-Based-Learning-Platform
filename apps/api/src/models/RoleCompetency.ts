import mongoose, { Document, Schema } from 'mongoose';
import { IRole } from './Role';
import { ICompetency } from './Competency';

export interface IRoleCompetency extends Document {
  role: IRole['_id'];
  competency: ICompetency['_id'];
  requiredLevel: number; // 1 to 5
  createdAt: Date;
  updatedAt: Date;
}

const roleCompetencySchema = new Schema<IRoleCompetency>(
  {
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    competency: { type: Schema.Types.ObjectId, ref: 'Competency', required: true },
    requiredLevel: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true }
);

// Prevent duplicate mappings for the same role and competency
roleCompetencySchema.index({ role: 1, competency: 1 }, { unique: true });

export const RoleCompetency = mongoose.model<IRoleCompetency>('RoleCompetency', roleCompetencySchema);
