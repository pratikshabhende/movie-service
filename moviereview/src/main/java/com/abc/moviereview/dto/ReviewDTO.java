package com.abc.moviereview.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Review entity.
 * Used for transferring review data between layers.
 * Can be used for create, update, and read operations.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Review Data Transfer Object")
public class ReviewDTO implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Schema(description = "Review ID (null for creation)")
    private Long id;
    
    @NotNull(message = "Movie ID is required")
    @Schema(description = "Movie ID", required = true)
    private Long movieId;
    
    @NotBlank(message = "Reviewer name is required")
    @Schema(description = "Reviewer name", required = true)
    private String reviewerName;
    
    @NotBlank(message = "Comment is required")
    @Schema(description = "Review comment", required = true)
    private String comment;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Schema(description = "Rating (1-5)", required = true)
    private Integer rating;
    
    @Schema(description = "Creation timestamp")
    private LocalDateTime createdAt;
}
