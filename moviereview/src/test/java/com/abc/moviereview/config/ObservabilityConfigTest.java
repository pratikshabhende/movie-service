package com.abc.moviereview.config;

import io.micrometer.observation.ObservationRegistry;
import io.micrometer.observation.aop.ObservedAspect;
import io.opentelemetry.api.OpenTelemetry;
import io.opentelemetry.sdk.resources.Resource;
import io.opentelemetry.semconv.resource.attributes.ResourceAttributes;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ObservabilityConfigTest {
    
    /**
     * Test configuration to provide mock beans
     */
    @Configuration
    static class TestConfig {
        @Bean
        @Primary
        public OpenTelemetry mockOpenTelemetry() {
            return OpenTelemetry.noop();
        }
    }

    @Nested
    @SpringBootTest(classes = {ObservabilityConfig.class, ObservabilityConfigTest.TestConfig.class})
    @TestPropertySource(properties = {"spring.application.name=test-service", "otel.sdk.disabled=false", "management.tracing.enabled=true"})
    class MainConfigTest {
        @Autowired
        private ObservabilityConfig observabilityConfig;

        @MockBean
        private ObservationRegistry observationRegistry;

        @Test
        void shouldCreateObservedAspect() {
            // Act
            ObservedAspect aspect = observabilityConfig.observedAspect(observationRegistry);
            
            // Assert
            assertNotNull(aspect, "ObservedAspect should not be null");
        }
        
        @Test
        void shouldCreateOtelResource() {
            // Act
            Resource resource = observabilityConfig.otelResource();
            
            // Assert
            assertNotNull(resource, "Resource should not be null");
            assertTrue(resource.getAttributes().asMap().containsKey(ResourceAttributes.SERVICE_NAME),
                    "Resource should contain SERVICE_NAME attribute");
            assertTrue(resource.getAttributes().asMap().containsKey(ResourceAttributes.SERVICE_VERSION),
                    "Resource should contain SERVICE_VERSION attribute");
        }
        
        @Test
        void shouldCreateOpenTelemetryWithValidConfig() {
            // Act
            Resource resource = observabilityConfig.otelResource();
            OpenTelemetry openTelemetry = observabilityConfig.openTelemetry(resource);
            
            // Assert
            assertNotNull(openTelemetry, "OpenTelemetry should not be null");
        }
    }
    
    @Nested
    @ExtendWith(MockitoExtension.class)
    class UnitTests {
        @InjectMocks
        private ObservabilityConfig observabilityConfig;

        @Mock
        private ObservationRegistry observationRegistry;
        
        @Test
        void shouldFallbackToNoopWhenExceptionOccurs() {
            // Arrange
            ReflectionTestUtils.setField(observabilityConfig, "serviceName", "test-service");
            ReflectionTestUtils.setField(observabilityConfig, "otlpEndpoint", "invalid://endpoint");
            Resource resource = mock(Resource.class);
            
            // Act
            OpenTelemetry openTelemetry = observabilityConfig.openTelemetry(resource);
            
            // Assert
            assertNotNull(openTelemetry, "OpenTelemetry should not be null even with invalid endpoint");
            // Note: We can't directly test if it's a no-op implementation, but we can verify it doesn't throw exceptions
        }
    }
}
