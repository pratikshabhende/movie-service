package com.abc.moviereview.dto;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class ReviewDTOTest {

    @Test
    void testReviewDTO() {
        LocalDateTime now = LocalDateTime.now();
        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setId(1L);
        reviewDTO.setMovieId(1L);
        reviewDTO.setReviewerName("Reviewer");
        reviewDTO.setComment("Comment");
        reviewDTO.setRating(5);
        reviewDTO.setCreatedAt(now);

        assertEquals(1L, reviewDTO.getId());
        assertEquals(1L, reviewDTO.getMovieId());
        assertEquals("Reviewer", reviewDTO.getReviewerName());
        assertEquals("Comment", reviewDTO.getComment());
        assertEquals(5, reviewDTO.getRating());
        assertEquals(now, reviewDTO.getCreatedAt());

        ReviewDTO reviewDTO2 = new ReviewDTO(1L, 1L, "Reviewer", "Comment", 5, now);
        assertEquals(reviewDTO, reviewDTO2);
        assertEquals(reviewDTO.hashCode(), reviewDTO2.hashCode());
    }
}
