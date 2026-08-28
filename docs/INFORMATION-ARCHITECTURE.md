# Information Architecture

## Global Navigation
Avoid deep nesting. Keep the primary navigation accessible on all screens.

### Learner Navigation
- **Primary (Top/Side Bar):** Dashboard | My Profile | Learning | Assessments
- **Secondary (Contextual):** Inside "Learning" -> Recommended | In Progress | Completed
- **Breadcrumbs:** e.g., `Home > Learning > Data Visualization > Module 1`

### Admin Navigation
- **Primary:** Dashboard | Workforce | Content & AI | System Settings
- **Secondary:** Inside "Content & AI" -> Upload | Review MCQs | Question Bank | Published
- **Breadcrumbs:** e.g., `Admin > Content & AI > Review MCQs > Batch #102`

## Mobile Navigation
- Use a bottom tab bar for Learners (Dashboard, Learn, Assess, Profile).
- Admin workflows should degrade gracefully to a hamburger menu on mobile, though primarily designed for Desktop/Tablet use.
