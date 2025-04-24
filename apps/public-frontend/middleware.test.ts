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
const mockCreateClient = jest.fn();
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    auth: {
      getSession: mockGetSession,
    },
  })),
}));

// Silence console logs during tests
console.log = jest.fn();

// Import the middleware after mocks are set up
import { middleware } from './middleware';

// Create a mock NextRequest for testing with cookie support
function makeRequest(path: string, search: string = '', authToken: string | null = null) {
  // Create a proper cookies implementation for our security tests
  const cookiesMap = new Map<string, { name: string, value: string }>();
  
  // Add auth token cookie if provided
  if (authToken) {
    cookiesMap.set('sb-auth-token', {
      name: 'sb-auth-token',
      value: authToken
    });
  }
  
  // Mock the NextRequest with all required properties
  return {
    nextUrl: {
      pathname: path,
      searchParams: new URLSearchParams(search),
      origin: 'http://localhost',
    },
    url: `http://localhost${path}${search ? `?${search}` : ''}`,
    headers: new Headers(),
    cookies: {
      get: (name: string) => cookiesMap.get(name) || null,
      getAll: () => Array.from(cookiesMap.values()),
      has: (name: string) => cookiesMap.has(name),
      delete: jest.fn(),
      clear: jest.fn(),
      toString: jest.fn(),
      [Symbol.iterator]: function* () {
        yield* cookiesMap.values();
      }
    },
    clone: () => ({}),
    // Add other properties required by NextRequest
    ip: '127.0.0.1',
    geo: { country: 'US' },
    ua: { isBot: false },
    method: 'GET',
    credentials: 'same-origin',
    cache: 'default',
    redirect: 'follow',
    bodyUsed: false,
    referrer: '',
    referrerPolicy: '',
    integrity: '',
    keepalive: false,
    isHistoryNavigation: false,
    mode: 'cors',
    destination: '',
    body: null,
    signal: { aborted: false } as any,
    formData: jest.fn(),
    json: jest.fn(),
    text: jest.fn(),
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    page: { name: 'test' } as any,
    [Symbol.toStringTag]: 'NextRequest'
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
