# Background Job Reliability

This platform performs heavy operations asynchronously using `JobService`. Specifically:
1. AI Recommendation generation
2. Material Chunking & Ingestion
3. AI Assessment MCQ Draft generation

## Stale Job Recovery
If the Node server crashes while a job is `PROCESSING`, the job will be stuck. 
At server startup, `JobService.recoverStaleJobs()` automatically runs and transitions any job in `PROCESSING` that is older than 30 minutes to `FAILED`.

## Graceful Draining
On `SIGTERM` / `SIGINT` (e.g. during a Kubernetes scale-down or a manual PM2 restart), the API will stop accepting new HTTP connections and wait up to 10 seconds (`drainActiveJobs(10000)`) for running async jobs to finish gracefully before closing MongoDB connections. This prevents job corruption during normal deployments.
