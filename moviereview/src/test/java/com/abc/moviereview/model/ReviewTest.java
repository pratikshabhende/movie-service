package com.abc.moviereview.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class ReviewTest {

    @Test
    void testReviewModel() {
        LocalDateTime now = LocalDateTime.now();
        Review review = new Review();
        review.setId(1L);
        review.setMovieId(1L);
        review.setReviewerName("Reviewer");
        review.setComment("Comment");
        review.setRating(5);
        review.setCreatedAt(now);

        assertEquals(1L, review.getId());
        assertEquals(1L, review.getMovieId());
        assertEquals("Reviewer", review.getReviewerName());
        assertEquals("Comment", review.getComment());
        assertEquals(5, review.getRating());
        assertEquals(now, review.getCreatedAt());

        Review review2 = new Review(1L, 1L, "Reviewer", "Comment", 5, now);
        assertEquals(review, review2);
        assertEquals(review.hashCode(), review2.hashCode());
    }
}
