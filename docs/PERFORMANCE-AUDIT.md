# Performance Audit (Phase 12)

Prior to launch, the following structural decisions guarantee performance and scalability.

## Backend
- **Stateless Architecture**: Express relies solely on JWTs for auth; there are no memory-bound sessions.
- **Async Operations**: Slow tasks (AI interactions) are handled via `JobService.executeAsync`, instantly freeing the HTTP thread pool.
- **Connection Pooling**: Mongoose manages its own persistent connection pool to MongoDB, eliminating TCP handshake overhead on queries.
- **Indexing**: All high-throughput queries (auth lookups, competency tracking) use explicit indexes.

## Frontend
- **Vite Bundling**: Produces optimized static assets with ES build.
- **Nginx Gzip**: In production, the Nginx container serves the static assets with `gzip` compression enabled, massively reducing payload size for slow government networks.
- **Caching**: The Nginx config forces `Cache-Control` on all immutable assets (JS/CSS/images).

## Database
- No long-running aggregations on the main thread.
- If data scales past 10M records, consider sharding on `userId` or migrating historical `AuditLog` items to cold storage.
