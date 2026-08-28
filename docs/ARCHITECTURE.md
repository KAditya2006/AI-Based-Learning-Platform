# Current Architecture

The project is structured as an NPM monorepo containing the following applications:

## Frontend (`apps/web`)
- React
- TypeScript
- Vite

## Backend (`apps/api`)
- Node.js
- Express
- TypeScript
- MongoDB (via Mongoose)

## Monorepo Packages
- `packages/shared`: Shared utilities
- `packages/types`: Shared TypeScript interfaces
- `packages/config`: Shared configuration (ESLint, TSConfig, etc.)

## AI Architecture Boundary
The system includes architectural boundaries for future AI integration:
- `AIProvider`: Interface for external AI services
- `AIService`: Internal business logic integrating AI
- `MockAIProvider`: Mock implementation for development

*Actual AI models will be integrated in future phases.*
