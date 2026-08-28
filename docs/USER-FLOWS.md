# User Flows & Workflows

## Roles Defined
1. **LEARNER:** The primary user (official) who takes assessments, identifies gaps, and learns.
2. **ADMIN:** Manages the system, workforce data, uploads materials, and reviews AI-generated content.
*(Note: No separate "Trainer" role is needed because content-management workflows for uploading materials and reviewing AI-generated questions can be seamlessly handled by the Admin role using RBAC policies.)*

## Detailed Flows

### A. Learner Onboarding
Learner -> Logs in -> System -> Checks profile completeness -> Database -> Returns status -> Learner prompted to complete profile.

### L. AI MCQ Generation (Admin)
Admin -> Uploads Material -> System -> Stores Material -> AI Service -> Extracts text & generates MCQs -> Database -> Saves Draft MCQs -> Admin notified for review.

### E. Learning Path & G. Assessment
Learner -> Starts Path -> System -> Loads Content -> Learner completes content -> Takes Quiz -> System -> Scores Quiz -> Database -> Saves Attempt -> Next Action: Competency Update.

---

## Workflow Diagrams (Mermaid)

### 1. Overall Platform Workflow
```mermaid
graph TD
    A[Onboarding/Profile] --> B[Competency Assessment]
    B --> C[Skill Gap Identification]
    C --> D[AI Personalized Recommendations]
    D --> E[Learning Path Execution]
    E --> F[Evidence/Quiz]
    F --> G[Competency Profile Update]
    G --> C
```

### 2. Admin Content Workflow
```mermaid
graph LR
    A[Admin Uploads Material] --> B[AI Processing]
    B --> C[MCQ Generation]
    C --> D[Human Review/Edit]
    D --> E[Publish to Question Bank]
    E --> F[Available for Assessments]
```

### 3. AI Architecture Boundary
```mermaid
graph TD
    UI[Frontend] --> API[Backend API]
    API --> AIS[AI Service Layer]
    AIS --> AIP[AI Provider Interface]
    AIP -.->|Future| EXT[External AI Model]
```

### 4. Data Flow (Competency Loop)
```mermaid
sequenceDiagram
    participant L as Learner
    participant S as System
    participant DB as Database
    
    L->>S: Complete Assessment
    S->>DB: Save Results
    S->>S: Calculate Skill Gap
    S->>DB: Update Competency Profile
    S->>L: Show Updated Gaps & New Recommendations
```
