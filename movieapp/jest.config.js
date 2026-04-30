module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^environments/(.*)$': '<rootDir>/src/environments/$1',
    '^@opentelemetry/(.*)$': '<rootDir>/src/app/__mocks__/opentelemetry.js'
  },
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/environments/**',
    '!src/app/testing/**'
  ],
  coverageReporters: [
    'html',
    'text-summary',
    'json-summary',
    'lcov'
  ],
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 60,
      lines: 70,
      statements: 70
    }
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml'
    }]
  ],
  testMatch: [
    '**/*.spec.ts'
  ],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': 'jest-preset-angular'
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '<rootDir>']
};
