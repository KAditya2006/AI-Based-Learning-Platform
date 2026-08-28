# MoSPI Skill Platform - Security Review (Phase 10)

This document outlines the security posture of the platform after Phase 10 hardening.

## 1. Authentication & Authorization
- **JWT Lifecycles:** Access tokens are short-lived. Passwords are hashed using `bcryptjs` with a 12-round salt.
- **RBAC (Role-Based Access Control):** Enforced at the router level via the `authorize` middleware. The `UserRole` enum strictly separates `LEARNER` and `ADMIN`.
- **Rate Limiting:** Global rate limit of 100 req/15min. Auth routes (login, register, forgot-password) have a strict 10 req/15min limit.

## 2. API Security
- **Global Error Handler:** Stack traces are explicitly stripped in `NODE_ENV=production`. Consistent `success: false` envelopes prevent unstructured error leakage.
- **Zod Validation:** All incoming payloads are validated via Zod schemas in `validateRequest`.
- **AI Output Validation:** All GenAI responses are now strictly validated against Zod schemas before persistence, preventing AI hallucination crashes.
- **Headers:** Helmet is configured to set secure HTTP headers (HSTS, NoSniff, X-Frame-Options).

## 3. File Processing & Uploads
- **MIME Type Validation:** `multer` strictly filters uploads to `application/pdf`, `docx`, `pptx`, and `txt`.
- **Size Constraints:** Hard limit of 10MB per file to prevent DoS via massive payload ingestion.

## 4. Data Privacy
- **MongoDB:** Using unique indexes to prevent duplicate accounts.
- **Data Segregation:** The Learning Engine queries explicitly filter by `userId` to ensure learners can only access their own assessments and progress.
