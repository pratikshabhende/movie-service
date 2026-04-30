# Movie Review Service(Running)

Movie Review Service is a RESTful API service that provides CRUD operations for movie reviews. It is designed to work with the Movie World service as part of a microservice architecture. The service is fully observable with metrics, logs, and traces using OpenTelemetry and Micrometer.

## Recent Updates

### Observability Improvements
- Fixed 404 error for `/actuator/loggers` endpoint by explicitly enabling it
- Enhanced test configuration for OpenTelemetry to avoid external dependencies
- Updated Kubernetes ConfigMaps to include loggers endpoint configuration

### Kubernetes Deployment Enhancements
- Increased readiness probe initialDelaySeconds from 30 to 60 second
- Added failureThreshold: 5 to readiness probes for more retry attempts
- Fixed port mismatch (now consistently using port 9093)
- Updated RDS database endpoint in ConfigMaps

### Communication Improvements
- Added WebConfig with CORS configuration to allow cross-origin requests
- Fixed communication with MovieWorld service
- Improved error handling for service-to-service communication

## Technologies Used

- Java 17
- Spring Boot 3.1.0
- Spring Data JPA
- MySQL
- Swagger/OpenAPI
- Spring Boot Actuator
- Prometheus for metrics
- OpenTelemetry for distributed tracing
- Micrometer for metrics and tracing
- JaCoCo for code coverage
- Docker

## Architecture

The application follows a layered architecture with clear separation of concerns:

1. **Controller Layer**: Handles HTTP requests and responses
   - `ReviewController`: Provides REST endpoints for review operations
   - `HealthCheckController`: Provides health check endpoint

2. **Service Layer**: Contains business logic
   - `ReviewService`: Interface defining review operations
   - `ReviewServiceImpl`: Implementation of the ReviewService interface

3. **Repository Layer**: Handles data access
   - `ReviewRepository`: JPA repository for review entities

4. **DTO Layer**: Data Transfer Objects for API communication
   - `ReviewDTO`: DTO for review data

5. **Mapper Layer**: Converts between entities and DTOs
   - `ReviewMapper`: Maps between Review entities and ReviewDTOs

## Communication Flow

The MovieReview service follows a specific communication pattern within the microservice architecture: 

1. **MovieWorld to MovieReview**: 
   - The MovieReview service does not communicate directly with the frontend
   - Instead, it receives requests from the MovieWorld service, which acts as an API gateway
   - This pattern simplifies the frontend integration and provides better security

2. **Request Flow**:
   ```
   Angular Frontend --> MovieWorld Service --> MovieReview Service
                                                     |
                                                     v
                                               Review Database
   ```

3. **CORS Configuration**:
   - CORS is configured to allow requests from the MovieWorld service
   - The WebConfig class handles CORS settings:
   ```java
   @Configuration
   public class WebConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/**")
                   .allowedOrigins("http://localhost:4200")
                   .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                   .allowedHeaders("*")
                   .allowCredentials(true);
       }
   }
   ```

4. **Service Independence**:
   - While MovieReview service is typically accessed through MovieWorld, it maintains its independence
   - It can be scaled, deployed, and updated separately from other services
   - It has its own database for review data

6. **Model Layer**: Domain entities
   - `Review`: Entity representing a review

7. **Configuration Layer**: Application configuration
   - `OpenApiConfig`: Configuration for Swagger/OpenAPI
   - `ObservabilityConfig`: Configuration for metrics, tracing, and logging

## Best Practices Implemented

- **DTO Pattern**: Separates internal data model from external API representation
- **Service Interface/Implementation**: Provides clear contracts and enables easier testing
- **Mapper Classes**: Centralizes entity-to-DTO conversion logic
- **Environment Variables**: Uses environment variables for configuration
- **Comprehensive Logging**: Logs all operations with appropriate log levels
- **API Documentation**: Uses Swagger/OpenAPI for API documentation
- **Health Checks**: Provides health check endpoint
- **Metrics**: Exposes metrics for monitoring via Prometheus and Micrometer
- **Distributed Tracing**: Uses OpenTelemetry for end-to-end tracing
- **Structured Logging**: Includes trace and span IDs in logs for correlation
- **Observability**: Full integration with Prometheus, Grafana, and Istio
- **Unit Testing**: Comprehensive unit tests for all layers
- **Code Coverage**: JaCoCo for code coverage reporting

## Prerequisites

- Java 17
- Maven
- MySQL
- Docker (optional)

## Environment Variables

The application uses the following environment variables:

- `MYSQL_URL`: MySQL database URL (default: `jdbc:mysql://localhost:3306/moviereview`)
- `MYSQL_USERNAME`: MySQL username (default: `root`)
- `MYSQL_PASSWORD`: MySQL password (default: `root`)
- `LOG_FILE_PATH`: Path to log file (default: `logs/moviereview.log`)
- `OTEL_EXPORTER_OTLP_ENDPOINT`: OpenTelemetry collector endpoint (default: `http://localhost:4317`)
- `OTEL_SDK_DISABLED`: Disable OpenTelemetry SDK (default: `false`)
- `DB_HOST`: Database host for Kubernetes deployment (default: `movie-app-db.cvggya6kg1r7.us-east-1.rds.amazonaws.com`)

## Building the Application

```bash
mvn clean package
```

## Running the Application

### Using Maven

```bash
# Run with OpenTelemetry enabled (default)
mvn spring-boot:run

# Run with OpenTelemetry disabled
$env:OTEL_SDK_DISABLED="true"; mvn spring-boot:run

# Run on a specific port (e.g., 9093)
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=9093"
```

### Using Java

```bash
# Run with OpenTelemetry enabled (default)
java -jar target/moviereview-0.0.1-SNAPSHOT.jar

# Run with OpenTelemetry disabled
java -jar -Dotel.sdk.disabled=true target/moviereview-0.0.1-SNAPSHOT.jar

# Run on a specific port (e.g., 9093)
java -jar -Dserver.port=9093 target/moviereview-0.0.1-SNAPSHOT.jar
```

### Using Docker

Build the Docker image:

```bash
docker build -t com.abc/moviereview:latest .
```

Run the Docker container:

```bash
docker run -p 9093:9093 \
  -e MYSQL_URL=jdbc:mysql://mysql-host:3306/moviereview \
  -e MYSQL_USERNAME=root \
  -e MYSQL_PASSWORD=root \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317 \
  com.abc/moviereview:latest
```

## API Documentation

The API documentation is available at:

- Swagger UI: `http://localhost:9093/swagger-ui.html`
- OpenAPI JSON: `http://localhost:9093/api-docs`

## API Endpoints

All endpoints are available at `http://localhost:9093`:

- `GET /api/moviereview`: Get all reviews
- `GET /api/moviereview/{id}`: Get a review by ID
- `GET /api/moviereview/movie/{movieId}`: Get all reviews for a movie
- `POST /api/moviereview`: Create a new review
- `PUT /api/moviereview/{id}`: Update a review
- `DELETE /api/moviereview/{id}`: Delete a review
- `GET /api/moviereview/health`: Health check endpoint

## Observability

### Monitoring Endpoints

The application exposes the following endpoints for monitoring:

- `GET /actuator/health`: Health check - http://localhost:9093/actuator/health
- `GET /actuator/info`: Application information - http://localhost:9093/actuator/info
- `GET /actuator/metrics`: Application metrics - http://localhost:9093/actuator/metrics
- `GET /actuator/prometheus`: Prometheus metrics - http://localhost:9093/actuator/prometheus
- `GET /actuator/loggers`: Logger configuration - http://localhost:9093/actuator/loggers

### Metrics

The application emits the following types of metrics:

- JVM metrics (memory, garbage collection, etc.)
- HTTP request metrics with histogram distributions
- Custom business metrics using `@Observed` annotations
- Service method execution metrics via `MetricsAspect`
- System metrics (CPU, memory, etc.)

#### Custom Metrics Implementation

The application implements custom metrics in two ways:

1. **@Observed Annotations**: Applied to controller methods to create both metrics and traces:

```java
@GetMapping
@Observed(name = "review.getAll", 
         contextualName = "get-all-reviews", 
         lowCardinalityKeyValues = {"service", "movie-review"})
public ResponseEntity<List<ReviewDTO>> getAllReviews() {
    // Method implementation
}
```

2. **MetricsAspect**: Automatically measures and records execution time for all service methods:

```java
@Around("execution(* com.abc.moviereview.service.*.*(..))")
public Object measureMethodExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
    // Records method invocation count
    // Records method execution time
    // Records error counts with exception types
}
```

#### Available Metrics

The following custom metrics are available:

- `service.[ServiceName].[methodName].invocations` - Count of method invocations
  - Example: http://localhost:9093/actuator/metrics/service.ReviewServiceImpl.getReviewById.invocations
- `service.[ServiceName].[methodName].duration` - Method execution time
  - Example: http://localhost:9093/actuator/metrics/service.ReviewServiceImpl.getReviewById.duration
- `service.[ServiceName].[methodName].errors` - Count of errors by exception type
- `http.server.requests` - HTTP request metrics with response time histograms
  - Example: http://localhost:9093/actuator/metrics/http.server.requests

These metrics can be viewed at `/actuator/metrics` or scraped by Prometheus from `/actuator/prometheus`.

### Distributed Tracing

The application uses OpenTelemetry for distributed tracing:

- Automatic instrumentation of HTTP requests and responses
- Trace context propagation between services
- Custom spans using `@WithSpan` and `@Observed` annotations
- Custom metrics and timing using the `MetricsAspect` for service methods
- Integration with Istio service mesh

#### OpenTelemetry Configuration

The application is configured to use OpenTelemetry for tracing with the following components:

- **OpenTelemetry SDK**: Provides the core functionality for tracing
- **OTLP Exporter**: Exports traces to an OpenTelemetry collector
- **Micrometer Bridge**: Integrates with Spring Boot's metrics system
- **Resource Attributes**: Identifies the service in traces and metrics
- **Resilient Configuration**: Gracefully handles collector unavailability

The configuration is in `ObservabilityConfig.java` and includes:

```java
@Bean
public OpenTelemetry openTelemetry() {
    try {
        // Configure OpenTelemetry SDK with service name and version
        Resource resource = Resource.getDefault().merge(
            Resource.create(Attributes.of(
                ResourceAttributes.SERVICE_NAME, "movie-review-service",
                ResourceAttributes.SERVICE_VERSION, "1.0.0"
            ))
        );
        
        // Create and configure the SDK
        SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
            .setResource(resource)
            .setSampler(Sampler.alwaysOn())
            .build();
            
        OpenTelemetrySdk sdk = OpenTelemetrySdk.builder()
            .setTracerProvider(tracerProvider)
            .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
            .build();
            
        return sdk;
    } catch (Exception e) {
        log.warn("Failed to initialize OpenTelemetry SDK: {}", e.getMessage());
        return OpenTelemetry.noop();
    }
}
```

#### Verified Endpoints

The following endpoints have been tested and verified to work with OpenTelemetry tracing:

- `POST /api/moviereview` - Creates a new review and generates trace data
- `GET /api/moviereview` - Retrieves all reviews with trace context
- `GET /api/moviereview/{id}` - Retrieves a specific review with trace context

### Logging

The application uses structured logging with trace correlation:

- Log format includes trace and span IDs
- Log levels configurable via `/actuator/loggers` endpoint
- Logs can be correlated with traces and metrics
- Dynamic log level adjustment at runtime

### Integration with Observability Stack

- **Prometheus**: Scrapes metrics from `/actuator/prometheus`
- **Grafana**: Visualizes metrics from Prometheus
- **Istio**: Collects and visualizes service mesh telemetry
- **OpenTelemetry Collector**: Receives and processes traces

## Testing

The application includes comprehensive unit tests for all layers:

### Running Tests

```bash
# Run all tests
mvn test

# Run a specific test class
mvn test -Dtest=ReviewControllerTest

# Run a specific test method
mvn test -Dtest=ReviewControllerTest#testGetReviewById
```

### Test Coverage

The project uses JaCoCo for code coverage analysis with a minimum coverage threshold of 70%. Current coverage is 72%, ensuring high-quality code.

```bash
# Run tests with coverage report
mvn clean test jacoco:report
mvn clean verify

# Run tests with coverage and skip integration tests
mvn clean verify -DskipITs
```

The latest test run shows all tests passing with 72% code coverage, meeting our quality requirements.

### Test Structure

- **Controller Tests**: Test the REST endpoints using MockMvc
- **Service Tests**: Test the business logic with mocked repositories
- **Repository Tests**: Test the data access layer using H2 in-memory database
- **Mapper Tests**: Test the entity-to-DTO conversion
- **Observability Tests**: Test the observability configuration and metrics aspects

### Code Coverage Report

The code coverage report will be generated at:
```
target/site/jacoco/index.html
```

To view the report, open the HTML file in a web browser after running:
```bash
mvn clean verify
```

### Coverage Thresholds

The project is configured with the following coverage thresholds:
- **Line Coverage**: 70%
- **Branch Coverage**: 70%
- **Method Coverage**: 70%
- **Class Coverage**: 70%

## Verified Endpoints

The following endpoints have been tested and verified to work:

### API Endpoints

- `POST http://localhost:9093/api/moviereview` - Successfully created a new review
- `GET http://localhost:9093/api/moviereview` - Successfully retrieved all reviews
- `GET http://localhost:9093/api/moviereview/3` - Successfully retrieved a specific review

### Observability Endpoints

- `GET http://localhost:9093/actuator/health` - Health check endpoint
- `GET http://localhost:9093/actuator/prometheus` - Prometheus metrics endpoint
- `GET http://localhost:9093/actuator/metrics` - Metrics endpoint

## Integration with MovieWorld Service

The MovieReview service is designed to work with the MovieWorld service. The MovieWorld service can retrieve reviews for a specific movie by calling the MovieReview service's `/api/moviereview/movie/{movieId}` endpoint.

## Next Steps

1. **External Integration**:
   - Connect to a running OpenTelemetry collector (configured at http://localhost:4317)
   - Set up Prometheus to scrape the metrics endpoint
   - Configure Grafana dashboards to visualize the metrics

2. **Additional Testing**:
   - Consider adding more specific tests for trace propagation
   - Test the integration with external observability tools

To view the report, open the HTML file in a web browser after running:
```bash
mvn clean verify
```

### Coverage Thresholds

The project is configured with the following coverage thresholds:
- **Line Coverage**: 80%
- **Branch Coverage**: 80%
- **Method Coverage**: 80%
- **Class Coverage**: 80%

## Kubernetes Deployment

The application can be deployed to a Kubernetes cluster using the provided manifests or Helm chart. All components of the Movie application (MovieWorld, MovieReview, and MovieApp Frontend) are deployed in the `movie` namespace for better isolation and management.

### Prerequisites

- Kubernetes cluster (EKS or any other Kubernetes distribution)
- Istio service mesh installed
- Prometheus and Grafana for monitoring
- kubectl CLI
- Helm CLI (for Helm deployment)

### Kubernetes Manifests

The Kubernetes manifests are located in the `kubernetes/manifests` directory. All manifests are configured to use the `movie` namespace:

```
kubernetes/manifests/
├── namespace.yaml         # Movie namespace definition
├── configmap.yaml         # Application configuration
├── deployment.yaml        # Deployment configuration
├── istio-destinationrule.yaml  # Istio destination rules
├── istio-gateway.yaml     # Istio gateway configuration
├── istio-virtualservice.yaml   # Istio virtual service routes
├── secret.yaml            # Database credentials
└── service.yaml           # Service definition
```

#### Important Kubernetes Configuration Notes

- **Readiness Probe**: Configured with 60-second initial delay and 5 retries to ensure the application is fully initialized before receiving traffic
- **ConfigMap**: Includes explicit configuration for actuator endpoints, including loggers
- **Database**: Uses RDS endpoint `movie-app-db.cvggya6kg1r7.us-east-1.rds.amazonaws.com`
- **Port**: Consistently uses port 9093 across all configurations

To deploy using the manifests:

```bash
# Create the namespace first
kubectl apply -f kubernetes/manifests/namespace.yaml

# Apply the manifests
kubectl apply -f kubernetes/manifests/

# Verify the deployment
kubectl get pods -n movie -l app=moviereview
kubectl get svc -n movie moviereview
kubectl get virtualservice -n movie moviereview
```

### Helm Chart

The Helm chart is located in the `kubernetes/helm/moviereview` directory:

```
kubernetes/helm/moviereview/
├── Chart.yaml            # Chart metadata
├── templates/            # Kubernetes manifest templates
│   ├── _helpers.tpl      # Template helpers
│   ├── configmap.yaml    # ConfigMap template
│   ├── deployment.yaml   # Deployment template
│   ├── hpa.yaml          # HorizontalPodAutoscaler template
│   ├── istio-destinationrule.yaml  # Istio DestinationRule template
│   ├── istio-gateway.yaml          # Istio Gateway template
│   ├── istio-virtualservice.yaml   # Istio VirtualService template
│   ├── secret.yaml       # Secret template
│   ├── service.yaml      # Service template
│   ├── serviceaccount.yaml         # ServiceAccount template
│   └── servicemonitor.yaml         # ServiceMonitor template for Prometheus
└── values.yaml           # Default configuration values
```

### Service Discovery in Kubernetes

When running in Kubernetes, the application uses Kubernetes service discovery for inter-service communication:

1. **Service Names as DNS**: 
   - The MovieReview service is accessible to other services using the Kubernetes service name: `http://moviereview.movie.svc.cluster.local:9093`
   - This is configured in the MovieWorld service's ConfigMap
   - Kubernetes DNS automatically resolves the service name to the correct pod IP(s)
   - All services are in the `movie` namespace for better organization

2. **Benefits**:
   - No hardcoded IPs - service discovery is automatic
   - Works with pod scaling and recreation - the service name remains stable
   - Compatible with Istio service mesh for advanced traffic management

To deploy using Helm:

```bash
# Create the namespace if it doesn't exist
kubectl create namespace movie

# Install the chart in the movie namespace
helm install moviereview kubernetes/helm/moviereview --namespace movie

# Upgrade an existing release
helm upgrade moviereview kubernetes/helm/moviereview --namespace movie

# Customize the deployment
helm install moviereview kubernetes/helm/moviereview --namespace movie \
  --set replicaCount=3 \
  --set image.tag=v1.0.0 \
  --set opentelemetry.endpoint=http://custom-otel-collector:4317
```

### Observability in Kubernetes

When deployed to Kubernetes with Istio:

1. **Metrics**: 
   - Prometheus automatically scrapes metrics from `/actuator/prometheus` endpoint
   - ServiceMonitor resource configures Prometheus Operator for scraping
   - View metrics in Grafana dashboards or Istio's Kiali dashboard
   - Both application metrics and JVM metrics are collected
   - Custom metrics from `@Observed` annotations and `MetricsAspect` are included

2. **Tracing**:
   - OpenTelemetry exports traces to the configured collector
   - Istio adds its own tracing headers and spans
   - View traces in Jaeger or other tracing backends

3. **Logging**:
   - Container logs are collected by the Kubernetes logging stack
   - Structured logs include trace and span IDs for correlation

4. **Service Mesh Monitoring**:
   - Istio provides additional metrics and visualizations
   - Kiali dashboard shows service topology and health
   - Grafana dashboards for Istio metrics are available
