# Production Deployment Guide

## Prerequisites
- Node.js v20+
- MongoDB 6.0+ (Replica Set recommended for transactions)
- PM2 for process management

## Environment Variables
Ensure the `.env` file in the root is populated:
```env
NODE_ENV=production
PORT=4000
MONGO_URI=mongodb://<user>:<password>@<host>:27017/mospi_skill_platform
JWT_SECRET=<secure_random_string_32_chars+>
GEMINI_API_KEY=<google_ai_studio_key>
VITE_API_URL=https://api.skills.mospi.gov.in/api
```

## Build Process
From the monorepo root:
```bash
# Install dependencies
npm install

# Build shared packages, API, and Web
npm run build
```

## Running the API (Backend)
Use PM2 to manage the Express server:
```bash
cd apps/api
pm2 start dist/index.js --name "mospi-api"
```

## Running the Web (Frontend)
The React/Vite app outputs static files to `apps/web/dist`.
Host this directory using Nginx:
```nginx
server {
    listen 80;
    server_name skills.mospi.gov.in;
    
    root /path/to/repo/apps/web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Data Seeding
For first-time setup, run the deterministic seed script:
```bash
cd apps/api
npm run seed
```
This will create the Admin account and populate the initial competency frameworks.
