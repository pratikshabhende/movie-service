import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NGXLogger } from 'ngx-logger';

// OpenTelemetry imports
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private initialized = false;
  private tracer: any;

  constructor(private logger: NGXLogger) {}

  /**
   * Initialize OpenTelemetry
   */
  init(): void {
    if (this.initialized) {
      return;
    }
    
    // Skip initialization if OpenTelemetry is disabled
    if (!environment.otelEnabled) {
      this.logger.debug('OpenTelemetry is disabled in this environment');
      this.initialized = true;
      return;
    }

    try {
      this.logger.debug('Initializing OpenTelemetry');

      const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'movieapp-frontend',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment.production ? 'production' : 'development'
      });

      const provider = new WebTracerProvider({ resource });
      
      // Configure OTLP exporter
      const exporter = new OTLPTraceExporter({
        url: environment.otelCollectorUrl
      });

      // Add span processor
      provider.addSpanProcessor(new BatchSpanProcessor(exporter));

      // Register provider
      provider.register({
        contextManager: new ZoneContextManager()
      });

      // Register auto-instrumentations
      registerInstrumentations({
        instrumentations: [
          new DocumentLoadInstrumentation(),
          new XMLHttpRequestInstrumentation({
            ignoreUrls: [/localhost:4318/], // Ignore telemetry collector itself
            propagateTraceHeaderCorsUrls: [
              new RegExp(`${environment.movieWorldApiUrl}.*`),
              new RegExp(`${environment.movieReviewApiUrl}.*`)
            ]
          }),
          new FetchInstrumentation({
            ignoreUrls: [/localhost:4318/], // Ignore telemetry collector itself
            propagateTraceHeaderCorsUrls: [
              new RegExp(`${environment.movieWorldApiUrl}.*`),
              new RegExp(`${environment.movieReviewApiUrl}.*`)
            ]
          })
        ]
      });

      // Get tracer
      this.tracer = trace.getTracer('movieapp-frontend');
      this.initialized = true;
      this.logger.info('OpenTelemetry initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize OpenTelemetry', error);
    }
  }

  /**
   * Start a new span
   * @param name Span name
   * @param attributes Span attributes
   * @returns Span context
   */
  startSpan(name: string, attributes: Record<string, any> = {}) {
    if (!this.initialized) {
      return null;
    }

    try {
      const span = this.tracer.startSpan(name, {
        kind: SpanKind.CLIENT,
        attributes
      });
      
      return trace.setSpan(context.active(), span);
    } catch (error) {
      this.logger.error('Error starting span', error);
      return null;
    }
  }

  /**
   * End a span
   * @param spanContext Span context
   * @param status Span status
   */
  endSpan(spanContext: any, status: 'success' | 'error' = 'success') {
    if (!this.initialized || !spanContext) {
      return;
    }

    try {
      const span = trace.getSpan(spanContext);
      if (span) {
        if (status === 'error') {
          span.setStatus({ code: SpanStatusCode.ERROR });
        } else {
          span.setStatus({ code: SpanStatusCode.OK });
        }
        span.end();
      }
    } catch (error) {
      this.logger.error('Error ending span', error);
    }
  }

  /**
   * Add an event to the current span
   * @param name Event name
   * @param attributes Event attributes
   */
  addEvent(name: string, attributes: Record<string, any> = {}) {
    if (!this.initialized) {
      return;
    }

    try {
      const span = trace.getSpan(context.active());
      if (span) {
        span.addEvent(name, attributes);
      }
    } catch (error) {
      this.logger.error('Error adding event to span', error);
    }
  }

  /**
   * Set attributes on the current span
   * @param attributes Attributes to set
   */
  setAttributes(attributes: Record<string, any>) {
    if (!this.initialized) {
      return;
    }

    try {
      const span = trace.getSpan(context.active());
      if (span) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
    } catch (error) {
      this.logger.error('Error setting span attributes', error);
    }
  }
}
