import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { NGXLogger } from 'ngx-logger';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card mb-4">
      <div class="card-header bg-light">
        <h5 class="mb-0">Write a Review</h5>
      </div>
      <div class="card-body">
        <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="reviewerName" class="form-label">Your Name</label>
            <input 
              type="text" 
              class="form-control" 
              id="reviewerName" 
              formControlName="reviewerName"
              [class.is-invalid]="submitted && f['reviewerName'].errors"
            >
            <div class="invalid-feedback" *ngIf="submitted && f['reviewerName'].errors">
              <span *ngIf="f['reviewerName'].errors['required']">Name is required</span>
            </div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Rating</label>
            <div class="rating-input">
              <div class="stars">
                <span 
                  *ngFor="let star of [5,4,3,2,1]" 
                  class="star" 
                  [class.filled]="star <= rating"
                  (click)="setRating(star)"
                  (mouseenter)="hoverRating = star"
                  (mouseleave)="hoverRating = 0"
                  [class.hover]="star <= hoverRating && star > rating"
                >★</span>
              </div>
              <div class="rating-text" *ngIf="rating > 0">
                {{ getRatingText() }}
              </div>
              <div class="invalid-feedback d-block" *ngIf="submitted && f['rating'].errors">
                <span *ngIf="f['rating'].errors['required']">Rating is required</span>
              </div>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="comment" class="form-label">Your Review</label>
            <textarea 
              class="form-control" 
              id="comment" 
              rows="4" 
              formControlName="comment"
              [class.is-invalid]="submitted && f['comment'].errors"
            ></textarea>
            <div class="invalid-feedback" *ngIf="submitted && f['comment'].errors">
              <span *ngIf="f['comment'].errors['required']">Review comment is required</span>
              <span *ngIf="f['comment'].errors['minlength']">Review must be at least 10 characters</span>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="submitting"
          >
            <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Submit Review
          </button>
          
          <div class="alert alert-success mt-3" *ngIf="submitSuccess">
            Your review has been submitted successfully!
          </div>
          
          <div class="alert alert-danger mt-3" *ngIf="submitError">
            {{ submitError }}
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .rating-input {
      margin-bottom: 15px;
    }
    
    .stars {
      font-size: 2rem;
      cursor: pointer;
      direction: rtl;
      display: inline-block;
    }
    
    .star {
      color: #ddd;
      display: inline-block;
      transition: color 0.2s ease;
      margin-right: 5px;
    }
    
    .star.filled {
      color: #FFD700;
    }
    
    .star.hover {
      color: #FFED85;
    }
    
    .rating-text {
      margin-top: 5px;
      font-style: italic;
      color: #6c757d;
    }
  `]
})
export class ReviewFormComponent {
  @Input() movieId!: number;
  @Output() reviewSubmitted = new EventEmitter<Review>();
  
  reviewForm: FormGroup;
  rating = 0;
  hoverRating = 0;
  submitted = false;
  submitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  
  private fb = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private logger = inject(NGXLogger);
  private telemetryService = inject(TelemetryService);
  
  constructor() {
    this.reviewForm = this.fb.group({
      reviewerName: ['', [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }
  
  get f() { 
    return this.reviewForm.controls; 
  }
  
  setRating(value: number): void {
    this.rating = value;
    this.reviewForm.patchValue({ rating: value });
  }
  
  getRatingText(): string {
    const ratingTexts = [
      'Poor',
      'Fair',
      'Good',
      'Very Good',
      'Excellent'
    ];
    return ratingTexts[this.rating - 1] || '';
  }
  
  onSubmit(): void {
    this.submitted = true;
    this.submitSuccess = false;
    this.submitError = null;
    
    if (this.reviewForm.invalid) {
      return;
    }
    
    const spanContext = this.telemetryService.startSpan('submit_review', {
      'movie.id': this.movieId,
      'review.rating': this.rating
    });
    
    this.submitting = true;
    
    const review: Review = {
      movieId: this.movieId,
      reviewerName: this.reviewForm.value.reviewerName,
      comment: this.reviewForm.value.comment,
      rating: this.reviewForm.value.rating
    };
    
    this.reviewService.createReview(review).subscribe({
      next: (createdReview) => {
        this.submitting = false;
        this.submitSuccess = true;
        this.reviewForm.reset();
        this.rating = 0;
        this.submitted = false;
        
        this.logger.info(`Review submitted for movie ID: ${this.movieId}`);
        this.reviewSubmitted.emit(createdReview);
        
        this.telemetryService.endSpan(spanContext, 'success');
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 3000);
      },
      error: (err) => {
        this.submitting = false;
        this.submitError = 'Failed to submit review. Please try again later.';
        
        this.logger.error(`Error submitting review for movie ID: ${this.movieId}`, err);
        
        this.telemetryService.setAttributes({
          'error.message': err.message
        });
        this.telemetryService.endSpan(spanContext, 'error');
      }
    });
  }
}
