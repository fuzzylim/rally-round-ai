/**
 * Middleware tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextResponse, NextRequest } from 'next/server';

// Set up mocks before imports
vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server');
  const mockNext = vi.fn().mockReturnValue({ status: 200 });
  const mockRedirect = vi.fn().mockImplementation((url) => ({ status: 307, url }));
  
  return {
    ...actual,
    NextResponse: {
      next: mockNext,
      redirect: mockRedirect
    }
  };
});

// Mock Supabase client
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createMiddlewareClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn()
    },
  })),
}));

// Import middleware and mocked dependencies after setup
import { middleware } from './middleware';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Utility to create a mock request
function createMockRequest(path: string, searchParams = ''): NextRequest {
  const url = `http://localhost${path}${searchParams}`;
  return {
    nextUrl: {
      pathname: path,
      searchParams: new URLSearchParams(searchParams),
      href: url,
    },
    url,
    headers: new Headers(),
    cookies: {
      get: vi.fn(),
      getAll: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      has: vi.fn(),
      clear: vi.fn(),
    },
    clone: vi.fn(),
  } as unknown as NextRequest;
}

describe('Middleware', () => {
  // Create mock references
  const mockAuth = { getSession: vi.fn() };
  const mockClient = { auth: mockAuth };
  const mockNext = NextResponse.next as unknown as ReturnType<typeof vi.fn>;
  const mockRedirect = NextResponse.redirect as unknown as ReturnType<typeof vi.fn>;
  const mockCreateMiddlewareClient = createMiddlewareClient as unknown as ReturnType<typeof vi.fn>;
  
  // Mock for NextResponse.next() response that is returned by middleware
  const mockNextResponse = { status: 200 };
  
  beforeEach(() => {
    // Clear all mocks but maintain their implementation
    vi.clearAllMocks();
    
    // Set up consistent return values for each test
    mockCreateMiddlewareClient.mockReturnValue(mockClient);
    mockNext.mockReturnValue(mockNextResponse);
    mockRedirect.mockImplementation((url) => ({ status: 307, url }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('public routes', () => {
    it('allows access to home page without session', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ data: { session: null } });
      const req = createMockRequest('/');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
    
    it('allows access to unknown routes without session', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ data: { session: null } });
      const req = createMockRequest('/unknown-route');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
    
    it('allows access to competitions page without session', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ data: { session: null } });
      const req = createMockRequest('/competitions');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
    
    it('allows access to auth callback always', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ data: { session: null } });
      const req = createMockRequest('/auth/callback');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });
  
  describe('protected routes', () => {
    it('redirects to login on protected dashboard route with no session', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ data: { session: null } });
      const req = createMockRequest('/dashboard');
      
      // Act
      await middleware(req);
      
      // Assert
      // In the middleware, when redirecting, we don't use the result of NextResponse.next()
      expect(mockRedirect).toHaveBeenCalled();
      
      // Check that we're redirecting to the correct path
      const redirectUrl = mockRedirect.mock.calls[0][0];
      expect(redirectUrl).toHaveProperty('pathname', '/login');
    });
    
    it('allows protected dashboard route when session exists', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: { user: { email: 'user@example.com' } } } 
      });
      const req = createMockRequest('/dashboard');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });
  
  describe('auth redirects', () => {
    it('redirects from login to dashboard when session exists', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: { user: { email: 'user@example.com' } } } 
      });
      const req = createMockRequest('/login');
      
      // Act
      await middleware(req);
      
      // Assert
      // In the middleware, when redirecting, we don't use the result of NextResponse.next()
      expect(mockRedirect).toHaveBeenCalled();
      
      // Check that we're redirecting to the correct path
      const redirectUrl = mockRedirect.mock.calls[0][0];
      expect(redirectUrl).toHaveProperty('pathname', '/dashboard');
    });
    
    it('respects redirect query param on login', async () => {
      // Arrange
      mockAuth.getSession.mockResolvedValue({ 
        data: { session: { user: { email: 'user@example.com' } } } 
      });
      const req = createMockRequest('/login', '?redirect=/teams');
      
      // Act
      await middleware(req);
      
      // Assert
      // In the middleware, when redirecting, we don't use the result of NextResponse.next()
      expect(mockRedirect).toHaveBeenCalled();
      
      // Check that we're redirecting to the correct path
      const redirectUrl = mockRedirect.mock.calls[0][0];
      expect(redirectUrl).toHaveProperty('pathname', '/teams');
    });
  });
  
  describe('static assets and API routes', () => {
    it('bypasses static files', async () => {
      // Arrange
      const req = createMockRequest('/test.css');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockAuth.getSession).not.toHaveBeenCalled();
    });
    
    it('bypasses _next paths', async () => {
      // Arrange
      const req = createMockRequest('/_next/static/file.js');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockAuth.getSession).not.toHaveBeenCalled();
    });
    
    it('bypasses api routes', async () => {
      // Arrange
      const req = createMockRequest('/api/test');
      
      // Act
      await middleware(req);
      
      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockAuth.getSession).not.toHaveBeenCalled();
    });
  });
});
