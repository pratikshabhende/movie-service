// Mock for OpenTelemetry modules
module.exports = {
  trace: {
    getTracer: jest.fn().mockReturnValue({
      startSpan: jest.fn().mockReturnValue({
        end: jest.fn(),
        setAttribute: jest.fn(),
        setAttributes: jest.fn(),
        recordException: jest.fn(),
        updateName: jest.fn()
      }),
      startActiveSpan: jest.fn().mockImplementation((name, options, fn) => {
        const span = { end: jest.fn(), setAttribute: jest.fn(), setAttributes: jest.fn(), recordException: jest.fn(), updateName: jest.fn() };
        return fn(span);
      })
    }),
    setSpan: jest.fn(),
    getSpan: jest.fn(),
    getActiveSpan: jest.fn(),
    SpanStatusCode: { ERROR: 'ERROR', OK: 'OK' }
  },
  context: { active: jest.fn(), with: jest.fn().mockImplementation((context, fn) => fn()) },
  propagation: { inject: jest.fn(), extract: jest.fn() },
  ROOT_CONTEXT: {}
};
