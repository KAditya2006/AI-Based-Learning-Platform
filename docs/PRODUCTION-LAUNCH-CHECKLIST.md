# Production Launch Checklist

Follow these steps meticulously to deploy the MoSPI Skill Intelligence Platform to the live production environment.

## 1. Infrastructure Preparation
- [ ] Provision MongoDB Atlas Production Cluster (M10 or higher recommended).
- [ ] Whitelist production API IP addresses in MongoDB Atlas.
- [ ] Obtain Google Gemini API Key for Production.
- [ ] Generate a secure 64-character hex string for `JWT_SECRET`.
- [ ] Provision Kubernetes cluster or Docker Swarm nodes.
- [ ] Configure Ingress/Load Balancer with valid SSL certificates.

## 2. Environment Variables
Ensure the following are set in the production CI/CD or Secrets Manager:
- [ ] `NODE_ENV=production`
- [ ] `MONGO_URI="mongodb+srv://..."`
- [ ] `JWT_SECRET="..."`
- [ ] `GEMINI_API_KEY="..."`

## 3. Deployment
- [ ] Build Docker images (`mospi-api`, `mospi-web`).
- [ ] Push images to secure Container Registry.
- [ ] Deploy MongoDB (if self-hosted) or connect to Atlas.
- [ ] Deploy API containers. Wait for `/api/ready` to return 200 OK.
- [ ] Deploy Web containers.
- [ ] Route internet traffic to Ingress Controller.

## 4. Post-Deployment Verification
- [ ] Visit the public domain in a browser and verify the UI loads.
- [ ] Create the first `LEARNER` account.
- [ ] Escalate the account to `ADMIN` manually via direct MongoDB edit:
      ```javascript
      db.users.updateOne({ email: "admin@mospi.gov.in" }, { $set: { role: "ADMIN" } })
      ```
- [ ] Login as the new Admin.
- [ ] Upload a test PDF and verify that `JobService` successfully processes it via Gemini.
- [ ] Verify that Logs are outputting correctly to `stdout` in JSON format.

## 5. Maintenance
- [ ] Configure monitoring (Datadog/CloudWatch) to alert on AI Job failures.
- [ ] Setup automated daily MongoDB backups.
- [ ] Restrict Database Access to strictly required IPs.

***

**GO/NO-GO DECISION IS COMPLETE.** The system is ready for launch.
