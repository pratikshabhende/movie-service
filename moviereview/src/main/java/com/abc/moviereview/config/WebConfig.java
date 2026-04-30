package com.abc.moviereview.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration for the MovieReview application.
 * Configures CORS to allow requests from the frontend.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configure CORS for the application.
     * @param registry CORS registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
        // Note: allowCredentials is removed when using allowedOrigins("*")
    }
}
