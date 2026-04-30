package com.abc.moviereview.service;

import com.abc.moviereview.dto.ReviewDTO;
import com.abc.moviereview.mapper.ReviewMapper;
import com.abc.moviereview.model.Review;
import com.abc.moviereview.repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service implementation class for Review operations.
 * Provides business logic for CRUD operations on reviews.
 */
@Service
@Slf4j
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;

    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository, ReviewMapper reviewMapper) {
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
    }

    /**
     * Get all reviews.
     * @return List of all reviews
     */
    @Override
    public List<ReviewDTO> getAllReviews() {
        log.info("Fetching all reviews");
        List<Review> reviews = reviewRepository.findAll();
        return reviewMapper.toDTOList(reviews);
    }

    /**
     * Get a review by its ID.
     * @param id Review ID
     * @return Optional containing the review if found, empty otherwise
     */
    @Override
    public Optional<ReviewDTO> getReviewById(Long id) {
        log.info("Fetching review with id: {}", id);
        return reviewRepository.findById(id)
                .map(reviewMapper::toDTO);
    }

    /**
     * Get all reviews for a movie.
     * @param movieId Movie ID
     * @return List of reviews for the movie
     */
    @Override
    public List<ReviewDTO> getReviewsByMovieId(Long movieId) {
        log.info("Fetching reviews for movie with id: {}", movieId);
        List<Review> reviews = reviewRepository.findByMovieId(movieId);
        return reviewMapper.toDTOList(reviews);
    }

    /**
     * Create a new review.
     * @param reviewDTO Review to create
     * @return Created review
     */
    @Override
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        log.info("Creating new review for movie with id: {}", reviewDTO.getMovieId());
        Review review = reviewMapper.toEntity(reviewDTO);
        review.setCreatedAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);
        return reviewMapper.toDTO(savedReview);
    }

    /**
     * Update an existing review.
     * @param id Review ID
     * @param reviewDTO Updated review details
     * @return Updated review if found, null otherwise
     */
    @Override
    public ReviewDTO updateReview(Long id, ReviewDTO reviewDTO) {
        log.info("Updating review with id: {}", id);
        Optional<Review> reviewOpt = reviewRepository.findById(id);
        
        if (reviewOpt.isPresent()) {
            Review review = reviewOpt.get();
            reviewMapper.updateEntityFromDTO(review, reviewDTO);
            Review updatedReview = reviewRepository.save(review);
            return reviewMapper.toDTO(updatedReview);
        }
        
        return null;
    }

    /**
     * Delete a review.
     * @param id Review ID
     * @return true if deleted, false if not found
     */
    @Override
    public boolean deleteReview(Long id) {
        log.info("Deleting review with id: {}", id);
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
