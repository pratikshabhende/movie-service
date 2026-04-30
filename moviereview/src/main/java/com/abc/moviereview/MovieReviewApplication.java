package com.abc.moviereview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Movie Review service.
 * This service provides CRUD operations for movie reviews.
 */
@SpringBootApplication
public class MovieReviewApplication {

    public static void main(String[] args) {
        SpringApplication.run(MovieReviewApplication.class, args);
    }
}
