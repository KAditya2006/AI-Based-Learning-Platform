# Database Production Behavior

## Connections
In production (`NODE_ENV=production`), the Mongoose connection implements a retry strategy. If the database is initially unreachable on boot, it retries up to 5 times with a 5-second backoff. This ensures robust initialization in environments like Kubernetes where DB containers may boot slower than API containers.

## Graceful Shutdown
Upon receiving an interrupt signal, Mongoose will cleanly disconnect via `mongoose.connection.close(false)`, preventing socket hangs.

## Indexes
Compound indexes exist and are actively validated during schema compilation to ensure horizontal scalability:
- `LearningResource`: `{ isActive: 1, competencies: 1 }`
- `SkillGap`: Encapsulated via reference and unique identifiers
- `CompetencyAssessment`: Optimized for timestamp rollups.

> **Note on Migration**: Mongoose automatically calls `createIndexes()` on boot. In highly constrained production environments, you may want to set `autoIndex: false` and manage indexes manually.
