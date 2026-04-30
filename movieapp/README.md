# MovieApp Frontend (Running)

A modern Angular 17 frontend application for browsing movies and submitting reviews. This application integrates with the MovieWorld and MovieReview microservices in a microservice architecture.

## Features

- Browse a list of movies
- View detailed movie information
- Read and submit movie reviews
- Integrated observability with OpenTelemetry
- Health check endpoint for Kubernetes liveness and readiness probes 
- Responsive design with Bootstrap 5

## Architecture

The application follows a component-based architecture with the following key elements:

- **Components**: Standalone Angular components for UI elements
- **Services**: Data services for API communication
- **Models**: TypeScript interfaces for data structures
- **Interceptors**: HTTP interceptors for telemetry and error handling
- **Observability**: OpenTelemetry integration for logs, metrics, and traces

## Communication Flow

The application follows this communication pattern:

1. **Frontend → MovieWorld**: The Angular frontend communicates directly with the MovieWorld service for movie data
2. **MovieWorld → MovieReview**: For review operations, MovieWorld acts as an API gateway and communicates with MovieReview
3. **Frontend ← MovieWorld ← MovieReview**: Data flows back through the same path

## Backend Services

This frontend application communicates with two backend microservices:

1. **MovieWorld** (port 9091): Provides movie data and management
2. **MovieReview** (port 9093): Handles review submission and retrieval

## Observability

The application is instrumented with OpenTelemetry to provide comprehensive observability through logs, metrics, and traces. This enables monitoring, debugging, and performance analysis across the entire microservice architecture.

### How Observability Works

#### 1. Logs

The application uses NGXLogger for structured logging with the following features:

- **Log Levels**: Supports DEBUG, INFO, WARN, ERROR levels configured via environment
- **Structured Format**: JSON-formatted logs with timestamp, level, and context
- **Correlation**: Includes trace IDs and span IDs for correlation with distributed traces
- **Transport**: Logs to console in development and to a server endpoint in production

**Implementation Details:**
```typescript
// Log configuration in app.config.ts
importProvidersFrom(
  LoggerModule.forRoot({
    serverLoggingUrl: '/api/logs',
    level: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR,
    disableConsoleLogging: environment.production
  })
)

// Usage in components/services
this.logger.debug('Loading movie details', { movieId: id, context: 'MovieDetailComponent' });
this.logger.error('Failed to load movie', { error: error.message, movieId: id });
```

**API Endpoints:**
- Development: Browser console
- Production: `/api/logs` endpoint (collected by a logging service)

#### 2. Metrics

The application collects and exposes metrics for monitoring performance and behavior:

- **HTTP Metrics**: Request counts, durations, and error rates via TelemetryInterceptor
- **Component Metrics**: Rendering times and user interaction metrics
- **Custom Business Metrics**: Movie views, review submissions, and other key user actions
- **Prometheus Integration**: Metrics exposed in Prometheus format for scraping

**Implementation Details:**
```typescript
// HTTP metrics in telemetry.interceptor.ts
return next(modifiedReq).pipe(
  tap((event: HttpEvent<unknown>) => {
    if (event instanceof HttpResponse) {
      const duration = Date.now() - startTime;
      telemetryService.setAttributes({
        'http.status_code': event.status,
        'http.duration_ms': duration
      });
    }
  })
);
```

**API Endpoints:**
- `/metrics` endpoint exposed by the nginx container in production
- Format: Prometheus-compatible text format

#### 3. Traces

The application uses OpenTelemetry for distributed tracing across the microservice architecture:

- **Automatic Instrumentation**: HTTP requests, route changes, and DOM events
- **Manual Instrumentation**: Custom spans for business operations and component lifecycle
- **Context Propagation**: W3C Trace Context headers for cross-service correlation
- **Span Attributes**: Rich context including user info, component names, and business data
- **Visualization**: Compatible with Jaeger, Zipkin, and other tracing backends

**Implementation Details:**
```typescript
// Initialization in telemetry.service.ts
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'movieapp-frontend',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment.production ? 'production' : 'development'
});

const provider = new WebTracerProvider({ resource });
const exporter = new OTLPTraceExporter({ url: environment.otelCollectorUrl });
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

// Usage in components
const spanContext = this.telemetryService.startSpan('load_movie_details', { 'movie.id': id });
try {
  // Business logic
  this.telemetryService.endSpan(spanContext, 'success');
} catch (error) {
  this.telemetryService.endSpan(spanContext, 'error');
}
```

**API Endpoints:**
- Development: `http://localhost:4318/v1/traces`
- Production: `http://otel-collector:4318/v1/traces`

### End-to-End Observability

The frontend app's observability integrates with the backend services to provide end-to-end visibility:

1. **Trace Context Propagation**: Trace IDs are passed between services via HTTP headers
2. **Correlated Logs**: All logs include trace IDs for correlation across services
3. **Service Maps**: Visualize the flow of requests across the entire architecture
4. **Performance Analysis**: Identify bottlenecks across the full request path

### Kubernetes Integration

In Kubernetes, observability is enhanced with:

- **Prometheus Annotations**: Pods are annotated for automatic metric scraping
- **OpenTelemetry Collector**: Deployed as a service for centralized telemetry collection
- **Service Discovery**: Automatic discovery of backend services for trace correlation
- **ConfigMaps**: Environment-specific observability configuration

## Development

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

```bash
# Install dependencies
npm install
```

### Running the Application

```bash
# Start development server
npm start
```

The application will be available at `http://localhost:4200`.

### Building for Production

```bash
# Build for production
npm run build
```

## Testing

The application includes comprehensive unit tests using Jest as the test runner.

### Testing Commands

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Architecture

The testing architecture follows these principles:

1. **Component Testing**: Each Angular component has its own test file that verifies:
   - Component creation and initialization
   - Template rendering and data binding
   - User interaction handling
   - Error handling and edge cases

2. **Service Testing**: Services are tested independently with mocked dependencies to verify:
   - API communication
   - Data transformation
   - Error handling
   - Business logic

3. **Interceptor Testing**: HTTP interceptors are tested to ensure:
   - Proper request/response handling
   - Header manipulation
   - Telemetry integration
   - Error handling

### Mocking Strategy

The application uses several mocking approaches:

- **Manual Mocks**: Simple mock objects created with Jest's `jest.fn()` for functions and spies
- **Module Mocks**: Complete module replacements for external dependencies like OpenTelemetry
- **Service Mocks**: Simplified versions of services that return predictable data
- **HTTP Mocks**: Angular's `HttpClientTestingModule` for simulating HTTP requests

### Code Coverage

Code coverage thresholds are set to:

- Statements: 70%
- Lines: 70%
- Functions: 60%
- Branches: 45%

The coverage report is generated in the `coverage` directory after running `npm run test:coverage`.

### Testing Best Practices

1. **Isolated Tests**: Each test focuses on a single piece of functionality
2. **Deterministic Tests**: Tests avoid random values and external dependencies
3. **Fast Tests**: Tests run quickly to enable rapid development cycles
4. **Independent Tests**: Tests don't depend on each other's state
5. **Readable Tests**: Tests use descriptive names and follow the AAA pattern (Arrange, Act, Assert)

### Recent Testing Updates

- Migrated from Jasmine/Karma to Jest for improved test performance and better mocking
- Added shared mocks for common services to reduce duplication
- Updated tests to match current implementation and improve coverage
- Added specific tests for observability features (telemetry, logging, metrics)
- Improved error handling tests to ensure robustness

## Deployment

The application includes Kubernetes manifests and Helm charts for deployment:

- `kubernetes/manifests`: Raw Kubernetes manifests (all configured to use the `movie` namespace)
- `kubernetes/helm`: Helm chart for MovieApp frontend (configured to deploy to the `movie` namespace)

### Kubernetes Deployment

The frontend application is containerized and deployed as a pod in Kubernetes, similar to the MovieWorld and MovieReview microservices. All components are deployed in the `movie` namespace for better isolation and management. The application includes a health check endpoint at `/health` for Kubernetes liveness and readiness probes. The deployment includes:

1. **Namespace**: Isolates all movie application components in the `movie` namespace
2. **Deployment**: Manages the pod replicas and update strategy
3. **Service**: Exposes the frontend application within the cluster
4. **ConfigMap**: Stores environment-specific configuration
5. **Ingress**: Exposes the application to external traffic

#### Deploying with Helm

To deploy the application using Helm to the `movie` namespace:

```bash
# Create the namespace if it doesn't exist
kubectl create namespace movie

# Deploy the application using Helm
helm upgrade --install movieapp ./kubernetes/helm/movieapp --namespace movie

# Check the deployment status
kubectl get all -n movie
```

#### Deploying with kubectl

To deploy using raw Kubernetes manifests:

```bash
# Create the namespace if it doesn't exist
kubectl apply -f kubernetes/manifests/namespace.yaml

# Deploy all resources
kubectl apply -f kubernetes/manifests/
```

### Service Discovery

In Kubernetes, the frontend communicates with backend services using Kubernetes service names within the `movie` namespace:

```
frontend → movieworld.movie.svc.cluster.local → moviereview.movie.svc.cluster.local
```

The environment configuration is updated to use service names instead of localhost URLs in production.

### Database Configuration

Each backend service (MovieWorld and MovieReview) has its own MySQL database deployed in the Kubernetes cluster:

1. **MovieWorld Database**:
   - Deployment: `movieworld-mysql` in the `movie` namespace
   - Persistent Volume: `movieworld-mysql-pv` (1Gi storage)
   - Persistent Volume Claim: `movieworld-mysql-pvc`
   - Service: `movieworld-mysql` accessible at port 3306
   - Credentials stored in `movieworld-mysql-secret`

2. **MovieReview Database**:
   - Deployment: `moviereview-mysql` in the `movie` namespace
   - Persistent Volume: `moviereview-mysql-pv` (1Gi storage)
   - Persistent Volume Claim: `moviereview-mysql-pvc`
   - Service: `moviereview-mysql` accessible at port 3306
   - Credentials stored in `moviereview-mysql-secret`

Both databases use persistent storage to ensure data is preserved across pod restarts. The backend services are configured to connect to their respective databases using environment variables.

## Environment Configuration

The application uses environment-specific configuration files:

- `environment.ts`: Development environment
- `environment.prod.ts`: Production environment

Key configuration parameters include:

- Backend API URLs
- OpenTelemetry collector endpoint
- Logging levels
- OpenTelemetry enablement flag

### Production Configuration

In production, the environment is configured to:

- Use Kubernetes service names for backend services
- Enable OpenTelemetry for production monitoring
- Set appropriate log levels
- Connect to the production OpenTelemetry collector

```typescript
export const environment = {
  production: true,
  movieWorldApiUrl: 'http://movieworld-service:9091/api/movieworld',
  movieReviewApiUrl: 'http://moviereview-service:9093/api/moviereview',
  otelCollectorUrl: 'http://otel-collector:4318/v1/traces',
  logLevel: 'info',
  otelEnabled: true
};

```
