FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/ ./packages/

RUN npm ci --workspace=web --include-workspace-root

# Copy source
COPY apps/web/ ./apps/web/

# Build Vite app
RUN npm run build --workspace=web

# Production server using Nginx
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx config for React Router
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
