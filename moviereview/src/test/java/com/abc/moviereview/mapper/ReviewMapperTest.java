package com.abc.moviereview.mapper;

import com.abc.moviereview.dto.ReviewDTO;
import com.abc.moviereview.model.Review;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ReviewMapperTest {

    private ReviewMapper reviewMapper;
    private Review testReview;
    private ReviewDTO testReviewDTO;

    @BeforeEach
    void setUp() {
        reviewMapper = new ReviewMapper();
        testReview = new Review(1L, 123L, "John Doe", "Great movie!", 5, LocalDateTime.now());
        testReviewDTO = new ReviewDTO(1L, 123L, "John Doe", "Great movie!", 5, LocalDateTime.now());
    }

    @Test
    void toDTO_WithValidReview_ShouldReturnValidDTO() {
        ReviewDTO result = reviewMapper.toDTO(testReview);

        assertNotNull(result);
        assertEquals(testReview.getId(), result.getId());
        assertEquals(testReview.getMovieId(), result.getMovieId());
        assertEquals(testReview.getReviewerName(), result.getReviewerName());
        assertEquals(testReview.getComment(), result.getComment());
        assertEquals(testReview.getRating(), result.getRating());
        assertEquals(testReview.getCreatedAt(), result.getCreatedAt());
    }

    @Test
    void toDTO_WithNullReview_ShouldReturnNull() {
        ReviewDTO result = reviewMapper.toDTO(null);
        assertNull(result);
    }

    @Test
    void toDTO_WithReviewHavingNullFields_ShouldHandleGracefully() {
        Review reviewWithNulls = new Review(null, null, null, null, null, null);
        
        ReviewDTO result = reviewMapper.toDTO(reviewWithNulls);
        
        assertNotNull(result);
        assertNull(result.getId());
        assertNull(result.getMovieId());
        assertNull(result.getReviewerName());
        assertNull(result.getComment());
        assertNull(result.getRating());
        assertNull(result.getCreatedAt());
    }

    @Test
    void toEntity_WithValidDTO_ShouldReturnValidEntity() {
        Review result = reviewMapper.toEntity(testReviewDTO);

        assertNotNull(result);
        assertEquals(testReviewDTO.getId(), result.getId());
        assertEquals(testReviewDTO.getMovieId(), result.getMovieId());
        assertEquals(testReviewDTO.getReviewerName(), result.getReviewerName());
        assertEquals(testReviewDTO.getComment(), result.getComment());
        assertEquals(testReviewDTO.getRating(), result.getRating());
        assertEquals(testReviewDTO.getCreatedAt(), result.getCreatedAt());
    }

    @Test
    void toEntity_WithNullDTO_ShouldReturnNull() {
        Review result = reviewMapper.toEntity(null);
        assertNull(result);
    }

    @Test
    void toEntity_WithDTOHavingNullFields_ShouldHandleGracefully() {
        ReviewDTO dtoWithNulls = new ReviewDTO(null, null, null, null, null, null);
        
        Review result = reviewMapper.toEntity(dtoWithNulls);
        
        assertNotNull(result);
        assertNull(result.getId());
        assertNull(result.getMovieId());
        assertNull(result.getReviewerName());
        assertNull(result.getComment());
        assertNull(result.getRating());
        assertNull(result.getCreatedAt());
    }

    @Test
    void updateEntityFromDTO_WithValidInputs_ShouldUpdateEntity() {
        Review existingReview = new Review(1L, 123L, "Old Name", "Old Comment", 3, LocalDateTime.now());
        ReviewDTO updateDTO = new ReviewDTO(1L, 123L, "New Name", "New Comment", 4, LocalDateTime.now());

        Review result = reviewMapper.updateEntityFromDTO(existingReview, updateDTO);

        assertNotNull(result);
        assertEquals("New Name", result.getReviewerName());
        assertEquals("New Comment", result.getComment());
        assertEquals(4, result.getRating());
        // ID and movieId should remain unchanged
        assertEquals(1L, result.getId());
        assertEquals(123L, result.getMovieId());
    }

    @Test
    void updateEntityFromDTO_WithNullEntity_ShouldReturnNull() {
        Review result = reviewMapper.updateEntityFromDTO(null, testReviewDTO);
        assertNull(result);
    }

    @Test
    void updateEntityFromDTO_WithNullDTO_ShouldReturnOriginalEntity() {
        Review result = reviewMapper.updateEntityFromDTO(testReview, null);
        assertEquals(testReview, result);
    }

    @Test
    void updateEntityFromDTO_WithBothNull_ShouldReturnNull() {
        Review result = reviewMapper.updateEntityFromDTO(null, null);
        assertNull(result);
    }

    @Test
    void updateEntityFromDTO_WithDTOHavingNullFields_ShouldUpdateWithNulls() {
        Review existingReview = new Review(1L, 123L, "Old Name", "Old Comment", 3, LocalDateTime.now());
        ReviewDTO updateDTO = new ReviewDTO(1L, 123L, null, null, null, LocalDateTime.now());

        Review result = reviewMapper.updateEntityFromDTO(existingReview, updateDTO);

        assertNotNull(result);
        assertNull(result.getReviewerName());
        assertNull(result.getComment());
        assertNull(result.getRating());
        // Original ID and movieId should remain
        assertEquals(1L, result.getId());
        assertEquals(123L, result.getMovieId());
    }

    @Test
    void toDTOList_WithValidList_ShouldReturnValidDTOList() {
        Review review1 = new Review(1L, 123L, "John Doe", "Great!", 5, LocalDateTime.now());
        Review review2 = new Review(2L, 124L, "Jane Smith", "Good!", 4, LocalDateTime.now());
        List<Review> reviews = Arrays.asList(review1, review2);

        List<ReviewDTO> result = reviewMapper.toDTOList(reviews);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("John Doe", result.get(0).getReviewerName());
        assertEquals("Jane Smith", result.get(1).getReviewerName());
    }

    @Test
    void toDTOList_WithNullList_ShouldReturnEmptyList() {
        List<ReviewDTO> result = reviewMapper.toDTOList(null);
        
        assertNotNull(result);
        assertTrue(result.isEmpty());
        assertEquals(Collections.emptyList(), result);
    }

    @Test
    void toDTOList_WithEmptyList_ShouldReturnEmptyList() {
        List<ReviewDTO> result = reviewMapper.toDTOList(Arrays.asList());
        
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void toDTOList_WithListContainingNullElements_ShouldHandleGracefully() {
        Review validReview = new Review(1L, 123L, "John Doe", "Great!", 5, LocalDateTime.now());
        List<Review> reviewsWithNull = Arrays.asList(validReview, null);

        List<ReviewDTO> result = reviewMapper.toDTOList(reviewsWithNull);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertNotNull(result.get(0));
        assertNull(result.get(1));
    }

    @Test
    void toDTOList_WithLargeList_ShouldProcessAllElements() {
        List<Review> largeList = Arrays.asList(
            new Review(1L, 123L, "User1", "Comment1", 5, LocalDateTime.now()),
            new Review(2L, 124L, "User2", "Comment2", 4, LocalDateTime.now()),
            new Review(3L, 125L, "User3", "Comment3", 3, LocalDateTime.now()),
            new Review(4L, 126L, "User4", "Comment4", 2, LocalDateTime.now()),
            new Review(5L, 127L, "User5", "Comment5", 1, LocalDateTime.now())
        );

        List<ReviewDTO> result = reviewMapper.toDTOList(largeList);

        assertNotNull(result);
        assertEquals(5, result.size());
        for (int i = 0; i < 5; i++) {
            assertEquals("User" + (i + 1), result.get(i).getReviewerName());
            assertEquals("Comment" + (i + 1), result.get(i).getComment());
        }
    }

    @Test
    void mapper_ShouldBeStateless() {
        // Test that the mapper doesn't maintain state between calls
        ReviewDTO result1 = reviewMapper.toDTO(testReview);
        ReviewDTO result2 = reviewMapper.toDTO(testReview);
        
        assertNotNull(result1);
        assertNotNull(result2);
        assertEquals(result1.getId(), result2.getId());
        assertEquals(result1.getReviewerName(), result2.getReviewerName());
        // Results should be equal but not the same instance
        assertNotSame(result1, result2);
    }
}
