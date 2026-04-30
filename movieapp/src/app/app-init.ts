import { TelemetryService } from './services/telemetry.service';

/**
 * Initialize application services
 * @param telemetryService Telemetry service
 */
export function initializeApp(telemetryService: TelemetryService): () => Promise<void> {
  return () => {
    return new Promise<void>((resolve) => {
      try {
        // Initialize OpenTelemetry
        telemetryService.init();
      } catch (error) {
        console.error('Error initializing telemetry:', error);
        // We still resolve the promise to not block app initialization
      }
      resolve();
    });
  };
}
