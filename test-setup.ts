/**
 * Global test setup file for Vitest
 * Sets test environment variables and mocks
 */
import { expect, vi, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure Testing Library with shorter timeouts to prevent hanging tests
configure({
  asyncUtilTimeout: 1000, // Shorter timeout for async utilities
  eventWrapper: fn => {
    // Timeouts for event handlers to prevent hanging
    const timeoutId = setTimeout(() => {
      console.error('Event handler timeout - possible infinite loop detected');
    }, 2000);
    fn();
    clearTimeout(timeoutId);
  }
});

// Extend Vitest's expect with React Testing Library matchers
expect.extend(matchers);

// Set default timeout for all tests to prevent infinite loops
beforeAll(() => {
  vi.setConfig({ testTimeout: 10000 }); // 10 second timeout for all tests
});

// Automatically cleanup after each test with enhanced cleanup
afterEach(() => {
  cleanup();
  vi.clearAllTimers(); // Clear any pending timers
  vi.useRealTimers(); // Restore real timers to prevent timer-related issues
});

// Global cleanup after all tests
afterAll(() => {
  vi.restoreAllMocks();
});

// Mock global objects and browser APIs as needed
if (typeof window !== 'undefined') {
  // Setup browser environment vars/mocks if needed
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Configure environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-for-tests-only';

// Set up global mocks for commonly used packages
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation');
  
  // Create mock functions that we can reference and control elsewhere
  const pushMock = vi.fn();
  const replaceMock = vi.fn();
  
  return {
    ...actual,
    useRouter: vi.fn(() => ({ 
      push: pushMock,
      replace: replaceMock,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    })),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => ({
      get: vi.fn(param => null),  // Default to returning null for any param
      has: vi.fn(() => false),
      getAll: vi.fn(() => []),
      forEach: vi.fn(),
      entries: vi.fn(() => ({ next: vi.fn(() => ({ done: true })) })),
      keys: vi.fn(() => ({ next: vi.fn(() => ({ done: true })) })),
      values: vi.fn(() => ({ next: vi.fn(() => ({ done: true })) })),
      toString: vi.fn(() => '')
    })),
  };
});

// Mock Supabase auth helpers to prevent actual API calls
vi.mock('@supabase/auth-helpers-nextjs', () => {
  const mockUnsubscribe = vi.fn();
  return {
    createClientComponentClient: vi.fn(() => ({
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
        onAuthStateChange: vi.fn(() => ({ 
          data: { subscription: { unsubscribe: mockUnsubscribe } } 
        })),
      }
    })),
    createServerComponentClient: vi.fn(),
    createRouteHandlerClient: vi.fn(),
  };
});

// Mock next/headers to prevent errors in route handlers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    get: vi.fn(() => null),
    set: vi.fn(),
    delete: vi.fn(),
  })),
  headers: vi.fn(() => ({
    get: vi.fn(),
    has: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
  })),
}));
