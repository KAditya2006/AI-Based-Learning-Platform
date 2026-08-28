# Integration Architecture

## Philosophy
Do not fabricate government APIs. All external systems communicate through abstract provider interfaces.

## Key Integrations

### iGOT Karmayogi (WAITING FOR OFFICIAL API DETAILS)
- **Purpose:** Synchronize competency profiles and push completed learning evidence.
- **Interface:** `iGOTProvider`

### NSSTA / TPAC (WAITING FOR OFFICIAL API DETAILS)
- **Purpose:** Sync official training programme calendars and rosters.
- **Interface:** `ProgrammeProvider`

### Email / Notifications (MOCK)
- **Purpose:** Send OTPs, assessment reminders, and gap alerts.
- **Interface:** `EmailProvider` (SMTP or AWS SES eventually)

### Storage (MOCK)
- **Purpose:** Securely store uploaded PDFs and learning materials.
- **Interface:** `StorageProvider` (AWS S3 or Government Cloud Storage)

### AI Service (MOCK)
- **Purpose:** Content extraction, MCQ generation.
- **Interface:** `AIProvider` (Documented in AI-ARCHITECTURE.md)
