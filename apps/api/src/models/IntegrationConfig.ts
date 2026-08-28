import mongoose, { Document, Schema } from 'mongoose';

export enum IntegrationStatus {
  DISABLED = 'DISABLED',
  CONFIGURED = 'CONFIGURED',
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface IIntegrationConfig extends Document {
  provider: string; // e.g., 'IGOT', 'NSSTA'
  isEnabled: boolean;
  environment: 'TEST' | 'PRODUCTION';
  capabilities: string[]; // e.g., 'CATALOG_SYNC', 'PROGRESS_SYNC'
  lastHealthCheckAt?: Date;
  lastSuccessfulSyncAt?: Date;
  status: IntegrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const integrationConfigSchema = new Schema<IIntegrationConfig>(
  {
    provider: { type: String, required: true, unique: true },
    isEnabled: { type: Boolean, default: false },
    environment: { type: String, enum: ['TEST', 'PRODUCTION'], default: 'TEST' },
    capabilities: [{ type: String }],
    lastHealthCheckAt: { type: Date },
    lastSuccessfulSyncAt: { type: Date },
    status: { type: String, enum: Object.values(IntegrationStatus), default: IntegrationStatus.DISABLED }
  },
  { timestamps: true }
);

export const IntegrationConfig = mongoose.model<IIntegrationConfig>('IntegrationConfig', integrationConfigSchema);
