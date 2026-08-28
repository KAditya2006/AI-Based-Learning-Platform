import mongoose, { Document, Schema } from 'mongoose';

export enum SyncJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS'
}

export interface IIntegrationSyncJob extends Document {
  provider: string; // e.g., 'IGOT', 'NSSTA'
  jobType: 'CATALOG_SYNC' | 'HEALTH_CHECK';
  status: SyncJobStatus;
  startedAt?: Date;
  completedAt?: Date;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errorCount: number;
  errorSummary?: string;
  correlationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const integrationSyncJobSchema = new Schema<IIntegrationSyncJob>(
  {
    provider: { type: String, required: true },
    jobType: { type: String, required: true, enum: ['CATALOG_SYNC', 'HEALTH_CHECK'] },
    status: { type: String, enum: Object.values(SyncJobStatus), default: SyncJobStatus.PENDING },
    startedAt: { type: Date },
    completedAt: { type: Date },
    recordsProcessed: { type: Number, default: 0 },
    recordsCreated: { type: Number, default: 0 },
    recordsUpdated: { type: Number, default: 0 },
    recordsSkipped: { type: Number, default: 0 },
    errorCount: { type: Number, default: 0 },
    errorSummary: { type: String },
    correlationId: { type: String }
  },
  { timestamps: true }
);

integrationSyncJobSchema.index({ provider: 1, status: 1 });
integrationSyncJobSchema.index({ createdAt: -1 });

export const IntegrationSyncJob = mongoose.model<IIntegrationSyncJob>('IntegrationSyncJob', integrationSyncJobSchema);
