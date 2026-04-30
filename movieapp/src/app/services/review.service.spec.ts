import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { NGXLogger } from 'ngx-logger';
import { environment } from '../../environments/environment';
import { Review } from '../models/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
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
        ReviewService,
        { provide: NGXLogger, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
    loggerSpy = TestBed.inject(NGXLogger) as any;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all reviews', () => {
    const mockReviews: Review[] = [
      {
        id: 1,
        movieId: 1,
        reviewerName: 'Test Reviewer',
        comment: 'Great movie!',
        rating: 5,
        createdAt: '2023-01-01'
      }
    ];

    service.getAllReviews().subscribe(reviews => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(environment.movieReviewApiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
    expect(loggerSpy.debug).toHaveBeenCalledWith('Fetching all reviews');
  });

  it('should get review by ID', () => {
    const mockReview: Review = {
      id: 1,
      movieId: 1,
      reviewerName: 'Test Reviewer',
      comment: 'Great movie!',
      rating: 5,
      createdAt: '2023-01-01'
    };

    service.getReviewById(1).subscribe(review => {
      expect(review).toEqual(mockReview);
    });

    const req = httpMock.expectOne(`${environment.movieReviewApiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReview);
    expect(loggerSpy.debug).toHaveBeenCalledWith('Fetching review with ID: 1');
  });

  it('should get reviews by movie ID', () => {
    const mockReviews: Review[] = [
      {
        id: 1,
        movieId: 1,
        reviewerName: 'Test Reviewer',
        comment: 'Great movie!',
        rating: 5,
        createdAt: '2023-01-01'
      }
    ];

    service.getReviewsByMovieId(1).subscribe(reviews => {
      expect(reviews).toEqual(mockReviews);
    });

    const req = httpMock.expectOne(`${environment.movieReviewApiUrl}/movie/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReviews);
    expect(loggerSpy.debug).toHaveBeenCalledWith('Fetching reviews for movie with ID: 1');
  });

  it('should create a review', () => {
    const mockReview: Review = {
      movieId: 1,
      reviewerName: 'New Reviewer',
      comment: 'Awesome movie!',
      rating: 5
    };

    const mockResponse: Review = {
      id: 1,
      createdAt: '2023-01-01',
      ...mockReview
    };

    service.createReview(mockReview).subscribe(review => {
      expect(review).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.movieReviewApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockReview);
    req.flush(mockResponse);
    expect(loggerSpy.debug).toHaveBeenCalled();
  });

  it('should update a review', () => {
    const mockReview: Review = {
      id: 1,
      movieId: 1,
      reviewerName: 'Updated Reviewer',
      comment: 'Updated comment',
      rating: 4,
      createdAt: '2023-01-01'
    };

    service.updateReview(1, mockReview).subscribe(review => {
      expect(review).toEqual(mockReview);
    });

    const req = httpMock.expectOne(`${environment.movieReviewApiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockReview);
    req.flush(mockReview);
    expect(loggerSpy.debug).toHaveBeenCalled();
  });

  it('should delete a review', () => {
    service.deleteReview(1).subscribe();

    const req = httpMock.expectOne(`${environment.movieReviewApiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(loggerSpy.debug).toHaveBeenCalledWith('Deleting review with ID: 1');
  });
});
