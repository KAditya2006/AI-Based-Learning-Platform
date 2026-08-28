# Deployment Pipeline Status

**Date:** August 28, 2026

## 1. CI Status (Implemented & Validated)
The repository contains `.github/workflows/ci.yml` which executes on push and pull requests to `main`. It successfully runs:
- `npm ci`
- `npm run build`
- `npm test`

These steps ensure code hygiene and prevent broken artifacts from merging. No production secrets are required to execute the CI pipeline since tests use `mongodb-memory-server` and mock AI providers.

## 2. CD Status (Pending External Infrastructure)
The continuous deployment (CD) automation is **Blocked by external credentials**. 

In order to fully automate deployments to a real staging/production environment, the following credentials and configurations are required:
1. Docker Registry Credentials (e.g., AWS ECR or Docker Hub) to push the built API and Web images.
2. Cloud Deployment Secrets (e.g., `KUBECONFIG` or SSH keys) to trigger the rollout.
3. Production secrets injected securely (not embedded in the GitHub repository).

Until real deployment infrastructure is provisioned by MoSPI/DIID, deployments remain manual via `docker-compose`.
