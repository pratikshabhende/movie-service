export const environment = {
  production: false,
  movieWorldApiUrl: 'http://localhost:9091/api/movieworld',
  movieReviewApiUrl: 'http://localhost:9093/api/moviereview',
  otelCollectorUrl: 'http://localhost:4318/v1/traces',
  logLevel: 'debug',
  otelEnabled: false // Disable OpenTelemetry in development mode
};
