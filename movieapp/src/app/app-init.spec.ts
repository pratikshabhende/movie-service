import { TestBed } from '@angular/core/testing';
import { initializeApp } from './app-init';
import { TelemetryService } from './services/telemetry.service';

describe('App Initialization', () => {
  // Create a mock that matches the TelemetryService interface
  let telemetryServiceSpy: TelemetryService;

  beforeEach(() => {
    // Create a complete mock of TelemetryService
    const spy = {
      init: jest.fn().mockImplementation(() => {}),
      initialized: false,
      tracer: {},
      logger: {},
      startSpan: jest.fn(),
      endSpan: jest.fn(),
      setAttributes: jest.fn(),
      addEvent: jest.fn()
    } as unknown as TelemetryService;
    
    TestBed.configureTestingModule({
      providers: [
        { provide: TelemetryService, useValue: spy }
      ]
    });
    
    telemetryServiceSpy = TestBed.inject(TelemetryService);
  });

  it('should initialize telemetry service', async () => {
    const initFn = initializeApp(telemetryServiceSpy);
    
    await initFn();
    
    expect(telemetryServiceSpy.init).toHaveBeenCalled();
  });

  it('should handle errors during initialization', async () => {
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock implementation that throws an error
    jest.spyOn(telemetryServiceSpy, 'init').mockImplementation(() => {
      throw new Error('Test error');
    });
    
    const initFn = initializeApp(telemetryServiceSpy);
    
    // The function should not throw an error, but we can't use resolves.not.toThrow()
    // because the error is caught inside the function
    await initFn();
    
    expect(telemetryServiceSpy.init).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error initializing telemetry:', expect.any(Error));
    
    // Restore the original console.error
    consoleErrorSpy.mockRestore();
  });
  
  it('should resolve the promise even if telemetry initialization fails', async () => {
    // Mock implementation that throws an error
    jest.spyOn(telemetryServiceSpy, 'init').mockImplementation(() => {
      throw new Error('Test error');
    });
    
    const initFn = initializeApp(telemetryServiceSpy);
    
    // The promise should resolve without errors
    await expect(initFn()).resolves.not.toThrow();
  });
});
