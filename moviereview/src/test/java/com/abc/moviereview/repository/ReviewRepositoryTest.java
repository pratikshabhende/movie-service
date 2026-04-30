package com.abc.moviereview.repository;

import com.abc.moviereview.model.Review;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class ReviewRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ReviewRepository reviewRepository;

    @Test
    void findById_WithExistingId_ShouldReturnReview() {
        // Given
        Review review = new Review(null, 1L, "Test Reviewer", "Test Comment", 5, LocalDateTime.now());
        entityManager.persist(review);
        entityManager.flush();

        // When
        Optional<Review> found = reviewRepository.findById(review.getId());

        // Then
        assertTrue(found.isPresent());
        assertEquals("Test Reviewer", found.get().getReviewerName());
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnEmpty() {
        // When
        Optional<Review> found = reviewRepository.findById(999L);

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void findByMovieId_ShouldReturnReviewsForMovie() {
        // Given
        Review review1 = new Review(null, 1L, "Test Reviewer 1", "Test Comment 1", 5, LocalDateTime.now());
        Review review2 = new Review(null, 1L, "Test Reviewer 2", "Test Comment 2", 4, LocalDateTime.now());
        Review review3 = new Review(null, 2L, "Test Reviewer 3", "Test Comment 3", 3, LocalDateTime.now());
        entityManager.persist(review1);
        entityManager.persist(review2);
        entityManager.persist(review3);
        entityManager.flush();

        // When
        List<Review> reviews = reviewRepository.findByMovieId(1L);

        // Then
        assertEquals(2, reviews.size());
        assertEquals(1L, reviews.get(0).getMovieId());
        assertEquals(1L, reviews.get(1).getMovieId());
    }

    @Test
    void findAll_ShouldReturnAllReviews() {
        // Given
        Review review1 = new Review(null, 1L, "Test Reviewer 1", "Test Comment 1", 5, LocalDateTime.now());
        Review review2 = new Review(null, 2L, "Test Reviewer 2", "Test Comment 2", 4, LocalDateTime.now());
        entityManager.persist(review1);
        entityManager.persist(review2);
        entityManager.flush();

        // When
        List<Review> reviews = reviewRepository.findAll();

        // Then
        assertEquals(2, reviews.size());
    }

    @Test
    void save_ShouldPersistReview() {
        // Given
        Review review = new Review(null, 1L, "Test Reviewer", "Test Comment", 5, LocalDateTime.now());

        // When
        Review saved = reviewRepository.save(review);

        // Then
        assertNotNull(saved.getId());
        assertEquals("Test Reviewer", saved.getReviewerName());
    }

    @Test
    void delete_ShouldRemoveReview() {
        // Given
        Review review = new Review(null, 1L, "Test Reviewer", "Test Comment", 5, LocalDateTime.now());
        entityManager.persist(review);
        entityManager.flush();
        
        // When
        reviewRepository.deleteById(review.getId());
        
        // Then
        Optional<Review> found = reviewRepository.findById(review.getId());
        assertFalse(found.isPresent());
    }
}
