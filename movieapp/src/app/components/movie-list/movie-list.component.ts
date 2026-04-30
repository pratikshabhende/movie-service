import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { NGXLogger } from 'ngx-logger';
import { TelemetryService } from '../../services/telemetry.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1 class="display-4">Movies</h1>
          <p class="lead">Browse our collection of movies</p>
        </div>
      </div>

      <div class="row">
        <div *ngIf="loading" class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div *ngIf="error" class="col-12">
          <div class="alert alert-danger" role="alert">
            {{ error }}
          </div>
        </div>

        <div *ngIf="!loading && !error && movies.length === 0" class="col-12">
          <div class="alert alert-info" role="alert">
            No movies found.
          </div>
        </div>

        <div *ngFor="let movie of movies" class="col-md-4 mb-4 fade-in">
          <div class="card h-100">
            <div *ngIf="movie.imagePath" class="card-img-top-container">
              <img [src]="getImageUrl(movie.imagePath)" class="card-img-top" [alt]="movie.title">
            </div>
            <div *ngIf="!movie.imagePath" class="card-img-top-placeholder">
              <span class="material-icons">movie</span>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ movie.title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ movie.director }}</h6>
              <p class="card-text">
                <span class="badge bg-primary me-2">{{ movie.genre || 'Unknown' }}</span>
                <span class="badge bg-secondary">{{ movie.releaseDate | date:'yyyy' }}</span>
              </p>
              <p class="card-text" *ngIf="movie.description">{{ movie.description | slice:0:100 }}{{ movie.description.length > 100 ? '...' : '' }}</p>
              <a [routerLink]="['/movies', movie.id]" class="btn btn-primary">View Details</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-img-top-container {
      height: 200px;
      overflow: hidden;
    }
    
    .card-img-top {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .card-img-top-placeholder {
      height: 200px;
      background-color: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card-img-top-placeholder .material-icons {
      font-size: 4rem;
      color: #adb5bd;
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease-in;
      animation-fill-mode: both;
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
  `]
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  error: string | null = null;
  
  private movieService = inject(MovieService);
  private logger = inject(NGXLogger);
  private telemetryService = inject(TelemetryService);

  ngOnInit(): void {
    this.loadMovies();
  }
  
  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';
    // Use the external image URL directly
    return imagePath;
  }

  loadMovies(): void {
    const spanContext = this.telemetryService.startSpan('load_movies');
    
    this.loading = true;
    this.error = null;
    
    this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
        this.logger.info(`Loaded ${movies.length} movies`);
        this.telemetryService.setAttributes({
          'movies.count': movies.length
        });
        this.telemetryService.endSpan(spanContext, 'success');
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load movies. Please try again later.';
        this.logger.error('Error loading movies', err);
        this.telemetryService.setAttributes({
          'error.message': err.message
        });
        this.telemetryService.endSpan(spanContext, 'error');
      }
    });
  }
}
