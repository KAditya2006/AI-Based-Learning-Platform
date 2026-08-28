# Phase 17 Realistic Dataset

**Date:** August 28, 2026

## Dataset Overview
To validate the platform under production conditions, we created a specialized seed dataset (`phase17-seed.ts`) that accurately mirrors a MoSPI/DIID organizational environment.

### 1. Organizational Structure
- **Departments**: Data Informatics & Innovation Division (DIID), Economic Statistics Division (ESD), National Accounts Division (NAD).
- **Roles**: Junior Statistical Officer (JSO), Senior Statistical Officer (SSO), Assistant Director (AD), Joint Director (JD).

### 2. Competency Framework
- Mapped 4 core competencies across Statistical, Technical, and Leadership domains.
- Assigned realistic required levels (e.g., JD requires Level 5 Leadership, JSO requires Level 2 R programming).

### 3. Edge-Case Personas
- **highperformer@mospi.gov.in (JSO)**: Pre-assessed to Level 5 and 4. Contains zero skill gaps. Tests the system's empty states and lack of AI recommendations.
- **moderate@mospi.gov.in (SSO)**: Contains Level 2 current vs Level 4 required gaps. Tests standard Moderate/Low prioritization generation.
- **severe@mospi.gov.in (JD)**: Contains Level 1 vs Level 5 (Critical) gaps. Tests Insight triggering, high-priority AI semantic caching, and urgent notifications.

### 4. System States
- **Integrations**: Pre-configured `IGOT` as `HEALTHY` and `NSSTA` as `CONFIGURED`.
- **Resources**: Injected internal baseline courses to validate deduplication against external catalogs during testing.
