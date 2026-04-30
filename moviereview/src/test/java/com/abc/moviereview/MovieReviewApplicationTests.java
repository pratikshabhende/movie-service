package com.abc.moviereview;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@ActiveProfiles("test")
class MovieReviewApplicationTests {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void contextLoads() {
        // This test verifies that the Spring application context loads successfully
        assertNotNull(applicationContext, "Application context should not be null");
        assertTrue(applicationContext.getBeanDefinitionCount() > 0, "Application context should contain bean definitions");
        assertNotNull(applicationContext.getId(), "Application context should have an ID");
    }
    
    // We'll test the main class separately to avoid starting the actual web server
    @Test
    void applicationClassExists() {
        // Simple test to verify the application class exists and can be loaded
        MovieReviewApplication application = new MovieReviewApplication();
        assertNotNull(application, "MovieReviewApplication instance should not be null");
        assertEquals("MovieReviewApplication", application.getClass().getSimpleName(), "Class name should match expected value");
        assertTrue(application instanceof MovieReviewApplication, "Instance should be of correct type");
    }
}
