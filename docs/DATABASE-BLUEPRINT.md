# Database Blueprint

## Entities & Relationships

- **User:** Base entity for authentication and profile info. (1:1 Profile)
- **Profile:** Personal details, department, current designation. (N:1 Department)
- **Department:** MoSPI division or associated office. (1:N Users)
- **Role:** System role (Learner, Admin) or Official Designation. (1:N Users)
- **CompetencyFramework:** The master definition of competencies and levels.
- **Competency:** Individual skill defined under the framework. (N:1 Framework)
- **RoleCompetency:** Junction mapping a Role to required Competencies + target levels.
- **CompetencyHistory:** Audit log of changes to a user's competency. (N:1 User)
- **SkillGap:** Computed entity storing the delta between current and required competency. (N:1 User)
- **LearningMaterial:** PDF, Video, or Text uploaded by Admin.
- **LearningResource:** The structured representation of a course/module. (1:N LearningMaterials)
- **LearningPath & LearningPathItem:** Curated sequences of resources.
- **LearningProgress:** Tracks a user's progress through a resource. (N:1 User, N:1 Resource)
- **AIJob:** Tracks async AI tasks (e.g., MCQ generation status).
- **Question:** An individual assessment item, linked to a Competency.
- **QuestionBank:** Collection of approved Questions.
- **Quiz:** An assessment containing specific Questions.
- **QuizAttempt:** User's submission and score. (N:1 User, N:1 Quiz)
- **Recommendation:** AI-generated mapping of a User to a LearningResource based on a SkillGap.
- **Notification:** System alerts.
- **AuditLog:** Security and compliance tracking.
