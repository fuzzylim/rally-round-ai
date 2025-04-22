/**
 * Simplified middleware test to avoid ESM issues
 * 
 * This test focuses on the core functionality of the middleware
 * without getting caught in ESM-related dependency issues.
 */

// Mock the NextResponse and NextRequest
const mockRedirect = jest.fn();
const mockNext = jest.fn();

// Mock the next/server module
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url) => {
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
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createMiddlewareClient: jest.fn().mockImplementation(() => ({
    auth: {
      getSession: mockGetSession,
    },
  })),
}));

// Silence console logs during tests
console.log = jest.fn();

// Import the middleware after mocks are set up
import { middleware } from './middleware';

// Create a simplified mock request for testing
function makeRequest(path: string, search: string = '') {
  return {
    nextUrl: {
      pathname: path,
      searchParams: new URLSearchParams(search),
    },
    url: `http://localhost${path}${search}`,
    headers: new Headers(),
    clone: () => ({}),
  };
}

describe('middleware auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRedirect.mockClear();
    mockNext.mockClear();
  })

  it('allows public route without session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    await middleware(makeRequest('/'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  })
  
  it('allows unknown routes without session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    await middleware(makeRequest('/unknown-route'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  })

  it('redirects to login on protected route with no session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    await middleware(makeRequest('/dashboard'));
    expect(mockRedirect).toHaveBeenCalledWith('/login');
    expect(mockNext).not.toHaveBeenCalled();
  })

  it('allows protected route when session exists', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { email: 'u@u.com' } } } });
    await middleware(makeRequest('/dashboard'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  })

  it('redirects from login to dashboard when session exists', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { email: 'u@u.com' } } } });
    await middleware(makeRequest('/login'));
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
    expect(mockNext).not.toHaveBeenCalled();
  })

  it('respects redirect query param on login', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { email: 'u@u.com' } } } });
    await middleware(makeRequest('/login', '?redirect=/teams'));
    expect(mockRedirect).toHaveBeenCalledWith('/teams');
    expect(mockNext).not.toHaveBeenCalled();
  })

  it('allows competitions (public) without session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    await middleware(makeRequest('/competitions'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  })

  it('redirects to login for /teams without session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    await middleware(makeRequest('/teams'));
    expect(mockRedirect).toHaveBeenCalledWith('/login');
    expect(mockNext).not.toHaveBeenCalled();
  })

  it('allows /teams with session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { email: 'u@u.com' } } } });
    await middleware(makeRequest('/teams'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  })

  it('redirects to login for /fundraisers/create without session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    await middleware(makeRequest('/fundraisers/create'));
    expect(mockRedirect).toHaveBeenCalledWith('/login');
    expect(mockNext).not.toHaveBeenCalled();
  })

  it('allows /fundraisers/create with session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { email: 'u@u.com' } } } });
    await middleware(makeRequest('/fundraisers/create'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  })

  it('allows auth callback always', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    await middleware(makeRequest('/auth/callback'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  })
  
  it('bypasses static files', async () => {
    await middleware(makeRequest('/test.css'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockGetSession).not.toHaveBeenCalled();
  })
  
  it('bypasses _next paths', async () => {
    await middleware(makeRequest('/_next/static/file.js'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockGetSession).not.toHaveBeenCalled();
  })
  
  it('bypasses api routes', async () => {
    await middleware(makeRequest('/api/test'));
    expect(mockNext).toHaveBeenCalled();
    expect(mockGetSession).not.toHaveBeenCalled();
  })
})
