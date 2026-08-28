# Integration Governance

## Overview
The platform connects to multiple external catalogs, notably **iGOT Karmayogi** and **NSSTA Programme Providers**. This governance document details how external provider boundaries are enforced to prevent third-party failures from cascading into the MoSPI platform.

## Integration Architecture
- **Adapter Pattern**: All integrations implement the `IntegrationProvider` interface. The core platform never calls external APIs directly; it strictly routes through these adapters.
- **Control Plane**: The `IntegrationConfig` model and `IntegrationSyncService` manage the health and sync cadence of all providers.

## Reliability Controls

### 1. Idempotency & Duplicate Prevention
- When importing catalogs, the Sync Engine relies on the `externalId` and `provider` composite key.
- If a course is imported twice, the system issues an `update` (Upsert) rather than creating duplicate `LearningResource` entities.

### 2. Timeouts & Retries
- HTTP connections to external providers are bound by strict timeouts (e.g., 30s).
- Retries are handled within the adapter logic. If a provider fails continuously, the Sync Job transitions to `FAILED`.

### 3. Partial Failures & Safe Degradation
- If the iGOT Sync fails, internal courses and the Learner Dashboard remain 100% operational.
- The `IntegrationSyncJob` logs the exact batch and index of the failure, allowing Admins to review the failure stack in the `/admin/integrations` dashboard.

### 4. Normalization
- External platforms utilize diverse taxonomic structures. The adapter is responsible for mapping external tags into the MoSPI `Competency` framework. If an external tag does not match an internal Competency, it is routed to an 'Unmapped' queue rather than crashing the import.

### 5. Provenance Tracking
- Every imported resource carries its `provider` identity (e.g., `IGOT`).
- In the Learner UI, external courses explicitly display a warning/badge indicating that execution and tracking will occur on an external portal, preserving clarity for the end-user.

## Disabling Providers
- If an external provider suffers an extended outage or security breach, an Admin can toggle the provider to `DISABLED` via the Control Plane. 
- Disabling a provider immediately halts sync jobs and hides its courses from new AI Recommendations.
