import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 20000
  },
  resolve: {
    alias: {
      '@rallyround/db': resolve(__dirname, './packages/db/src'),
      '@rallyround/ui': resolve(__dirname, './packages/ui')
    },
  },
});
