import { routes } from './app.routes';

describe('App Routes', () => {
  it('should define routes', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBe(5);
  });

  it('should have a default route redirecting to movies', () => {
    const defaultRoute = routes.find(route => route.path === '');
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute?.redirectTo).toBe('movies');
    expect(defaultRoute?.pathMatch).toBe('full');
  });

  it('should have a movies route', () => {
    const moviesRoute = routes.find(route => route.path === 'movies');
    expect(moviesRoute).toBeDefined();
    expect(typeof moviesRoute?.loadComponent).toBe('function');
  });

  it('should have a movie detail route', () => {
    const movieDetailRoute = routes.find(route => route.path === 'movies/:id');
    expect(movieDetailRoute).toBeDefined();
    expect(typeof movieDetailRoute?.loadComponent).toBe('function');
  });

  it('should have a health route', () => {
    const healthRoute = routes.find(route => route.path === 'health');
    expect(healthRoute).toBeDefined();
    expect(typeof healthRoute?.loadComponent).toBe('function');
  });

  it('should have a wildcard route redirecting to movies', () => {
    const wildcardRoute = routes.find(route => route.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('movies');
  });

  // Test the lazy-loaded components (this will improve function coverage)
  it('should load the movie list component', async () => {
    const moviesRoute = routes.find(route => route.path === 'movies');
    if (moviesRoute?.loadComponent) {
      const component = await moviesRoute.loadComponent();
      expect(component).toBeDefined();
    }
  });

  it('should load the movie detail component', async () => {
    const movieDetailRoute = routes.find(route => route.path === 'movies/:id');
    if (movieDetailRoute?.loadComponent) {
      const component = await movieDetailRoute.loadComponent();
      expect(component).toBeDefined();
    }
  });

  it('should load the health component', async () => {
    const healthRoute = routes.find(route => route.path === 'health');
    if (healthRoute?.loadComponent) {
      const component = await healthRoute.loadComponent();
      expect(component).toBeDefined();
    }
  });
});
