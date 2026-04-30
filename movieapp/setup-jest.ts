import 'jest-preset-angular/setup-jest';

// Add global types for TextEncoder
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      TextEncoder: any;
    }
  }
}

// Mock TextEncoder if not available
class MockTextEncoder {
  encode(input?: string): Uint8Array {
    const encoded = [];
    const str = input || '';
    for (let i = 0; i < str.length; i++) {
      encoded.push(str.charCodeAt(i));
    }
    return new Uint8Array(encoded);
  }
}

// Use Node's TextEncoder if available, otherwise use mock
const TextEncoder = globalThis.TextEncoder || MockTextEncoder;

// Fix for TextEncoder not available in jsdom
global.TextEncoder = TextEncoder;

// Mock OpenTelemetry API
jest.mock('@opentelemetry/api', () => ({
  trace: {
    getTracer: jest.fn().mockReturnValue({
      startSpan: jest.fn().mockReturnValue({
        end: jest.fn(),
        setAttribute: jest.fn(),
        setAttributes: jest.fn(),
        recordException: jest.fn(),
        updateName: jest.fn()
      }),
      startActiveSpan: jest.fn().mockImplementation((name: string, options: any, fn: (span: any) => any) => {
        const span = {
          end: jest.fn(),
          setAttribute: jest.fn(),
          setAttributes: jest.fn(),
          recordException: jest.fn(),
          updateName: jest.fn()
        };
        return fn(span);
      })
    }),
    setSpan: jest.fn(),
    getSpan: jest.fn(),
    getActiveSpan: jest.fn(),
    SpanStatusCode: {
      ERROR: 'ERROR',
      OK: 'OK'
    }
  },
  context: {
    active: jest.fn(),
    with: jest.fn().mockImplementation((context: any, fn: () => any) => fn()),
  },
  propagation: {
    inject: jest.fn(),
    extract: jest.fn()
  },
  ROOT_CONTEXT: {}
}));

// Global mocks for OpenTelemetry
const mockTracer = {
  startSpan: jest.fn().mockReturnValue({
    end: jest.fn(),
    setAttribute: jest.fn(),
    setAttributes: jest.fn(),
    recordException: jest.fn(),
    updateName: jest.fn()
  }),
  startActiveSpan: jest.fn().mockImplementation((name: string, options: any, fn: (span: any) => any) => {
    const span = {
      end: jest.fn(),
      setAttribute: jest.fn(),
      setAttributes: jest.fn(),
      recordException: jest.fn(),
      updateName: jest.fn()
    };
    return fn(span);
  })
};

const mockOpenTelemetry = {
  trace: {
    getTracer: jest.fn().mockReturnValue(mockTracer)
  },
  context: {
    active: jest.fn(),
    with: jest.fn().mockImplementation((context: any, fn: () => any) => fn()),
  },
  propagation: {
    inject: jest.fn(),
    extract: jest.fn()
  }
};

// Mock OpenTelemetry API
jest.mock('@opentelemetry/api', () => ({
  trace: {
    getTracer: jest.fn().mockReturnValue(mockTracer),
    setSpan: jest.fn(),
    getSpan: jest.fn(),
    getActiveSpan: jest.fn(),
    SpanStatusCode: {
      ERROR: 'ERROR',
      OK: 'OK'
    }
  },
  context: mockOpenTelemetry.context,
  propagation: mockOpenTelemetry.propagation,
  ROOT_CONTEXT: {}
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
