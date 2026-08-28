# Observability Runbook

## Overview
This runbook details how to trace requests, monitor system health, and debug background job failures across the MoSPI Skill Intelligence Platform.

## Structured Logging
The system utilizes `winston` for centralized JSON logging. 

### Core Concepts
- **JSON Format**: All logs in production are strictly output as JSON strings (not pretty-printed) to allow automatic ingestion by log aggregators (e.g., ELK Stack, Datadog, AWS CloudWatch).
- **Log Levels**: 
  - `error`: Fatal system errors, unhandled exceptions, or database disconnects.
  - `warn`: Handled degradation (e.g., Gemini AI timeout, falling back to MockAI).
  - `info`: Key operational milestones (e.g., User Login, Assessment Completion, Job Status transition).
  - `debug`: Disabled in production. Used for deep variable inspection.

### Tracing Requests (Correlation IDs)
Every incoming HTTP request is assigned a unique `X-Correlation-ID` (UUID) via the `requestLogger` middleware. 
This ID is stored in Node's `AsyncLocalStorage` and automatically appended to every `winston` log generated during that request's lifecycle.
- **Why?**: When a failure occurs, you can query your log aggregator for `correlationId: "xxxx-xxxx"` to see the exact sequence of controller, service, and database actions that preceded the error.

## System Health
- **Endpoint**: `GET /api/health`
- **Purpose**: Called every 10 seconds by the container orchestrator (e.g., Kubernetes Liveness Probe).
- **Behavior**: Returns `200 OK` if the Express event loop is healthy and the MongoDB connection is `1` (connected). Returns `503` if the database is disconnected, triggering a pod restart.

## Background Job Observability
Jobs executed by `JobService` (like AI chunking, integration syncing) are detached from the standard HTTP request lifecycle.
- Jobs generate their own logs using the `jobId` as the correlation context.
- **Monitoring Job State**: Admins can view job health in the database (`AIJob` or `IntegrationSyncJob` collections) which tracks `status`, `startedAt`, `completedAt`, and `error` payloads.

## Alerting Thresholds
Operations should configure alerts for the following log patterns:
1. `level: "error"` spiking > 10 occurrences per minute.
2. `message: "AI call failed after max retries"` (Indicates Gemini is down).
3. `message: "Integration sync failed"` (Indicates an external provider API schema may have changed).
