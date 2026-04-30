package com.abc.moviereview.repository;

import com.abc.moviereview.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Review entity.
 * Provides CRUD operations for Review entities.
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    /**
     * Find all reviews for a movie.
     * @param movieId Movie ID
     * @return List of reviews for the movie
     */
    List<Review> findByMovieId(Long movieId);
}
