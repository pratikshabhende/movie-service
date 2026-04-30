package com.abc.moviereview.service;

import com.abc.moviereview.dto.ReviewDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for Review operations.
 * Provides business logic for CRUD operations on reviews.
 */
public interface ReviewService {

    /**
     * Get all reviews.
     * @return List of all reviews
     */
    List<ReviewDTO> getAllReviews();

    /**
     * Get a review by its ID.
     * @param id Review ID
     * @return Optional containing the review if found, empty otherwise
     */
    Optional<ReviewDTO> getReviewById(Long id);

    /**
     * Get all reviews for a movie.
     * @param movieId Movie ID
     * @return List of reviews for the movie
     */
    List<ReviewDTO> getReviewsByMovieId(Long movieId);

    /**
     * Create a new review.
     * @param reviewDTO Review to create
     * @return Created review
     */
    ReviewDTO createReview(ReviewDTO reviewDTO);

    /**
     * Update an existing review.
     * @param id Review ID
     * @param reviewDTO Updated review details
     * @return Updated review if found, null otherwise
     */
    ReviewDTO updateReview(Long id, ReviewDTO reviewDTO);

    /**
     * Delete a review.
     * @param id Review ID
     * @return true if deleted, false if not found
     */
    boolean deleteReview(Long id);
}
