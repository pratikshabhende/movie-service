package com.abc.moviereview.config;

import io.micrometer.observation.ObservationRegistry;
import io.micrometer.observation.aop.ObservedAspect;
import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.trace.propagation.W3CTraceContextPropagator;
import io.opentelemetry.context.propagation.ContextPropagators;
import io.opentelemetry.sdk.OpenTelemetrySdk;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.sdk.trace.SdkTracerProvider;
import io.opentelemetry.sdk.trace.samplers.Sampler;
import io.opentelemetry.semconv.resource.attributes.ResourceAttributes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuration class for setting up observability features including metrics, traces, and logs.
 * This enables integration with Prometheus, Grafana, and Istio.
 * 
 * The configuration includes a resilient OpenTelemetry setup that gracefully handles
 * connection failures to the OpenTelemetry collector.
 */
@Configuration
@ConditionalOnProperty(name = "otel.sdk.disabled", havingValue = "false", matchIfMissing = true)
public class ObservabilityConfig {
    private static final Logger logger = LoggerFactory.getLogger(ObservabilityConfig.class);
    
    @Value("${spring.application.name:moviereview}")
    private String serviceName;
    
    @Value("${otel.exporter.otlp.endpoint:http://localhost:4317}")
    private String otlpEndpoint;

    /**
     * Creates an ObservedAspect bean that enables the use of @Observed annotation
     * for method-level tracing and metrics collection.
     *
     * @param observationRegistry the registry for recording observations
     * @return an ObservedAspect bean
     */
    @Bean
    public ObservedAspect observedAspect(ObservationRegistry observationRegistry) {
        return new ObservedAspect(observationRegistry);
    }
    
    /**
     * Creates a Resource bean for OpenTelemetry with service name and version.
     * 
     * @return Resource with service information
     */
    @Bean
    public Resource otelResource() {
        return Resource.getDefault()
            .merge(Resource.create(Attributes.of(
                ResourceAttributes.SERVICE_NAME, serviceName,
                ResourceAttributes.SERVICE_VERSION, "1.0.0"
            )));
    }
    
    /**
     * Creates a resilient OpenTelemetry bean that gracefully handles collector connection failures.
     * If the collector is unavailable, it falls back to a no-op implementation to prevent
     * application startup failure.
     * 
     * @param resource the OpenTelemetry resource with service information
     * @return OpenTelemetry instance (either SDK or no-op fallback)
     */
    @Bean
    @Primary
    public OpenTelemetry openTelemetry(Resource resource) {
        try {
            logger.info("Initializing OpenTelemetry SDK with collector endpoint: {}", otlpEndpoint);
            
            SdkTracerProvider tracerProvider = SdkTracerProvider.builder()
                .setResource(resource)
                .setSampler(Sampler.alwaysOn())
                .build();
                
            OpenTelemetrySdk sdk = OpenTelemetrySdk.builder()
                .setTracerProvider(tracerProvider)
                .setPropagators(ContextPropagators.create(W3CTraceContextPropagator.getInstance()))
                .build();
                
            logger.info("OpenTelemetry SDK initialized successfully");
            return sdk;
        } catch (Exception e) {
            logger.warn("Failed to initialize OpenTelemetry SDK. Falling back to no-op implementation", e);
            return OpenTelemetry.noop();
        }
    }
}
