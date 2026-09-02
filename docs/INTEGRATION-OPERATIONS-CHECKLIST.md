# Integration Operations Checklist

## Routine Operations
1. **Triggering Manual Sync**
   - Navigate to `/admin/integrations`.
   - Ensure the Soft Toggle is `ENABLED` and Active Mode is `LIVE` or `MOCK`.
   - Click "Sync Catalog Now".
2. **Monitoring Sync Health**
   - Review the "Recent Sync Jobs" table.
   - If Errors > 0, inspect the "Error Summary".
   - Check the `AuditLogs` collection for `INTEGRATION_SYNC_FAILED` events.

## Recovery Playbook

### Scenario A: Provider API is down
- **Symptom**: Jobs fail with `ECONNABORTED` or `5xx`.
- **Action**: Disable the integration in the UI (Soft Toggle -> Paused). This stops background sync attempts. Wait for vendor confirmation of uptime, then re-enable.

### Scenario B: Provider credentials rotated
- **Symptom**: Jobs fail with `401 Unauthorized` or `403 Forbidden`.
- **Action**: Update `IGOT_API_KEY` or `NSSTA_API_KEY` in the environment. Perform a rolling restart of the API containers.

### Scenario C: Unexpected Data Mapping Errors
- **Symptom**: Sync jobs show partial success or high error counts, but HTTP calls succeed.
- **Action**: Inspect the logs for `IntegrationSyncService`. Competency mapping or schema mismatch might have occurred due to vendor API changes.
