# MovieApp Frontend Deployment Guide

This guide provides instructions for deploying the MovieApp Angular frontend application in various environments.

## Prerequisites

- Node.js 16+ and npm 8+
- Docker for containerization
- Kubernetes cluster for orchestration
- Access to the backend microservices (MovieWorld and MovieReview)

## Local Development Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     movieWorldApiUrl: 'http://localhost:9091/api/movies',
     movieReviewApiUrl: 'http://localhost:9093/api/reviews',
     otelCollectorUrl: 'http://localhost:4318'
   };
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the application at `http://localhost:4200`

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t movieapp-frontend:latest .
   ```

2. Run the container:
   ```bash
   docker run -p 80:80 \
     -e MOVIE_WORLD_API_URL=http://movieworld-service:9091/api/movies \
     -e MOVIE_REVIEW_API_URL=http://moviereview-service:9093/api/reviews \
     -e OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318 \
     movieapp-frontend:latest
   ```

3. Access the application at `http://localhost:80`

## Kubernetes Deployment

### Using Raw Manifests

1. Apply the ConfigMap:
   ```bash
   kubectl apply -f kubernetes/manifests/configmap.yaml
   ```

2. Apply the Deployment:
   ```bash
   kubectl apply -f kubernetes/manifests/deployment.yaml
   ```

3. Apply the Service:
   ```bash
   kubectl apply -f kubernetes/manifests/service.yaml
   ```

4. Apply the Ingress (if needed):
   ```bash
   kubectl apply -f kubernetes/manifests/ingress.yaml
   ```

### Using Helm Chart

1. Install the Helm chart:
   ```bash
   helm install movieapp-frontend ./kubernetes/helm/movieapp-frontend \
     --set config.movieWorldApiUrl=http://movieworld-service:9091/api/movies \
     --set config.movieReviewApiUrl=http://moviereview-service:9093/api/reviews \
     --set config.otelExporterOtlpEndpoint=http://otel-collector:4318
   ```

2. Upgrade the Helm chart (if needed):
   ```bash
   helm upgrade movieapp-frontend ./kubernetes/helm/movieapp-frontend \
     --set image.tag=latest
   ```

## Environment Configuration

The application uses the following environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| MOVIE_WORLD_API_URL | URL for the MovieWorld API | http://movieworld-service:9091/api/movies |
| MOVIE_REVIEW_API_URL | URL for the MovieReview API | http://moviereview-service:9093/api/reviews |
| OTEL_EXPORTER_OTLP_ENDPOINT | OpenTelemetry collector endpoint | http://otel-collector:4318 |
| LOG_LEVEL | Logging level | INFO |
| PRODUCTION | Production mode flag | true |

## Integration with Backend Services

The frontend application integrates with two backend microservices:

1. **MovieWorld** (port 9091): Provides movie data and management
   - Endpoints used:
     - GET /api/movies - List all movies
     - GET /api/movies/{id} - Get movie by ID
     - GET /api/movies/{id}/with-reviews - Get movie with reviews

2. **MovieReview** (port 9093): Handles review submission and retrieval
   - Endpoints used:
     - GET /api/reviews - List all reviews
     - GET /api/reviews/{id} - Get review by ID
     - GET /api/reviews/movie/{movieId} - Get reviews by movie ID
     - POST /api/reviews - Create a new review

## Observability

The application is instrumented with OpenTelemetry for observability:

1. **Logs**: Using ngx-logger with console and server logging
   - Configure log level using the LOG_LEVEL environment variable

2. **Metrics**: Custom metrics for user interactions and performance
   - Available at the /metrics endpoint for Prometheus scraping

3. **Traces**: Distributed tracing for HTTP requests and component lifecycle events
   - Configure the collector endpoint using the OTEL_EXPORTER_OTLP_ENDPOINT variable

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Verify that the backend services are running
   - Check the API URLs in the environment configuration
   - Ensure network connectivity between services

2. **OpenTelemetry Collector Connection**:
   - Verify that the OpenTelemetry collector is running
   - Check the collector endpoint in the environment configuration

3. **Kubernetes Deployment Issues**:
   - Check pod status: `kubectl get pods`
   - View pod logs: `kubectl logs <pod-name>`
   - Verify ConfigMap values: `kubectl describe configmap movieapp-frontend-config`

### Health Checks

The application includes health checks for Kubernetes:

- Liveness probe: HTTP GET on / (port 80)
- Readiness probe: HTTP GET on / (port 80)

## Scaling

The application can be scaled horizontally in Kubernetes:

```bash
kubectl scale deployment movieapp-frontend --replicas=3
```

Or with Helm:

```bash
helm upgrade movieapp-frontend ./kubernetes/helm/movieapp-frontend --set replicaCount=3
```
