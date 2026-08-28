# Integration Control Plane Runbook

This guide details operational procedures for monitoring, troubleshooting, and managing external integrations (e.g., iGOT, NSSTA).

## 1. Monitoring Provider Health

Providers expose real-time status through the **Admin Integration Center** (`/admin/integrations`).

Statuses include:
- **DISABLED**: The provider feature flag is off or it has been manually disabled by an admin.
- **CONFIGURED**: The provider is enabled but hasn't had a successful health check or sync.
- **HEALTHY**: The provider is responding to health checks and syncs properly.
- **UNAVAILABLE**: The provider failed its latest health check.

## 2. Catalog Synchronization Engine

Synchronization runs via `IntegrationSyncService` and relies on the backend `JobService`.
Manual syncs can be triggered from the Admin UI.

### Normalization & Deduplication
- The engine uses the combination of `provider + externalId` to strictly deduplicate resources.
- If an existing resource is found, metadata (title, description, tags) is updated.
- If a provider is temporarily unavailable, **no local mappings are deleted**, ensuring learners do not lose progress or recommendations pointing to existing catalog items.

## 3. Debugging Synchronization Jobs

If a sync job fails:
1. Check the **Sync History** table in the Admin UI.
2. Note the `correlationId` assigned to the job.
3. Search the backend Winston logs (e.g., `cat logs/error.log | grep correlationId`) for stack traces.
4. If a partial failure occurs (`PARTIAL_SUCCESS`), check the `errorCount` field. This typically indicates malformed payload entries that were skipped, while valid entries were processed.

## 4. Safety Considerations

- Provider HTTP endpoints are strictly isolated to the backend (`IntegrationSyncService`). The frontend NEVER contacts an external provider API directly.
- The platform strips and sanitizes all external IDs.
- AI Recommendations explicitly brand non-internal resources using provenance badges (e.g., `[IGOT]`) to prevent confusion.
