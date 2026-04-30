package com.abc.moviereview.aspect;

import com.abc.moviereview.dto.ReviewDTO;
import io.micrometer.core.instrument.MeterRegistry;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
public class MetricsAspectIntegrationTest {

    @Autowired
    private MeterRegistry meterRegistry;
    
    @Autowired
    private MetricsAspect metricsAspect;
    
    @Test
    void shouldHaveMetricsAspectConfigured() {
        // Simply verify that the metrics aspect is properly configured
        assertNotNull(metricsAspect, "MetricsAspect should be configured");
        assertNotNull(meterRegistry, "MeterRegistry should be available");
    }
}


