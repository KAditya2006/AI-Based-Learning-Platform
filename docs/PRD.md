# Product Requirements Document (PRD)
## AI-enabled Skill Intelligence & Personalized Learning Platform

### 1. Problem Statement & Background
The Ministry of Statistics & Programme Implementation (MoSPI) - Data Informatics & Innovation Division (DIID) requires a modern, AI-enabled learning platform for officials in India's Official Statistical System. The goal is to dynamically assess competencies, identify skill gaps, and provide hyper-personalized learning interventions. The platform must ultimately support training programmes under NSSTA/TPAC and integrate with iGOT Karmayogi.

### 2. Target Users & Personas
- **Learner (MoSPI Official/Statistician):** Requires continuous upskilling in statistical, technical, and digital governance domains. Needs a clear view of their competencies, gaps, and targeted recommendations.
- **Administrator (MoSPI HR/DIID/Training Head):** Requires oversight of workforce capabilities, analytics on skill gaps, and the ability to upload/manage learning materials and assessments.

### 3. Product Vision, Goals, & Objectives
**Vision:** To build a future-ready, data-driven statistical workforce for India through continuous, personalized learning and objective competency tracking.
**Goals:**
1. Objectively map and track the competencies of officials.
2. Automate the generation of high-quality assessments (MCQs/Quizzes) from official materials using AI.
3. Deliver personalized learning paths that close identified skill gaps.

### 4. Unique Selling Proposition (USP)
A closed-loop, data-driven competency framework tailored for government statistical officials, enhanced by an AI engine that converts static official documents into interactive learning and assessment modules.

### 5. Scope & Out of Scope
**In Scope:**
- Competency profiling and skill gap analysis.
- AI-driven MCQ generation from uploaded learning materials.
- Personalized learning recommendations.
- Workforce analytics dashboards for Admins.
- Mock external provider integrations (AI, iGOT).

**Out of Scope (for initial phases):**
- Real-time synchronous video training.
- Complete HRMS replacement.
- Direct deployment to iGOT production (only APIs will be prepped).

### 6. Functional Requirements
- **Learner:** Must be able to view their profile, take assessments, view skill gaps, and complete recommended learning paths.
- **Admin:** Must be able to manage users, view workforce analytics, upload materials, trigger AI question generation, and review/publish questions.
- **AI:** Must generate MCQs, provide contextual learning assistance, and match learning materials to skill gaps.
- **Assessment:** Must provide secure, timed (if necessary), and randomized quizzes.
- **Learning:** Must track progress, completion, and update competency scores based on evidence.
- **Analytics:** Must aggregate data on learning outcomes and workforce readiness.

### 7. Non-Functional Requirements
- **Integration:** Must use provider abstractions for AI, Email, Storage, and iGOT.
- **Security:** Must implement strict RBAC, secure APIs, audit logging, and clear AI data boundaries.
- **Accessibility:** Must comply with WCAG 2.1 AA standards for government platforms.
- **Responsive:** Must support Mobile, Tablet, and Desktop layouts seamlessly.

### 8. Success Metrics
- Percentage of users with completed competency profiles.
- Reduction in identified skill gaps over 6 months.
- Time saved by admins using AI for assessment generation (vs manual).
- User engagement rate with recommended learning paths.
