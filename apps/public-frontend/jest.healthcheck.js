/**
 * Minimal Jest configuration for healthcheck API tests
 */
module.exports = {
  // Use a minimal preset
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Transform TypeScript files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      isolatedModules: true 
    }]
  },
  
  // Mock imports that cause problems
  moduleNameMapper: {
    // Mock Next.js modules
    '^next/server$': '<rootDir>/__mocks__/next-server.js',
  },
  
  // Only run healthcheck tests
  testMatch: ['**/api/healthcheck/route.test.ts'],
  
  // Avoid colorization which pulls in problematic dependencies
  reporters: [
    ['default', { useStderr: true, colorize: false }]
  ],
  
  // Avoid collecting coverage
  collectCoverage: false,
  
  // Avoid transforming node_modules
  transformIgnorePatterns: [
    '/node_modules/'
  ],
};
