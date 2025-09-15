# Todo App

Simple demo Todo webapp with React frontend and .NET Core backend. Local SQLite file for data storage.

## Running Locally

```bash
# Frontend build + run backend
npm run start
```

## Deployment

### Azure Container Apps
```bash
# Full deployment (requires Azure CLI, Terraform, Docker)
./deploy.sh
```

### Infrastructure
- Terraform provisions: Resource Group, Container Registry, Log Analytics, Container Apps Environment
- Multi-stage Dockerfile: Node.js frontend build → .NET Core backend build → runtime image
- Container serves static files from wwwroot, APIs from /todos

## Architecture Decisions

- React 19 + Vite
- TypeScript for type safety
- .NET 8 minimal APIs
- Static file serving for SPA
- Azure Container Apps for serverless scaling (1-3 replicas)
- SQLite

## Assumptions / Tradeoffs

Usage should be very light, basically a demo application that won't experience large scale. This has a large impact on the design decisions.
  - Single database file becomes bottleneck under load (no read replicas or connection pooling)
  - No authentication/authorization
  - No rate limiting or input validation
  - Minimal error handling and logging
  - No automated testing
  - Single environment configuration

## Future

### Features
- User authentication/authorization
- Mobile swipe gestures
- categories/tags
- Due dates and reminders
- Bulk operations

### Technical
- Health checks and monitoring
- Unit/integration tests
- CI/CD pipeline
- Environment-specific configurations
- Logging and telemetry
