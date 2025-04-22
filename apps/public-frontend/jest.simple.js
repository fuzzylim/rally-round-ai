/**
 * Simplified Jest configuration to avoid ESM issues
 */
module.exports = {
  // Use a minimal preset without problematic dependencies
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Transform TypeScript files
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { 
      useESM: true,
      isolatedModules: true 
    }]
  },
  
  // Treat these extensions as ESM
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  // Mock imports that cause problems
  moduleNameMapper: {
    // Mock problematic modules
    '^next/server$': '<rootDir>/__mocks__/next-server.js',
  },
  
  // Only run middleware tests
  testMatch: ['**/middleware.test.ts'],
  
  // Avoid colorization which pulls in problematic dependencies
  reporters: [
    ['default', { useStderr: true, colorize: false }]
  ],
  
  // Avoid collecting coverage which can trigger problematic dependencies
  collectCoverage: false,
  
  // Avoid transforming node_modules
  transformIgnorePatterns: [
    '/node_modules/'
  ],
};
