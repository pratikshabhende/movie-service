package com.abc.moviereview.aspect;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Basic test for MetricsAspect class.
 * Note: Full aspect testing would require integration tests with actual service methods.
 * This test simply verifies that the aspect can be instantiated with a meter registry.
 */
class MetricsAspectTest {

    @Test
    void shouldCreateMetricsAspect() {
        // Arrange
        MeterRegistry meterRegistry = new SimpleMeterRegistry();
        
        // Act
        MetricsAspect metricsAspect = new MetricsAspect(meterRegistry);
        
        // Assert
        assertNotNull(metricsAspect, "MetricsAspect should be created successfully");
    }
}
