import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../environments/environment';
import { telemetryInterceptor } from './interceptors/telemetry.interceptor';
import { TelemetryService } from './services/telemetry.service';
import { initializeApp } from './app-init';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([telemetryInterceptor])),
    provideAnimations(),
    importProvidersFrom(
      LoggerModule.forRoot({
        serverLoggingUrl: '/api/logs',
        level: environment.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.DEBUG,
        serverLogLevel: NgxLoggerLevel.ERROR,
        disableConsoleLogging: environment.production
      })
    ),
    TelemetryService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TelemetryService],
      multi: true
    }
  ]
};
