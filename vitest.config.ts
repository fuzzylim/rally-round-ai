import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/fixtures/**'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 10000, // Match the timeout in test-setup.ts
    setupFiles: ['./test-setup.ts'],
    globals: true, // Enable global test variables like describe, it, etc.
    environmentOptions: {
      jsdom: {
        resources: 'usable', // Better handling of resources
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json'],
      exclude: ['**/node_modules/**', '**/*.d.ts', '**/.next/**'],
    },
    pool: 'forks', // More reliable test isolation using separate processes
    poolOptions: {
      threads: {
        singleThread: true, // Avoid potential race conditions with auth tests
      },
      forks: {
        isolate: true, // Ensure test isolation
      },
    },
  },
  resolve: {
    alias: {
      '@rallyround/db': resolve(__dirname, './packages/db/src'),
      '@rallyround/ui': resolve(__dirname, './packages/ui'),
      '@rallyround/auth': resolve(__dirname, './packages/auth')
    },
  },
});
