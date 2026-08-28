# Caching Strategy (Phase 16)

## CacheService Abstraction
- Introduced a central in-memory `CacheService` utilizing the native JS Map with TTL (Time-To-Live) evictions.
- Purpose: Prevent redundant database hits and external API calls for static or infrequently updated data.

## Applied Caching Domains
1. **Metadata Caching**: `Department` and `Role` lookups are cached for 1 hour. These are required on almost every dashboard load but change rarely.
2. **Competency Framework**: The full `Competency` framework is cached for 1 hour.
3. **Analytics Aggregations**: Complex MongoDB aggregations (e.g., Department Intelligence, Role Intelligence, Competency Heatmap) are cached for 15 minutes to prevent DB locks during heavy admin traffic.
4. **AI Generation (Semantic)**: AI contextual skill gap explanations are cached for 24 hours based on a SHA256 hash of the gap conditions and recommended learning options.
