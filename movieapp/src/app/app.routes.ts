import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { 
    path: 'movies', 
    loadComponent: () => import('./components/movie-list/movie-list.component').then(m => m.MovieListComponent) 
  },
  { 
    path: 'movies/:id', 
    loadComponent: () => import('./components/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) 
  },
  { 
    path: 'health', 
    loadComponent: () => import('./health/health.component').then(m => m.HealthComponent) 
  },
  { 
    path: '**', 
    redirectTo: 'movies' 
  }
];
