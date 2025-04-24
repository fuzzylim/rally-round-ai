/**
 * Security-specific tests for middleware
 * 
 * These tests focus on the security fixes implemented for alert #4,
 * specifically the secure Supabase client creation and auth token handling.
 */

import { jest } from '@jest/globals';

// Mock necessary environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

// Mock the NextResponse
const mockRedirect = jest.fn();
const mockNext = jest.fn();

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: URL) => {
      mockRedirect(url.toString());
      return { status: 307, headers: new Map([['location', url.toString()]]) };
    },
    next: () => {
      mockNext();
      return { status: 200, headers: new Map() };
    },
  },
}));

// Mock the Supabase client
const mockGetSession = jest.fn();
const mockCreateClient = jest.fn().mockImplementation(() => ({
  auth: {
    getSession: mockGetSession,
  },
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

// Silence console logs during tests
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Import the middleware after mocks are set up
import { middleware } from './middleware';

// Create a mock NextRequest with auth token for security testing
function makeSecurityRequest(path: string, withAuthToken = false) {
  // Create cookie container
  const cookiesMap = new Map();
  
  if (withAuthToken) {
    cookiesMap.set('sb-auth-token', {
      name: 'sb-auth-token',
      value: 'test-auth-token'
    });
  }
  
  // Return mock request - we'll use type assertion since this is test code
  return {
    nextUrl: {
      pathname: path,
      searchParams: new URLSearchParams(),
      origin: 'http://localhost',
    },
    url: `http://localhost${path}`,
    headers: new Headers(),
    cookies: {
      get: (name: string) => cookiesMap.get(name) || null,
      getAll: () => Array.from(cookiesMap.values()),
      has: (name: string) => cookiesMap.has(name),
    },
    ip: '127.0.0.1',
  } as any; // Type assertion for test simplicity
}

describe('middleware security', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedirect.mockClear();
    mockNext.mockClear();
    mockCreateClient.mockClear();
    mockGetSession.mockClear();
  });

  it('creates a secure Supabase client with proper configuration', async () => {
    // Setup auth session response
    mockGetSession.mockResolvedValue({ data: { session: { user: { email: 'test@example.com' } } } });
    
    // Call middleware with a protected route
    await middleware(makeSecurityRequest('/dashboard'));
    
    // Verify createClient was called with correct parameters
    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-key',
      expect.objectContaining({
        auth: expect.objectContaining({
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        })
      })
    );
  });
  
  it('passes auth token from cookies to Supabase client', async () => {
    // Setup auth session response
    mockGetSession.mockResolvedValue({ data: { session: { user: { email: 'test@example.com' } } } });
    
    // Call middleware with auth token in cookies
    await middleware(makeSecurityRequest('/dashboard', true));
    
    // Verify token was extracted from cookies and passed in headers
    expect(mockCreateClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        global: expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-auth-token'
          })
        })
      })
    );
  });
  
  it('handles missing auth token gracefully', async () => {
    // Setup auth session response
    mockGetSession.mockResolvedValue({ data: { session: null } });
    
    // Call middleware without auth token
    await middleware(makeSecurityRequest('/dashboard', false));
    
    // Verify empty Authorization header is sent
    expect(mockCreateClient).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({
        global: expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: ''
          })
        })
      })
    );
    
    // Verify redirect to login occurs
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });
  
  it('redirects to error page if Supabase configuration is missing', async () => {
    // Temporarily remove env variables to test error handling
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    try {
      await middleware(makeSecurityRequest('/dashboard'));
      expect(mockRedirect).toHaveBeenCalledWith('/error');
    } finally {
      // Restore env variable
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    }
  });
});
