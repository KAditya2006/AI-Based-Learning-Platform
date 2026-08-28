# Setup Instructions

## Prerequisites
- Node.js (v18+)
- npm (v9+)
- Docker (optional, for MongoDB)

## Installation

1. Clone the repository
2. Run `npm install` from the root directory to install all workspace dependencies
3. Copy `.env.example` to `.env` in the root directory (and any necessary `.env` files in the app directories)

## Environment Variables
The root `.env.example` file contains placeholders for:
- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `AI_PROVIDER`, `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`, `AI_TIMEOUT`

## Running Locally

To start the development servers for all apps in the monorepo:
```bash
npm run dev
```

To run a specific app:
```bash
npm run dev --workspace=apps/web
# or
npm run dev --workspace=apps/api
```

## Verifying API Health
Once the backend is running, you can verify its status at:
`GET http://localhost:3000/api/health`
