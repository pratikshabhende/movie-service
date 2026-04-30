import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.movieReviewApiUrl;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {}

  /**
   * Get all reviews
   * @returns Observable<Review[]>
   */
  getAllReviews(): Observable<Review[]> {
    this.logger.debug('Fetching all reviews');
    return this.http.get<Review[]>(this.apiUrl);
  }

  /**
   * Get review by ID
   * @param id Review ID
   * @returns Observable<Review>
   */
  getReviewById(id: number): Observable<Review> {
    this.logger.debug(`Fetching review with ID: ${id}`);
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get reviews by movie ID
   * @param movieId Movie ID
   * @returns Observable<Review[]>
   */
  getReviewsByMovieId(movieId: number): Observable<Review[]> {
    this.logger.debug(`Fetching reviews for movie with ID: ${movieId}`);
    return this.http.get<Review[]>(`${this.apiUrl}/movie/${movieId}`);
  }

  /**
   * Create a new review
   * @param review Review data
   * @returns Observable<Review>
   */
  createReview(review: Review): Observable<Review> {
    this.logger.debug('Creating new review', review);
    return this.http.post<Review>(this.apiUrl, review);
  }

  /**
   * Update an existing review
   * @param id Review ID
   * @param review Updated review data
   * @returns Observable<Review>
   */
  updateReview(id: number, review: Review): Observable<Review> {
    this.logger.debug(`Updating review with ID: ${id}`, review);
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  /**
   * Delete a review
   * @param id Review ID
   * @returns Observable<void>
   */
  deleteReview(id: number): Observable<void> {
    this.logger.debug(`Deleting review with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
