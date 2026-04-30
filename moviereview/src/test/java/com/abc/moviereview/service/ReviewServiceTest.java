package com.abc.moviereview.service;

import com.abc.moviereview.dto.ReviewDTO;
import com.abc.moviereview.mapper.ReviewMapper;
import com.abc.moviereview.model.Review;
import com.abc.moviereview.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;
    
    @Mock
    private ReviewMapper reviewMapper;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private Review testReview;
    private ReviewDTO testReviewDTO;
    private List<Review> testReviews;
    private List<ReviewDTO> testReviewDTOs;

    @BeforeEach
    void setUp() {
        testReview = new Review(1L, 1L, "Test Reviewer", "Test Comment", 5, LocalDateTime.now());
        Review review2 = new Review(2L, 1L, "Test Reviewer 2", "Test Comment 2", 4, LocalDateTime.now());
        testReviews = Arrays.asList(testReview, review2);
        
        testReviewDTO = new ReviewDTO(1L, 1L, "Test Reviewer", "Test Comment", 5, LocalDateTime.now());
        ReviewDTO reviewDTO2 = new ReviewDTO(2L, 1L, "Test Reviewer 2", "Test Comment 2", 4, LocalDateTime.now());
        testReviewDTOs = Arrays.asList(testReviewDTO, reviewDTO2);
        
        when(reviewMapper.toDTO(testReview)).thenReturn(testReviewDTO);
        when(reviewMapper.toDTOList(testReviews)).thenReturn(testReviewDTOs);
        when(reviewMapper.toEntity(testReviewDTO)).thenReturn(testReview);
    }

    @Test
    void getAllReviews_ShouldReturnAllReviews() {
        when(reviewRepository.findAll()).thenReturn(testReviews);

        List<ReviewDTO> result = reviewService.getAllReviews();

        assertEquals(2, result.size());
        assertEquals("Test Reviewer", result.get(0).getReviewerName());
        assertEquals("Test Reviewer 2", result.get(1).getReviewerName());
        verify(reviewRepository, times(1)).findAll();
        verify(reviewMapper, times(1)).toDTOList(testReviews);
    }

    @Test
    void getReviewById_WithExistingId_ShouldReturnReview() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(testReview));

        Optional<ReviewDTO> result = reviewService.getReviewById(1L);

        assertTrue(result.isPresent());
        assertEquals("Test Reviewer", result.get().getReviewerName());
        verify(reviewRepository, times(1)).findById(1L);
        verify(reviewMapper, times(1)).toDTO(testReview);
    }

    @Test
    void getReviewById_WithNonExistingId_ShouldReturnEmpty() {
        when(reviewRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<ReviewDTO> result = reviewService.getReviewById(999L);

        assertFalse(result.isPresent());
        verify(reviewRepository, times(1)).findById(999L);
    }

    @Test
    void getReviewsByMovieId_ShouldReturnReviewsForMovie() {
        when(reviewRepository.findByMovieId(1L)).thenReturn(testReviews);

        List<ReviewDTO> result = reviewService.getReviewsByMovieId(1L);

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getMovieId());
        assertEquals(1L, result.get(1).getMovieId());
        verify(reviewRepository, times(1)).findByMovieId(1L);
        verify(reviewMapper, times(1)).toDTOList(testReviews);
    }

    @Test
    void createReview_ShouldSaveAndReturnReview() {
        when(reviewRepository.save(any(Review.class))).thenReturn(testReview);

        ReviewDTO result = reviewService.createReview(testReviewDTO);

        assertNotNull(result);
        assertEquals("Test Reviewer", result.getReviewerName());
        verify(reviewRepository, times(1)).save(any(Review.class));
        verify(reviewMapper, times(1)).toEntity(testReviewDTO);
        verify(reviewMapper, times(1)).toDTO(testReview);
    }

    @Test
    void updateReview_WithExistingId_ShouldUpdateAndReturnReview() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(testReview));
        when(reviewRepository.save(any(Review.class))).thenReturn(testReview);

        ReviewDTO result = reviewService.updateReview(1L, testReviewDTO);

        assertNotNull(result);
        assertEquals("Test Reviewer", result.getReviewerName());
        verify(reviewRepository, times(1)).findById(1L);
        verify(reviewRepository, times(1)).save(any(Review.class));
        verify(reviewMapper, times(1)).updateEntityFromDTO(any(Review.class), eq(testReviewDTO));
        verify(reviewMapper, times(1)).toDTO(testReview);
    }

    @Test
    void updateReview_WithNonExistingId_ShouldReturnNull() {
        when(reviewRepository.findById(999L)).thenReturn(Optional.empty());

        ReviewDTO result = reviewService.updateReview(999L, testReviewDTO);

        assertNull(result);
        verify(reviewRepository, times(1)).findById(999L);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void deleteReview_WithExistingId_ShouldReturnTrue() {
        when(reviewRepository.existsById(1L)).thenReturn(true);
        doNothing().when(reviewRepository).deleteById(1L);

        boolean result = reviewService.deleteReview(1L);

        assertTrue(result);
        verify(reviewRepository, times(1)).existsById(1L);
        verify(reviewRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteReview_WithNonExistingId_ShouldReturnFalse() {
        when(reviewRepository.existsById(999L)).thenReturn(false);

        boolean result = reviewService.deleteReview(999L);

        assertFalse(result);
        verify(reviewRepository, times(1)).existsById(999L);
        verify(reviewRepository, never()).deleteById(anyLong());
    }

    @Test
    void createReview_WithNullDTO_ShouldThrowNullPointerException() {
        // Test behavior when null DTO is passed - service throws NPE when accessing null DTO properties
        assertThrows(NullPointerException.class, () -> {
            reviewService.createReview(null);
        });
    }

    @Test
    void updateReview_WithNullDTO_ShouldStillProcessUpdate() {
        // Test behavior when null DTO is passed for update - service still processes it
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(testReview));
        when(reviewRepository.save(any(Review.class))).thenReturn(testReview);
        when(reviewMapper.toDTO(testReview)).thenReturn(testReviewDTO);
        
        ReviewDTO result = reviewService.updateReview(1L, null);
        
        assertNotNull(result); // Service still returns a result
        verify(reviewRepository, times(1)).findById(1L);
        verify(reviewRepository, times(1)).save(any(Review.class));
        verify(reviewMapper, times(1)).updateEntityFromDTO(any(Review.class), eq(null));
    }

    @Test
    void updateReview_WithNullId_ShouldStillCallRepository() {
        // Test behavior when null ID is passed - service still calls repository
        when(reviewRepository.findById(null)).thenReturn(Optional.empty());
        
        ReviewDTO result = reviewService.updateReview(null, testReviewDTO);
        
        assertNull(result); // Returns null because no review found
        verify(reviewRepository, times(1)).findById(null);
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void getAllReviews_WithRepositoryException_ShouldPropagateException() {
        when(reviewRepository.findAll()).thenThrow(new RuntimeException("Database connection error"));

        assertThrows(RuntimeException.class, () -> {
            reviewService.getAllReviews();
        });
        
        verify(reviewRepository, times(1)).findAll();
    }

    @Test
    void getReviewById_WithRepositoryException_ShouldPropagateException() {
        when(reviewRepository.findById(1L)).thenThrow(new RuntimeException("Database connection error"));

        assertThrows(RuntimeException.class, () -> {
            reviewService.getReviewById(1L);
        });
        
        verify(reviewRepository, times(1)).findById(1L);
    }

    @Test
    void getReviewsByMovieId_WithRepositoryException_ShouldPropagateException() {
        when(reviewRepository.findByMovieId(1L)).thenThrow(new RuntimeException("Database connection error"));

        assertThrows(RuntimeException.class, () -> {
            reviewService.getReviewsByMovieId(1L);
        });
        
        verify(reviewRepository, times(1)).findByMovieId(1L);
    }

    @Test
    void createReview_WithRepositoryException_ShouldPropagateException() {
        when(reviewRepository.save(any(Review.class))).thenThrow(new RuntimeException("Database constraint violation"));

        assertThrows(RuntimeException.class, () -> {
            reviewService.createReview(testReviewDTO);
        });
        
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void deleteReview_WithRepositoryException_ShouldPropagateException() {
        when(reviewRepository.existsById(1L)).thenReturn(true);
        doThrow(new RuntimeException("Database constraint violation")).when(reviewRepository).deleteById(1L);

        assertThrows(RuntimeException.class, () -> {
            reviewService.deleteReview(1L);
        });
        
        verify(reviewRepository, times(1)).existsById(1L);
        verify(reviewRepository, times(1)).deleteById(1L);
    }

    @Test
    void getReviewsByMovieId_WithEmptyResult_ShouldReturnEmptyList() {
        when(reviewRepository.findByMovieId(999L)).thenReturn(Arrays.asList());
        when(reviewMapper.toDTOList(Arrays.asList())).thenReturn(Arrays.asList());

        List<ReviewDTO> result = reviewService.getReviewsByMovieId(999L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(reviewRepository, times(1)).findByMovieId(999L);
        verify(reviewMapper, times(1)).toDTOList(Arrays.asList());
    }

    @Test
    void getAllReviews_WithEmptyResult_ShouldReturnEmptyList() {
        when(reviewRepository.findAll()).thenReturn(Arrays.asList());
        when(reviewMapper.toDTOList(Arrays.asList())).thenReturn(Arrays.asList());

        List<ReviewDTO> result = reviewService.getAllReviews();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(reviewRepository, times(1)).findAll();
        verify(reviewMapper, times(1)).toDTOList(Arrays.asList());
    }

    @Test
    void createReview_ShouldSetCreatedAtTimestamp() {
        // Verify that createReview sets the createdAt timestamp
        Review reviewWithoutTimestamp = new Review(null, 1L, "Test Reviewer", "Test Comment", 5, null);
        Review reviewWithTimestamp = new Review(1L, 1L, "Test Reviewer", "Test Comment", 5, LocalDateTime.now());
        
        when(reviewMapper.toEntity(testReviewDTO)).thenReturn(reviewWithoutTimestamp);
        when(reviewRepository.save(any(Review.class))).thenReturn(reviewWithTimestamp);
        when(reviewMapper.toDTO(reviewWithTimestamp)).thenReturn(testReviewDTO);

        ReviewDTO result = reviewService.createReview(testReviewDTO);

        assertNotNull(result);
        verify(reviewRepository, times(1)).save(argThat(review -> review.getCreatedAt() != null));
    }

    @Test
    void updateReview_WithNonExistingId_ShouldReturnNullExplicitly() {
        // Explicitly test the null return path to ensure complete branch coverage
        when(reviewRepository.findById(999L)).thenReturn(Optional.empty());

        ReviewDTO result = reviewService.updateReview(999L, testReviewDTO);

        assertNull(result);
        verify(reviewRepository, times(1)).findById(999L);
        verify(reviewMapper, never()).updateEntityFromDTO(any(), any());
        verify(reviewRepository, never()).save(any());
    }
}
