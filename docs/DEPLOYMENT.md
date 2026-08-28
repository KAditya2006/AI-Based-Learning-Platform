# Deployment Guide

The MoSPI Skill Intelligence Platform is fully containerized and deployable to any Docker/Kubernetes environment.

## Single Node Deployment (Docker Compose)
For staging or small internal deployments:
1. Copy the `.env.example` to `.env` and fill in secrets.
2. Run `docker-compose up -d --build`.
3. The API runs on `port 4000`, and the Web Frontend runs on `port 80`.

## Kubernetes Deployment (Recommended)
For high-availability government scale:
1. Build and push the Dockerfiles to your container registry (e.g., AWS ECR or Google Artifact Registry).
2. Use standard `Deployment` and `Service` manifests.
3. **Database**: Use a managed MongoDB service (Atlas, DocumentDB) instead of running stateful sets for DB persistence.
4. **Ingress**: Map your domains and terminate SSL at the Ingress Controller level.

## Health Probes
Configure your Load Balancer or Kubernetes probes to use:
- **Liveness Probe**: `GET /api/health`
- **Readiness Probe**: `GET /api/ready`

This ensures traffic is only routed when the API has successfully established a connection to the MongoDB cluster.
