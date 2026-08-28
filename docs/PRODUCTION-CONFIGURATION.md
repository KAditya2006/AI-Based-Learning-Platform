# Production Configuration Governance

## Overview
This document formalizes the production configuration strategy for the MoSPI Skill Intelligence Platform. It dictates the handling of environment variables, secrets, and startup validation to ensure secure enterprise deployments.

## Strategy
- **No Hardcoded Secrets**: All API keys, connection strings, and JWT secrets MUST be injected via environment variables.
- **Fail-Fast Boot**: The application (`apps/api/src/index.ts`) will immediately crash on boot if critical variables (`MONGODB_URI`, `JWT_SECRET`) are missing.
- **Production Overrides**: If `NODE_ENV=production`, insecure defaults (e.g., fallback `JWT_SECRET='your_jwt_secret_here'`) will be explicitly rejected by the validation logic.
- **Separation of Concerns**: The frontend (`apps/web`) is strictly isolated and receives NO backend environment variables during the build phase except the public `VITE_API_BASE_URL`.

## Environment Variable Schema

### Core & Server
| Variable | Type | Requirement | Default | Description |
|---|---|---|---|---|
| `NODE_ENV` | Enum (`development`, `production`, `test`) | Required | `development` | Dictates strictness of logging, error handling, and security defaults. |
| `PORT` | Number | Optional | `4000` | HTTP port the Express server binds to. |
| `LOG_LEVEL` | String | Optional | `info` (prod) | Winston logging verbosity level. |

### Database
| Variable | Type | Requirement | Default | Description |
|---|---|---|---|---|
| `MONGODB_URI` | String | Required | `mongodb://127.0.0.1:27017/...` | The connection string to the MongoDB replica set. In production, this must contain authentication credentials. |

### Security
| Variable | Type | Requirement | Default | Description |
|---|---|---|---|---|
| `JWT_SECRET` | String (Secret) | Required | (rejected in prod) | Key used for signing Auth tokens. MUST be securely injected via Kubernetes Secrets / Docker Swarm Secrets. |
| `JWT_EXPIRES_IN` | String | Optional | `24h` | Token validity duration. |
| `CORS_ORIGIN` | String | Optional | `*` (dev) | The strict origin permitted to make requests to the API. Must be defined in production. |

### AI Provider
| Variable | Type | Requirement | Default | Description |
|---|---|---|---|---|
| `AI_PROVIDER` | Enum (`gemini`, `mock`, `external`) | Required | `gemini` | Determines the loaded provider class. |
| `GEMINI_API_KEY` | String (Secret) | Required (if gemini) | None | Google Gemini execution key. |
| `AI_MODEL` | String | Optional | `gemini-2.5-flash` | The specific LLM model weight to utilize. |
| `AI_TIMEOUT` | Number | Optional | `30000` | Network timeout for generation requests to prevent hanging threads. |

### Integrations
| Variable | Type | Requirement | Default | Description |
|---|---|---|---|---|
| `IGOT_ENABLED` | Boolean | Required | `false` | Enables sync polling to iGOT Karmayogi. |
| `NSSTA_ENABLED` | Boolean | Required | `false` | Enables sync polling to NSSTA providers. |

## Validation Implementation
The `index.ts` file acts as the primary gatekeeper. If `NODE_ENV=production` is detected, a strict verification pass is executed against `process.env`. If variables are malformed or missing, the process exits with `code 1` prior to binding the HTTP server.
