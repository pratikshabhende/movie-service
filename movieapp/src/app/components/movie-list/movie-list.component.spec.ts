import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { MovieListComponent } from './movie-list.component';

// Import actual services for typing, but we'll mock them
import { MovieService } from '../../services/movie.service';
import { TelemetryService } from '../../services/telemetry.service';
import { NGXLogger } from 'ngx-logger';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let mockMovieService: { getAllMovies: jest.Mock };
  let mockTelemetryService: { startSpan: jest.Mock; setAttributes: jest.Mock; endSpan: jest.Mock };
  let mockLogger: { info: jest.Mock; error: jest.Mock };
  
  // Mock span object for telemetry
  const mockSpan = {};

  const mockMovies: Movie[] = [
    { id: 1, title: 'Test Movie 1', director: 'Director 1', genre: 'Action', releaseDate: '2023-01-01', description: 'Description 1' },
    { id: 2, title: 'Test Movie 2', director: 'Director 2', genre: 'Comedy', releaseDate: '2023-02-01', description: 'Description 2' }
  ];

  beforeEach(() => {
    // Create mock services
    mockMovieService = { getAllMovies: jest.fn() };
    mockTelemetryService = { 
      startSpan: jest.fn().mockReturnValue(mockSpan),
      setAttributes: jest.fn(),
      endSpan: jest.fn() 
    };
    mockLogger = { info: jest.fn(), error: jest.fn() };
    
    // Configure TestBed with mocks
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MovieListComponent
      ],
      providers: [
        { provide: MovieService, useValue: mockMovieService },
        { provide: TelemetryService, useValue: mockTelemetryService },
        { provide: NGXLogger, useValue: mockLogger }
      ]
    });

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    mockMovieService.getAllMovies.mockReturnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load movies on init', () => {
    mockMovieService.getAllMovies.mockReturnValue(of(mockMovies));
    fixture.detectChanges();
    expect(component.movies).toEqual(mockMovies);
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeFalsy();
  });

  it('should handle error when loading movies fails', () => {
    const errorResponse = new Error('Failed to fetch');
    mockMovieService.getAllMovies.mockReturnValue(throwError(() => errorResponse));
    fixture.detectChanges();
    expect(component.loading).toBeFalsy();
    expect(component.error).toBeTruthy();
  });

  it('should retry loading movies', () => {
    mockMovieService.getAllMovies.mockReturnValue(of(mockMovies));
    component.loadMovies();
    expect(mockMovieService.getAllMovies).toHaveBeenCalled();
    expect(component.loading).toBeFalsy();
    expect(component.movies).toEqual(mockMovies);
  });
  
  it('should use telemetry service when loading movies', () => {
    mockMovieService.getAllMovies.mockReturnValue(of(mockMovies));
    component.loadMovies();
    expect(mockTelemetryService.startSpan).toHaveBeenCalledWith('load_movies');
  });
});
