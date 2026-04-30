package com.abc.moviereview.mapper;

import com.abc.moviereview.dto.ReviewDTO;
import com.abc.moviereview.model.Review;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * Mapper class for converting between Review entity and ReviewDTO.
 */
@Component
public class ReviewMapper {

    /**
     * Convert Review entity to ReviewDTO.
     * @param review Review entity
     * @return ReviewDTO
     */
    public ReviewDTO toDTO(Review review) {
        if (review == null) {
            return null;
        }
        
        ReviewDTO dto = new ReviewDTO();
        dto.setId(review.getId());
        dto.setMovieId(review.getMovieId());
        dto.setReviewerName(review.getReviewerName());
        dto.setComment(review.getComment());
        dto.setRating(review.getRating());
        dto.setCreatedAt(review.getCreatedAt());
        
        return dto;
    }
    
    /**
     * Convert ReviewDTO to Review entity.
     * @param dto ReviewDTO
     * @return Review entity
     */
    public Review toEntity(ReviewDTO dto) {
        if (dto == null) {
            return null;
        }
        
        Review review = new Review();
        review.setId(dto.getId());
        review.setMovieId(dto.getMovieId());
        review.setReviewerName(dto.getReviewerName());
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());
        review.setCreatedAt(dto.getCreatedAt());
        
        return review;
    }
    
    /**
     * Update Review entity from ReviewDTO.
     * @param review Review entity to update
     * @param dto ReviewDTO with updated values
     * @return Updated Review entity
     */
    public Review updateEntityFromDTO(Review review, ReviewDTO dto) {
        if (review == null || dto == null) {
            return review;
        }
        
        review.setReviewerName(dto.getReviewerName());
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());
        
        return review;
    }
    
    /**
     * Convert list of Review entities to list of ReviewDTOs.
     * @param reviews List of Review entities
     * @return List of ReviewDTOs
     */
    public List<ReviewDTO> toDTOList(List<Review> reviews) {
        if (reviews == null) {
            return Collections.emptyList();
        }
        
        return reviews.stream()
                .map(this::toDTO)
                .toList();
    }
}
