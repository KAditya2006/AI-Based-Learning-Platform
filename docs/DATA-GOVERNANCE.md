# Data Governance & Lifecycle Management

## Overview
This document establishes the persistence policies, ownership rules, and archival strategies for the core collections within the AI Skill Intelligence Platform.

## Principles
- **Auditability First**: Historical competency and assessment records are **never** deleted merely for cleanup.
- **Data Minimization**: AI workloads only receive masked or minimized data.
- **Integrity**: Referential integrity (e.g., a Skill Gap referencing a Competency) is maintained via soft-deletes or explicit cascaded archival processes.

## Collection Lifecycle Policies

### 1. User & Profile
- **Owner**: Administration / SSO Provider.
- **Retention**: Indefinite while actively employed. 
- **Deletion Policy**: Soft-delete (`isActive: false`). Profiles are never hard deleted to preserve historical learning context and aggregate intelligence.
- **Sensitive Fields**: Passwords (bcrypt hashed). Do not export or log.

### 2. Competency Framework (`Competency`)
- **Owner**: Admin / Domain Experts.
- **Retention**: Indefinite.
- **Deletion Policy**: Soft-delete (`isActive: false`). 
- **Archival**: Modifying a competency's core requirements creates a new version; the old version is maintained for historical assessment accuracy.

### 3. Learner Progression (`CompetencyHistory`, `SkillGap`)
- **Owner**: System (Deterministic Engine).
- **Retention**: Indefinite.
- **Deletion Policy**: Hard-deletion is strictly prohibited. `CompetencyHistory` serves as the immutable ledger of an official's skill growth.
- **Indexing**: High read-throughput. Compound indexes heavily utilize `userId` and `timestamp`.

### 4. Assessments (`Assessment`, `AssessmentAttempt`, `Question`)
- **Owner**: Admin (Creation), Learner (Attempts).
- **Retention**: 7 Years minimum compliance retention for public officials' records.
- **Archival**: Assessment attempt raw JSON snapshots can be offloaded to cold storage (e.g., S3 Glacier) after 24 months, provided the aggregate `CompetencyHistory` score remains in the hot database.

### 5. Learning Resources & Enrollments (`LearningResource`, `Enrollment`, `LearningPath`)
- **Owner**: Integration Engine (External) / Admin (Internal).
- **Retention**: Indefinite (Resource), Learner lifecycle (Enrollments).
- **Deletion**: Obsolete courses from external catalogs are soft-deleted or marked `isArchived: true` if the provider sync removes them.

### 6. AI Subsystem (`Material`, `MaterialChunk`, `AIJob`)
- **Owner**: Admin / System.
- **Retention**: 30 Days (for intermediate Chunks/Jobs).
- **Deletion Policy**: `MaterialChunk` and `AIJob` records can be safely hard-deleted after processing is successfully verified or after 30 days to save DB capacity. `Material` metadata remains.

### 7. Intelligence & Analytics (`Insight`, `IntegrationSyncJob`)
- **Owner**: System.
- **Retention**: 12 Months (Hot Storage).
- **Deletion Policy**: Routine cleanup scripts can permanently purge `IntegrationSyncJob` logs older than 90 days. `Insight` events older than 12 months can be aggregated and purged.

### 8. System Auditing (`AuditLog`)
- **Owner**: Security / Compliance.
- **Retention**: 7 Years (Compliance Requirement).
- **Archival**: After 12 months, Logs can be exported to secure WORM (Write-Once-Read-Many) storage. Hard deletions inside the DB are explicitly prohibited.
