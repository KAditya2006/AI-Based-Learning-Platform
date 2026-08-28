# Phase 16 Performance Audit

## 1. Database Queries & N+1 Problems
- **Finding**: Widespread use of `.find()` without `.lean()`.
- **Affected Components**: Almost all controllers (`quizController.ts`, `learningController.ts`, `skillGapController.ts`) and services (`CompetencyService.ts`, `PersonalizationService.ts`).
- **Severity**: MEDIUM/HIGH. Mongoose hydration is extremely expensive for read-only lists and consumes excessive Node memory.
- **Recommendation**: Append `.lean()` to all read-only `find()` queries.

- **Finding**: N+1 Queries in `IntegrationSyncService.ts`.
- **Affected Components**: `IntegrationSyncService.syncCatalog`.
- **Severity**: HIGH. Loops through `externalResources` and awaits `Competency.findOne` and `LearningResource.findOne`, then calls `.save()`. For a catalog of 10,000 courses, this is 30,000 synchronous DB round-trips.
- **Recommendation**: Replace loop with `bulkWrite` for resources and `find({ name: { $in: tags } })` for competencies to batch the queries.

- **Finding**: Unbounded List Queries.
- **Affected Components**: `Competency.find()`, `LearningResource.find()`, `Question.find()`.
- **Severity**: HIGH. If the DB contains 5,000 resources, fetching the library will crash the Node event loop and the frontend browser.
- **Recommendation**: Implement `limit` and `skip` pagination on all list endpoints. Enforce maximum limits (e.g., `limit(100)`).

## 2. API & Caching
- **Finding**: Zero Caching on Static/Semi-Static Reference Data.
- **Affected Components**: `CompetencyService.ts`, `profileController.ts` (fetching Departments/Roles).
- **Severity**: MEDIUM. Every dashboard load hits MongoDB for Departments, Roles, and the Competency Framework, which rarely changes.
- **Recommendation**: Introduce a central `CacheService` using `node-cache` with explicit TTLs (e.g., 1 hour) for `Department`, `Role`, and `Competency` lists.

## 3. Background Jobs
- **Finding**: Job starvation and infinite processing risks.
- **Affected Components**: `JobService.executeAsync`.
- **Severity**: MEDIUM. `JobService.activeJobs` uses an unbounded Set of promises. If 1,000 users request AI chat simultaneously, it will spawn 1,000 floating Promises, exhausting memory.
- **Recommendation**: Implement a simple concurrency bounded queue, or at least bound the max parallel `JobService` invocations.
- **Finding**: `recoverStaleJobs` simply marks them `FAILED`.
- **Recommendation**: If it's a catalog sync, this is fine. But for AI operations, we might want bounded retries.

## 4. External Integrations
- **Finding**: Integration Sync Job does not handle pagination from external providers.
- **Affected Components**: `IGOTProvider.ts`, `ProgrammeProvider.ts`.
- **Severity**: HIGH. Assuming the external provider returns the entire catalog in one HTTP response is extremely dangerous.
- **Recommendation**: Ensure adapters accept pagination, and `IntegrationSyncService` loops through paginated external pages.

## 5. AI Cost & Latency
- **Finding**: Uncached AI Recommendations.
- **Affected Components**: `PersonalizationService.ts`.
- **Severity**: HIGH (Cost). The same SkillGap profile string sent to Gemini by 1,000 Data Analysts will generate 1,000 identical AI calls.
- **Recommendation**: Hash the `SkillGap` severity input string. If identical, return the cached AI explanation from `CacheService`. (Only cache the explanation string, not the deterministic priority).

## 6. Analytics Optimizations
- **Finding**: `AnalyticsService` does full collection aggregations.
- **Severity**: LOW currently, HIGH at scale.
- **Recommendation**: Introduce caching for `getDepartmentIntelligence` and `getRoleIntelligence` (e.g., update every 15 minutes instead of live on every Admin page load).
