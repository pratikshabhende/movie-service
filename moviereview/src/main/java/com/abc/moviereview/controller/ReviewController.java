package com.abc.moviereview.controller;

import com.abc.moviereview.dto.ReviewDTO;
import com.abc.moviereview.service.ReviewService;
import io.micrometer.observation.annotation.Observed;
import io.opentelemetry.instrumentation.annotations.SpanAttribute;
import io.opentelemetry.instrumentation.annotations.WithSpan;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for Review operations.
 * Provides endpoints for CRUD operations on reviews.
 */
@RestController
@RequestMapping("/api/moviereview")
@Tag(name = "Review API", description = "API for review operations")
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * Get all reviews.
     * @return List of all reviews
     */
    @GetMapping
    @Operation(summary = "Get all reviews", description = "Returns a list of all reviews")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews")
    @Observed(name = "review.getAll", 
             contextualName = "get-all-reviews", 
             lowCardinalityKeyValues = {"service", "movie-review"})
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        log.info("REST request to get all reviews");
        List<ReviewDTO> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    /**
     * Get a review by its ID.
     * @param id Review ID
     * @return Review if found
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get a review by ID", description = "Returns a review by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved review"),
        @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<ReviewDTO> getReviewById(@PathVariable Long id) {
        log.info("REST request to get review with id: {}", id);
        Optional<ReviewDTO> review = reviewService.getReviewById(id);
        return review.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get all reviews for a movie.
     * @param movieId Movie ID
     * @return List of reviews for the movie
     */
    @GetMapping("/movie/{movieId}")
    @Operation(summary = "Get all reviews for a movie", description = "Returns a list of all reviews for a movie")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews")
    public ResponseEntity<List<ReviewDTO>> getReviewsByMovieId(@PathVariable Long movieId) {
        log.info("REST request to get reviews for movie with id: {}", movieId);
        List<ReviewDTO> reviews = reviewService.getReviewsByMovieId(movieId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Create a new review.
     * @param reviewDTO Review to create
     * @return Created review
     */
    @PostMapping
    @Operation(summary = "Create a new review", description = "Creates a new review")
    @ApiResponse(responseCode = "201", description = "Review created successfully")
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO reviewDTO) {
        log.info("REST request to create a new review for movie with id: {}", reviewDTO.getMovieId());
        ReviewDTO createdReview = reviewService.createReview(reviewDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
    }

    /**
     * Update an existing review.
     * @param id Review ID
     * @param reviewDTO Updated review details
     * @return Updated review if found
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update a review", description = "Updates an existing review")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Review updated successfully"),
        @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long id, @Valid @RequestBody ReviewDTO reviewDTO) {
        log.info("REST request to update review with id: {}", id);
        ReviewDTO updatedReview = reviewService.updateReview(id, reviewDTO);
        return updatedReview != null ? 
                ResponseEntity.ok(updatedReview) : 
                ResponseEntity.notFound().build();
    }

    /**
     * Delete a review.
     * @param id Review ID
     * @return No content if deleted
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review", description = "Deletes a review by its ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Review deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Review not found")
    })
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        log.info("REST request to delete review with id: {}", id);
        boolean deleted = reviewService.deleteReview(id);
        return deleted ? 
                ResponseEntity.noContent().build() : 
                ResponseEntity.notFound().build();
    }
}
