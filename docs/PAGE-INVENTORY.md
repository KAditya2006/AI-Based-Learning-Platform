# Page Inventory

## PUBLIC
- **Login / SSO Gateway:** `/login` (Authenticate users)

## ONBOARDING
- **Profile Wizard:** `/onboarding/profile` (Collect role, department, baseline data)
- **Initial Self-Assessment:** `/onboarding/assessment` (Establish baseline competencies)

## LEARNER
- **Learner Dashboard:** `/dashboard` (Overview of progress, current gaps, resume learning)
- **Competency Profile:** `/competencies` (Visual map of current vs required skills)
- **Skill Gaps & Recommendations:** `/recommendations` (AI-curated learning paths)
- **Learning Viewer:** `/learn/:courseId` (Content consumption, content-first layout)
- **Assessment Interface:** `/assessment/:quizId` (Focused, distraction-free quiz UI)
- **Learning History:** `/history` (Timeline of completed trainings and evidence)

## ADMIN
- **Workforce Overview:** `/admin/workforce` (Table layout of users and compliance)
- **Analytics Dashboard:** `/admin/analytics` (Charts for organizational skill gaps)
- **Content Management:** `/admin/content` (Upload materials)
- **AI Question Review:** `/admin/questions/review` (Review, edit, approve AI-generated MCQs)
- **Assessment Management:** `/admin/assessments` (Build quizzes from Question Bank)

## Shared UI Patterns
- **Modals:** Used for quick confirmations (e.g., "Submit Assessment").
- **Drawers/Side Panels:** Used for AI Learning Assistant (contextual chat/help).
- **Empty States:** Clear CTA when no skill gaps or pending learnings exist.
- **Loading States:** Skeleton loaders for dashboard and analytics.
