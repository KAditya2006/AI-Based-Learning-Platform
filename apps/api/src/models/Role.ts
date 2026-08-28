import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string;
  code: string; // e.g., 'STATISTICAL_OFFICER'
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>('Role', roleSchema);
