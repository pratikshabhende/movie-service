import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Log environment configuration in development mode
if (!environment.production) {
  console.log('Initializing application in development mode');
  console.log('API URLs:', {
    movieWorld: environment.movieWorldApiUrl,
    movieReview: environment.movieReviewApiUrl,
    otelCollector: environment.otelCollectorUrl
  });
}

// Bootstrap the application
bootstrapApplication(AppComponent, appConfig)
  .catch((error: Error) => console.error('Application bootstrap failed:', error));
