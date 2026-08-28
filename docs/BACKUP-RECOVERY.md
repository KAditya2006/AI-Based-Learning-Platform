# Backup & Disaster Recovery Strategy

## MongoDB Backups
Since all state, progress, and generated AI content is persisted exclusively in MongoDB, backups must target the database layer.

1. **Managed Service (Atlas)**: Enable continuous point-in-time recovery (PITR).
2. **Self-Hosted**: If self-hosting, use `mongodump` via a cron job and push archives to encrypted S3 buckets.

### What needs backing up?
- `users`: Core identity and profiles
- `competencyassessments`: Immutable history of skill progression
- `aijobs`: Audit trails of AI interactions
- `learningresources`: Content links and metadata

## Application Recovery
The Node.js and React applications are completely **stateless**. If the infrastructure is lost:
1. Restore MongoDB from backup.
2. Spin up new Docker containers for `api` and `web`.
3. Ensure `.env` secrets (especially `JWT_SECRET`) are preserved securely in a vault. **WARNING: If `JWT_SECRET` changes, all active users will be logged out, but data is preserved.**
