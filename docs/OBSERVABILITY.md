# Observability & Logging Strategy

This application utilizes a structured logging approach via `winston` for robust production observability.

## Log Structure
In `production` (`NODE_ENV=production`), all logs are emitted as strict JSON strings to `stdout`. This enables direct ingestion by log aggregators (e.g., Datadog, ELK stack, CloudWatch).

In `development`, logs are pretty-printed with colors and full stack traces.

### The Correlation ID
Every incoming request is assigned a unique `X-Correlation-ID` via the `requestLogger` middleware. This ID is propagated across all logs generated during the request lifecycle using Node's `async_hooks` via `AsyncLocalStorage`.

**Example JSON Log Element:**
```json
{
  "level": "info",
  "message": "AI generation successful",
  "correlationId": "b8455f52-5264-4e2a-bb63-5ff58db41f02",
  "service": "mospi-api",
  "timestamp": "2026-08-28T00:50:38.271Z"
}
```

## Critical Monitored Events
- **AI Failures:** The `GeminiAIProvider` explicitly logs AI provider downtime and retry exhaustion with `{ level: 'error', error: '...' }`.
- **Authentication:** `AuthService` logs successful and failed registration/login attempts.
- **Background Jobs:** `JobService` logs state transitions (`PENDING` -> `PROCESSING` -> `COMPLETED`/`FAILED`).

## Sensitive Data Policy
- **DO NOT** log passwords, even in hashed forms.
- **DO NOT** log JWT tokens.
- **DO NOT** log complete AI prompt completions that contain PII.
- Keep request logging scoped to `method`, `url`, `duration`, and `status`.
