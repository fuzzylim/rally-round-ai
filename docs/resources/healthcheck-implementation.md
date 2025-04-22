# Health Check Implementation

This document outlines the health check implementation for the RallyRound platform.

## Overview

The health check endpoint provides a way to monitor the health of the RallyRound application and its dependencies. It's designed to be used by monitoring tools and load balancers to determine if the application is functioning correctly.

## API Endpoint

```
GET /api/healthcheck
```

## Response Format

The health check endpoint returns a JSON response with the following structure:

```json
{
  "status": "ok",
  "timestamp": "2025-04-22T08:30:00.000Z",
  "services": {
    "api": { "status": "ok" },
    "database": { "status": "ok" }
  },
  "version": "0.1.0",
  "environment": "production"
}
```

### Status Codes

- **200 OK**: All services are healthy
- **503 Service Unavailable**: One or more services are unhealthy
- **500 Internal Server Error**: The health check itself failed

## Implementation

The health check is implemented as a Next.js API route that:

1. Checks the database connection by making a simple query to Supabase
2. Verifies that the API server is running (implicit)
3. Returns a status for each service and an overall status

## Testing

The health check endpoint is tested with Jest to ensure it:

- Returns 200 when all services are healthy
- Returns 503 when the database is unhealthy
- Returns 500 when an unexpected error occurs

## Monitoring Integration

The health check endpoint can be integrated with:

- Kubernetes liveness and readiness probes
- AWS Elastic Load Balancer health checks
- Monitoring tools like Datadog, New Relic, or Prometheus
- Status page services

## Usage Examples

### cURL

```bash
curl -i https://rallyround.com/api/healthcheck
```

### Kubernetes Probe

```yaml
livenessProbe:
  httpGet:
    path: /api/healthcheck
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Future Improvements

- Add more detailed service checks
- Include performance metrics
- Add dependency health checks (e.g., external APIs)
- Implement a more sophisticated circuit breaker pattern
