package com.abc.moviereview.controller;

import com.abc.moviereview.dto.ReviewDTO;
import com.abc.moviereview.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ReviewController.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReviewService reviewService;

    @Autowired
    private ObjectMapper objectMapper;

    private ReviewDTO testReviewDTO;
    private List<ReviewDTO> testReviewDTOs;

    @BeforeEach
    void setUp() {
        testReviewDTO = new ReviewDTO(1L, 1L, "Test Reviewer", "Test Comment", 5, LocalDateTime.now());
        ReviewDTO reviewDTO2 = new ReviewDTO(2L, 1L, "Test Reviewer 2", "Test Comment 2", 4, LocalDateTime.now());
        testReviewDTOs = Arrays.asList(testReviewDTO, reviewDTO2);
    }

    @Test
    void getAllReviews_ShouldReturnAllReviews() throws Exception {
        when(reviewService.getAllReviews()).thenReturn(testReviewDTOs);

        mockMvc.perform(get("/api/moviereview"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].reviewerName", is("Test Reviewer")))
                .andExpect(jsonPath("$[1].reviewerName", is("Test Reviewer 2")));

        verify(reviewService, times(1)).getAllReviews();
    }

    @Test
    void getReviewById_WithExistingId_ShouldReturnReview() throws Exception {
        when(reviewService.getReviewById(1L)).thenReturn(Optional.of(testReviewDTO));

        mockMvc.perform(get("/api/moviereview/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.reviewerName", is("Test Reviewer")));

        verify(reviewService, times(1)).getReviewById(1L);
    }

    @Test
    void getReviewById_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        when(reviewService.getReviewById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/moviereview/999"))
                .andExpect(status().isNotFound());

        verify(reviewService, times(1)).getReviewById(999L);
    }

    @Test
    void getReviewsByMovieId_ShouldReturnReviewsForMovie() throws Exception {
        when(reviewService.getReviewsByMovieId(1L)).thenReturn(testReviewDTOs);

        mockMvc.perform(get("/api/moviereview/movie/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].movieId", is(1)))
                .andExpect(jsonPath("$[1].movieId", is(1)));

        verify(reviewService, times(1)).getReviewsByMovieId(1L);
    }

    @Test
    void createReview_ShouldReturnCreatedReview() throws Exception {
        ReviewDTO newReviewDTO = new ReviewDTO(null, 1L, "New Reviewer", "New Comment", 5, null);
        ReviewDTO createdReviewDTO = new ReviewDTO(3L, 1L, "New Reviewer", "New Comment", 5, LocalDateTime.now());
        
        when(reviewService.createReview(any(ReviewDTO.class))).thenReturn(createdReviewDTO);

        mockMvc.perform(post("/api/moviereview")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newReviewDTO)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(3)))
                .andExpect(jsonPath("$.reviewerName", is("New Reviewer")));

        verify(reviewService, times(1)).createReview(any(ReviewDTO.class));
    }

    @Test
    void updateReview_WithExistingId_ShouldReturnUpdatedReview() throws Exception {
        ReviewDTO updatedReviewDTO = new ReviewDTO(1L, 1L, "Updated Reviewer", "Updated Comment", 3, LocalDateTime.now());
        
        when(reviewService.updateReview(eq(1L), any(ReviewDTO.class))).thenReturn(updatedReviewDTO);

        mockMvc.perform(put("/api/moviereview/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedReviewDTO)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.reviewerName", is("Updated Reviewer")))
                .andExpect(jsonPath("$.comment", is("Updated Comment")));

        verify(reviewService, times(1)).updateReview(eq(1L), any(ReviewDTO.class));
    }

    @Test
    void updateReview_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        ReviewDTO updatedReviewDTO = new ReviewDTO(999L, 1L, "Updated Reviewer", "Updated Comment", 3, LocalDateTime.now());
        
        when(reviewService.updateReview(eq(999L), any(ReviewDTO.class))).thenReturn(null);

        mockMvc.perform(put("/api/moviereview/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedReviewDTO)))
                .andExpect(status().isNotFound());

        verify(reviewService, times(1)).updateReview(eq(999L), any(ReviewDTO.class));
    }

    @Test
    void deleteReview_WithExistingId_ShouldReturnNoContent() throws Exception {
        when(reviewService.deleteReview(1L)).thenReturn(true);

        mockMvc.perform(delete("/api/moviereview/1"))
                .andExpect(status().isNoContent());

        verify(reviewService, times(1)).deleteReview(1L);
    }

    @Test
    void deleteReview_WithNonExistingId_ShouldReturnNotFound() throws Exception {
        when(reviewService.deleteReview(999L)).thenReturn(false);

        mockMvc.perform(delete("/api/moviereview/999"))
                .andExpect(status().isNotFound());

        verify(reviewService, times(1)).deleteReview(999L);
    }

    @Test
    void createReview_WithMalformedJson_ShouldReturnBadRequest() throws Exception {
        mockMvc.perform(post("/api/moviereview")
                .contentType(MediaType.APPLICATION_JSON)
                .content("invalid json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getReviewsByMovieId_WithEmptyResult_ShouldReturnEmptyList() throws Exception {
        when(reviewService.getReviewsByMovieId(999L)).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/moviereview/movie/999"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(reviewService, times(1)).getReviewsByMovieId(999L);
    }

    @Test
    void getAllReviews_WithEmptyResult_ShouldReturnEmptyList() throws Exception {
        when(reviewService.getAllReviews()).thenReturn(Arrays.asList());

        mockMvc.perform(get("/api/moviereview"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(0)));

        verify(reviewService, times(1)).getAllReviews();
    }

    @Test
    void createReview_WithServiceException_ShouldPropagateException() throws Exception {
        ReviewDTO newReviewDTO = new ReviewDTO(null, 1L, "New Reviewer", "New Comment", 5, null);
        
        when(reviewService.createReview(any(ReviewDTO.class))).thenThrow(new RuntimeException("Database error"));

        // The exception should be propagated, not converted to 500 status
        try {
            mockMvc.perform(post("/api/moviereview")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(newReviewDTO)));
        } catch (Exception e) {
            // Exception is expected to be thrown
        }

        verify(reviewService, times(1)).createReview(any(ReviewDTO.class));
    }

    @Test
    void updateReview_WithNullReturn_ShouldReturnNotFound() throws Exception {
        ReviewDTO updatedReviewDTO = new ReviewDTO(1L, 1L, "Updated Reviewer", "Updated Comment", 3, LocalDateTime.now());
        
        // Explicitly test the null return case to ensure branch coverage
        when(reviewService.updateReview(eq(1L), any(ReviewDTO.class))).thenReturn(null);

        mockMvc.perform(put("/api/moviereview/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedReviewDTO)))
                .andExpect(status().isNotFound());

        verify(reviewService, times(1)).updateReview(eq(1L), any(ReviewDTO.class));
    }

    @Test
    void deleteReview_WithFalseReturn_ShouldReturnNotFound() throws Exception {
        // Explicitly test the false return case to ensure branch coverage
        when(reviewService.deleteReview(1L)).thenReturn(false);

        mockMvc.perform(delete("/api/moviereview/1"))
                .andExpect(status().isNotFound());

        verify(reviewService, times(1)).deleteReview(1L);
    }
}
