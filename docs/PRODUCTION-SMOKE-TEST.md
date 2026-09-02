# Production Smoke Test Matrix

## Pre-requisites
1. System running in `NODE_ENV=production`.
2. Admin account seeded.
3. MongoDB cluster reachable.

## Step 1: Health & Boot
- [ ] Spin up container via Docker Compose.
- [ ] Monitor logs for standard "Server started on port 3000" message.
- [ ] No `ECONNREFUSED` on database connect.

## Step 2: Auth Flow
- [ ] Login as Learner -> Should succeed.
- [ ] Login as Admin -> Should succeed.

## Step 3: Provider Modes
- [ ] Set `IGOT_PROVIDER_MODE=mock`.
- [ ] Admin Dashboard -> Integration Center should show `Active Mode: MOCK`.
- [ ] Trigger Sync -> Should succeed with 0 errors, importing 3 mock courses.
- [ ] Change to `LIVE` with invalid `IGOT_API_KEY`.
- [ ] Trigger Sync -> Should fail. Audit logs should show `INTEGRATION_SYNC_FAILED`.

## Step 4: AI Fallback
- [ ] Ensure `GEMINI_API_KEY` is invalid or disconnected.
- [ ] Generate Assessment -> Should fallback to deterministic engine without crashing.

## Step 5: Data Isolation
- [ ] As Learner, issue `GET /api/admin/integrations`.
- [ ] Assert `HTTP 403 Forbidden`.
