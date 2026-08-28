# Security Architecture

## Authentication & Authorization
- **Authentication:** Standard JWT-based auth, prepared to switch to Government SSO/OAuth when available.
- **RBAC (Role-Based Access Control):** Strict enforcement of Learner vs Admin privileges at the API route level.
- **Password Security:** Bcrypt hashing for local dev/mock auth.
- **Token Strategy:** Short-lived access tokens with HTTP-only secure refresh cookies.

## API & Data Security
- **API Security:** CORS, Rate limiting, and Helmet (HTTP headers) for Express.
- **File Upload Security:** Strict MIME-type checking, file size limits, and malware scanning hooks for Admin document uploads.
- **Sensitive Data Handling:** PII (Personally Identifiable Information) encrypted at rest if required by MoSPI policy.

## AI & Integration Boundaries
- **AI Data Boundaries:** Strict filtering of PII before sending contexts to the External AI Provider. The AI model only receives anonymized text or generic learning materials.
- **Audit Logging:** Every competency update, assessment attempt, and material upload is immutably logged for compliance.
