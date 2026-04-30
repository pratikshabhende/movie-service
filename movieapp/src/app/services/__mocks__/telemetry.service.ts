import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  startSpan(name: string): any {
    return {};
  }

  setAttributes(attributes: Record<string, any>): void {}

  addSpanEvent(name: string, attributes?: Record<string, any>): void {}

  endSpan(span: any, status?: 'success' | 'error'): void {}

  setSpanError(span: any, error: Error): void {}
}
