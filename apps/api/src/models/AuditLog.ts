import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IAuditLog extends Document {
  actor: IUser['_id'] | string; // User ID or 'SYSTEM'
  action: string;
  target?: string;
  metadata?: any;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actor: { type: Schema.Types.Mixed, required: true },
    action: { type: String, required: true },
    target: { type: String },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: false }
);

auditLogSchema.index({ actor: 1, timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
