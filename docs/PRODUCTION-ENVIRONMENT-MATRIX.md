# Production Environment Configuration Matrix

The following environment variables dictate the production configuration for the MoSPI Skill Intelligence Platform. The application follows a "Fail-Fast" design; missing mandatory variables will cause the Node.js process to exit (`code 1`) immediately during startup.

| Variable | Required | Used By | Secret? | Example/Format | Failure Behaviour |
| -------- | -------- | ------- | ------- | -------------- | ----------------- |
| `NODE_ENV` | Yes | Global | No | `production` | Defaults to `development` if omitted; affects caching/logging. |
| `PORT` | Yes | Express | No | `4000` | Defaults to `4000` if omitted. |
| `LOG_LEVEL` | No | Winston | No | `info` (debug, warn, error) | Defaults to `info`. |
| `MONGODB_URI` | Yes | Mongoose | Yes | `mongodb://user:pass@host:27017/mospi` | Application fails to start; retry logic triggers then `exit(1)`. |
| `JWT_SECRET` | Yes | Auth Middleware | Yes | `a_highly_secure_64_char_string` | API requests using JWT will fail signature validation; onboarding blocks. |
| `JWT_EXPIRES_IN` | No | Auth Service | No | `24h` | Defaults to `1d`. |
| `CORS_ORIGIN` | No | Express CORS | No | `https://learning.mospi.gov.in` | Open to `*` if omitted (High Security Risk). |
| `AI_PROVIDER` | Yes | AI Factory | No | `gemini` (or `mock`) | Throws exception if unsupported provider is explicitly chosen. |
| `GEMINI_API_KEY` | Yes* | Gemini SDK | Yes | `AIzaSy...` | Application boots, but AI requests fallback to Mock provider or fail. |
| `AI_MODEL` | No | Gemini SDK | No | `gemini-2.5-flash` | Defaults to `gemini-2.5-flash`. |
| `AI_TIMEOUT` | No | AI Factory | No | `30000` | Defaults to 30000ms. |
| `IGOT_ENABLED` | Yes | IntegrationSync | No | `true` or `false` | Defaults to `false`. |
| `IGOT_BASE_URL` | Yes* | IGOT Provider | No | `https://api.igot.gov.in` | Sync fails if missing and IGOT is enabled. |
| `IGOT_API_KEY` | Yes* | IGOT Provider | Yes | `sk_igot_1234` | Sync fails `401 Unauthorized` if missing and IGOT is enabled. |
| `NSSTA_ENABLED` | Yes | IntegrationSync | No | `true` or `false` | Defaults to `false`. |
| `NSSTA_BASE_URL` | Yes* | NSSTA Provider | No | `https://api.nssta.gov.in` | Sync fails if missing and NSSTA is enabled. |
| `NSSTA_API_KEY` | Yes* | NSSTA Provider | Yes | `sk_nssta_1234` | Sync fails `401 Unauthorized` if missing and NSSTA is enabled. |

_* Required conditionally based on feature flags (e.g., if `AI_PROVIDER=gemini`, or `IGOT_ENABLED=true`)._

## Critical Note on Secrets Safety
Never commit `.env` or `.env.production` to version control. Production environment values should be injected via Kubernetes ConfigMaps/Secrets, AWS Secrets Manager, or GitHub Actions Environment Secrets.
