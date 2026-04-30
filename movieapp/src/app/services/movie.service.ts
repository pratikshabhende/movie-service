import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.model';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = environment.movieWorldApiUrl;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger
  ) {}

  /**
   * Get all movies
   * @returns Observable<Movie[]>
   */
  getAllMovies(): Observable<Movie[]> {
    this.logger.debug('Fetching all movies');
    return this.http.get<Movie[]>(this.apiUrl);
  }

  /**
   * Get movie by ID
   * @param id Movie ID
   * @returns Observable<Movie>
   */
  getMovieById(id: number): Observable<Movie> {
    this.logger.debug(`Fetching movie with ID: ${id}`);
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get movie with reviews
   * @param id Movie ID
   * @returns Observable<Movie>
   */
  getMovieWithReviews(id: number): Observable<Movie> {
    this.logger.debug(`Fetching movie with ID: ${id} including reviews`);
    return this.http.get<Movie>(`${this.apiUrl}/${id}/with-reviews`);
  }

  /**
   * Create a new movie
   * @param movie Movie data
   * @returns Observable<Movie>
   */
  createMovie(movie: Movie): Observable<Movie> {
    this.logger.debug('Creating new movie', movie);
    return this.http.post<Movie>(this.apiUrl, movie);
  }

  /**
   * Update an existing movie
   * @param id Movie ID
   * @param movie Updated movie data
   * @returns Observable<Movie>
   */
  updateMovie(id: number, movie: Movie): Observable<Movie> {
    this.logger.debug(`Updating movie with ID: ${id}`, movie);
    return this.http.put<Movie>(`${this.apiUrl}/${id}`, movie);
  }

  /**
   * Delete a movie
   * @param id Movie ID
   * @returns Observable<void>
   */
  deleteMovie(id: number): Observable<void> {
    this.logger.debug(`Deleting movie with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
