import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { TelemetryService } from '../services/telemetry.service';
import { NGXLogger } from 'ngx-logger';

/**
 * Interceptor to add telemetry to HTTP requests
 */
export const telemetryInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const telemetryService = inject(TelemetryService);
  const logger = inject(NGXLogger);
  
  // Generate a unique request ID
  const requestId = generateUUID();
  
  // Add trace headers to the request
  const modifiedReq = req.clone({
    setHeaders: {
      'X-Request-ID': requestId,
      'X-Correlation-ID': requestId
    }
  });

  // Start a span for this HTTP request
  const spanContext = telemetryService.startSpan('http_request', {
    'http.method': req.method,
    'http.url': req.url,
    'http.request_id': requestId
  });

  const startTime = Date.now();
  
  logger.debug(`HTTP Request: ${req.method} ${req.url}`, { requestId });

  return next(modifiedReq).pipe(
    tap((event: HttpEvent<unknown>) => {
      if (event instanceof HttpResponse) {
        const duration = Date.now() - startTime;
        
        // Add response attributes to the span
        telemetryService.setAttributes({
          'http.status_code': event.status,
          'http.duration_ms': duration
        });
        
        // End the span with success status
        telemetryService.endSpan(spanContext, 'success');
        
        logger.debug(`HTTP Response: ${req.method} ${req.url} - ${event.status} (${duration}ms)`, { 
          requestId, 
          status: event.status, 
          duration 
        });
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const duration = Date.now() - startTime;
      
      // Add error attributes to the span
      telemetryService.setAttributes({
        'http.status_code': error.status,
        'http.duration_ms': duration,
        'error.type': error.name,
        'error.message': error.message
      });
      
      // End the span with error status
      telemetryService.endSpan(spanContext, 'error');
      
      logger.error(`HTTP Error: ${req.method} ${req.url} - ${error.status} (${duration}ms)`, { 
        requestId, 
        status: error.status, 
        error: error.message, 
        duration 
      });
      
      return throwError(() => error);
    })
  );
};

/**
 * Generate a UUID v4
 * @returns UUID string
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
