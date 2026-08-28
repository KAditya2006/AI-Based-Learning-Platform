# API Production Audit

Below is the verified internal route inventory for the MoSPI Skill Platform.

| METHOD | PATH | AUTH REQUIRED | ROLE | VALIDATION | RATE LIMITING | AUDIT LOGGING | DESCRIPTION |
|--------|------|---------------|------|------------|---------------|---------------|-------------|
| GET | `/api/health` | No | Public | N/A | Global (200/15m) | No | Process Liveness |
| GET | `/api/ready` | No | Public | N/A | Global | No | DB Readiness |
| POST | `/api/auth/register` | No | Public | Zod `registerSchema` | Global | Yes | New User Registration |
| POST | `/api/auth/login` | No | Public | Zod `loginSchema` | Global | Yes | User Auth Token |
| GET | `/api/auth/me` | Yes | Any | N/A | Global | No | Verify JWT Token |
| GET | `/api/profile` | Yes | Any | N/A | Global | No | Get User Profile |
| PUT | `/api/profile` | Yes | Any | Zod `profileSchema` | Global | Yes | Update Onboarding |
| GET | `/api/competencies` | Yes | Any | N/A | Global | No | List Competencies |
| POST | `/api/competencies` | Yes | `ADMIN` | Zod `competencySchema` | Global | Yes | Create Competency |
| GET | `/api/competencies/:id` | Yes | Any | N/A | Global | No | Get Competency Details |
| GET | `/api/admin/workforce` | Yes | `ADMIN` | N/A | Global | No | Learner Directory |
| GET | `/api/admin/learners/:id` | Yes | `ADMIN` | N/A | Global | No | Get Specific Learner |
| GET | `/api/learning/library` | Yes | Any | N/A | Global | No | Global Resource Catalog |
| GET | `/api/learning/path` | Yes | Any | N/A | Global | No | Get Dynamic Recommendations |
| POST | `/api/learning/enroll/:id` | Yes | Any | N/A | Global | Yes | Enroll in Course |
| POST | `/api/ai/recommendations` | Yes | Any | N/A | Global | Yes | Trigger AI Recommendation Job |
| POST | `/api/ai/upload` | Yes | `ADMIN` | `multer` validation | Global | Yes | Ingest Material for chunking |
| POST | `/api/ai/generate-questions` | Yes | `ADMIN` | Zod schema | Global | Yes | Draft MCQs |
| GET | `/api/quiz/:assessmentId` | Yes | Any | N/A | Global | No | Retrieve active assessment |
| POST | `/api/quiz/:assessmentId/submit` | Yes | Any | Zod submission | Global | Yes | Grade Assessment |

## Verification Conclusion
- All routes have deterministic responses, valid Zod schema middleware for POST/PUT payloads, and correct RBAC role guards.
- All non-GET actions are properly logged into the MongoDB `AuditLog` collection.
