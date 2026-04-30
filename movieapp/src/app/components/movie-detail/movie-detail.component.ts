import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { Review } from '../../models/review.model';
import { NGXLogger } from 'ngx-logger';
import { TelemetryService } from '../../services/telemetry.service';
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReviewFormComponent],
  template: `
    <div class="container" *ngIf="!loading && movie">
      <div class="row mb-4">
        <div class="col-md-8">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><a routerLink="/movies">Movies</a></li>
              <li class="breadcrumb-item active" aria-current="page">{{ movie.title }}</li>
            </ol>
          </nav>
          <h1 class="display-4">{{ movie.title }}</h1>
          <p class="lead">Directed by {{ movie.director }}</p>
          
          <div class="mb-4">
            <span class="badge bg-primary me-2">{{ movie.genre || 'Unknown' }}</span>
            <span class="badge bg-secondary me-2">{{ movie.releaseDate | date:'yyyy' }}</span>
            <span class="badge bg-info" *ngIf="movie.durationMinutes">{{ movie.durationMinutes }} min</span>
          </div>
          
          <p class="movie-description">{{ movie.description }}</p>
        </div>
        <div class="col-md-4">
          <div class="movie-poster">
            <img *ngIf="movie.imagePath" [src]="getImageUrl(movie.imagePath)" [alt]="movie.title" class="img-fluid rounded">
            <div *ngIf="!movie.imagePath" class="placeholder-poster">
              <span class="material-icons">movie</span>
            </div>
          </div>
        </div>
      </div>
      
      <hr class="my-4">
      
      <div class="row">
        <div class="col-md-8">
          <h2>Reviews</h2>
          
          <app-review-form [movieId]="movie.id!" (reviewSubmitted)="onReviewSubmitted($event)"></app-review-form>
          
          <div class="reviews-section mt-4">
            <div *ngIf="!movie.reviews || movie.reviews.length === 0" class="alert alert-info">
              No reviews yet. Be the first to review this movie!
            </div>
            
            <div *ngFor="let review of movie.reviews" class="card mb-3 review-card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h5 class="card-title mb-0">{{ review.reviewerName }}</h5>
                  <div class="rating">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= review.rating">★</span>
                  </div>
                </div>
                <p class="card-text">{{ review.comment }}</p>
                <small class="text-muted">{{ review.createdAt | date:'medium' }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container" *ngIf="loading">
      <div class="row">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container" *ngIf="!loading && error">
      <div class="row">
        <div class="col-12">
          <div class="alert alert-danger" role="alert">
            {{ error }}
            <button class="btn btn-outline-primary ms-3" routerLink="/movies">Back to Movies</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .movie-poster {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .placeholder-poster {
      height: 400px;
      background-color: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }
    
    .placeholder-poster .material-icons {
      font-size: 6rem;
      color: #adb5bd;
    }
    
    .movie-description {
      font-size: 1.1rem;
      line-height: 1.6;
    }
    
    .review-card {
      transition: transform 0.2s ease;
    }
    
    .review-card:hover {
      transform: translateY(-3px);
    }
    
    .rating {
      font-size: 1.2rem;
      color: #ddd;
    }
    
    .rating .star.filled {
      color: #FFD700;
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  loading = true;
  error: string | null = null;
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private logger = inject(NGXLogger);
  private telemetryService = inject(TelemetryService);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadMovie(+id);
      } else {
        this.router.navigate(['/movies']);
      }
    });
  }

  loadMovie(id: number): void {
    const spanContext = this.telemetryService.startSpan('load_movie_details', {
      'movie.id': id
    });
    
    this.loading = true;
    this.error = null;
    
    this.movieService.getMovieWithReviews(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
        this.logger.info(`Loaded movie: ${movie.title}`);
        
        this.telemetryService.setAttributes({
          'movie.title': movie.title,
          'movie.reviews.count': movie.reviews?.length || 0
        });
        this.telemetryService.endSpan(spanContext, 'success');
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load movie details. Please try again later.';
        this.logger.error(`Error loading movie with ID: ${id}`, err);
        
        this.telemetryService.setAttributes({
          'error.message': err.message
        });
        this.telemetryService.endSpan(spanContext, 'error');
      }
    });
  }

  onReviewSubmitted(review: Review): void {
    // Refresh movie data to include the new review
    if (this.movie && this.movie.id) {
      this.loadMovie(this.movie.id);
    }
  }
  
  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';
    // Prepend the base URL for images
    return `http://localhost:9091/images/${imagePath}`;
  }
}
