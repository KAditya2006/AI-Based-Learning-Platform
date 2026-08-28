FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations (for monorepo if needed, though this builds just the API)
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/

# Install dependencies
RUN npm ci --workspace=api --include-workspace-root

# Copy source
COPY apps/api/ ./apps/api/

# Build
RUN npm run build --workspace=api

FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# The app listens on PORT
EXPOSE 4000

CMD ["npm", "start", "--workspace=api"]
