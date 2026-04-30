import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { NGXLogger } from 'ngx-logger';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie.model';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  let loggerSpy: { debug: jest.Mock; info: jest.Mock; error: jest.Mock };

  beforeEach(() => {
    const spy = {
      debug: jest.fn(),
      info: jest.fn(),
      error: jest.fn()
    };
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MovieService,
        { provide: NGXLogger, useValue: spy }
      ]
    });
    
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerSpy = TestBed.inject(NGXLogger) as any;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all movies', () => {
    const mockMovies: Movie[] = [
      {
        id: 1,
        title: 'Test Movie',
        director: 'Test Director',
        releaseDate: '2023-01-01',
        genre: 'Action'
      }
    ];

    service.getAllMovies().subscribe(movies => {
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne(environment.movieWorldApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
    expect(loggerSpy.debug).toHaveBeenCalledWith('Fetching all movies');
  });

  it('should get movie by ID', () => {
    const mockMovie: Movie = {
      id: 1,
      title: 'Test Movie',
      director: 'Test Director',
      releaseDate: '2023-01-01',
      genre: 'Action'
    };

    service.getMovieById(1).subscribe(movie => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`${environment.movieWorldApiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
    expect(loggerSpy.debug).toHaveBeenCalledWith('Fetching movie with ID: 1');
  });

  it('should get movie with reviews', () => {
    const mockMovie: Movie = {
      id: 1,
      title: 'Test Movie',
      director: 'Test Director',
      releaseDate: '2023-01-01',
      genre: 'Action',
      reviews: [
        {
          id: 1,
          movieId: 1,
          reviewerName: 'Reviewer',
          comment: 'Great movie!',
          rating: 5,
          createdAt: '2023-01-02'
        }
      ]
    };

    service.getMovieWithReviews(1).subscribe(movie => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`${environment.movieWorldApiUrl}/1/with-reviews`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
    expect(loggerSpy.debug).toHaveBeenCalledWith('Fetching movie with ID: 1 including reviews');
  });

  it('should create a movie', () => {
    const mockMovie: Movie = {
      title: 'New Movie',
      director: 'New Director',
      releaseDate: '2023-01-01',
      genre: 'Action'
    };

    const mockResponse: Movie = {
      id: 1,
      ...mockMovie
    };

    service.createMovie(mockMovie).subscribe(movie => {
      expect(movie).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.movieWorldApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockMovie);
    req.flush(mockResponse);
    expect(loggerSpy.debug).toHaveBeenCalled();
  });

  it('should update a movie', () => {
    const mockMovie: Movie = {
      id: 1,
      title: 'Updated Movie',
      director: 'Updated Director',
      releaseDate: '2023-01-01',
      genre: 'Action'
    };

    service.updateMovie(1, mockMovie).subscribe(movie => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`${environment.movieWorldApiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockMovie);
    req.flush(mockMovie);
    expect(loggerSpy.debug).toHaveBeenCalled();
  });

  it('should delete a movie', () => {
    service.deleteMovie(1).subscribe();

    const req = httpMock.expectOne(`${environment.movieWorldApiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(loggerSpy.debug).toHaveBeenCalledWith('Deleting movie with ID: 1');
  });
});
