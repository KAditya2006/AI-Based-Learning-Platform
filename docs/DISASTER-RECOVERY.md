# Disaster Recovery & Backup Strategy

## Overview
This document outlines the disaster recovery (DR) protocols, backup mechanisms, and acceptable loss thresholds for the AI Skill Intelligence Platform. 

## Objectives
- **Recovery Point Objective (RPO)**: 1 Hour. In the event of a total systemic failure, no more than 60 minutes of assessment or enrollment data should be lost.
- **Recovery Time Objective (RTO)**: 4 Hours. The platform must be fully operational and serving traffic within 4 hours of a declared disaster.

## Backup Strategy
The database acts as the single source of truth (state). File assets (PDFs) are assumed to be stored in an S3-compatible blob store which maintains its own versioning/replication.

### MongoDB Backup Scripts
Automated scripts are provided in the `/scripts` directory:
- `backup-db.sh`: Dumps the target MongoDB database into a gzipped archive.
- `restore-db.sh`: Restores the database from a given archive (drops existing tables first).
- `verify-backup.sh`: Dry-runs the archive to ensure structural integrity without overwriting live data.

### Retention Policy
- **Hourly Backups**: Retained for 48 hours.
- **Daily Backups**: Retained for 30 days.
- **Weekly Backups**: Retained for 1 Year (Off-site / S3).

## Failure Scenarios & Runbooks

### 1. Database Corruption or Accidental Deletion
**Detection**: MongoDB logs fatal errors, or application `500`s cascade on DB reads.
**Action**: 
1. Pause frontend traffic (Enable maintenance mode at the load balancer).
2. Execute `./scripts/restore-db.sh` using the most recent verified hourly backup.
3. Restart backend pods to flush connection pools.

### 2. Application Crash / Failed Deployment
**Detection**: `GET /api/health` returns `503` or timeouts.
**Action**:
1. Revert to the previous Docker Image tag via standard CI/CD deployment rollback.
2. The database is NOT rolled back unless a bad migration explicitly corrupted schema data.

### 3. AI Provider Outage (Gemini Down)
**Detection**: High latency on AI routes, falling back to `MockAIProvider` warnings in Winston logs.
**Action**:
1. Zero direct action required. The system is designed to degrade gracefully.
2. `MockAIProvider` will handle recommendations and assessments deterministically until Gemini connectivity is restored.

### 4. Integration Provider Outage (iGOT / NSSTA Down)
**Detection**: `IntegrationSyncJob` fails consecutively.
**Action**:
1. Navigate to Admin Integration Center.
2. Temporarily toggle the failing provider to `DISABLED`.
3. Internal learning and AI logic will continue uninterrupted. Re-enable when provider APIs are verified stable.

### 5. Background-Job Failure (Stuck Jobs)
**Detection**: Jobs remain in `RUNNING` state beyond the 30-minute threshold.
**Action**:
1. The `JobService.recoverStaleJobs()` automatically runs on application boot.
2. Restarting the `api` container will force a sweep of stale jobs and reset them to `FAILED`, preventing silent deadlocks.
