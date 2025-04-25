import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

const logPrefix = '[Auth] '

// Enhanced logging with request ID for tracing
const log = (message: string, data?: any) => {
  console.log(`${logPrefix} %s`, message, data || '');
};

// Routes that definitely exist and need authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/teams',
  '/teams/create',
  '/fundraisers/create'
];

// Public routes that should not redirect to login
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/callback',
  '/competitions'
];

// System routes that should always be bypassed
const SYSTEM_ROUTES = [
  '/_next',
  '/api',
  '/favicon.ico'
];

/**
 * Auth middleware for RallyRound
 * 
 * This implementation focuses on preventing infinite loops on 404 pages
 * by only applying middleware logic to known routes.
 */
export async function middleware(request: NextRequest) {
  // Generate a request ID for tracing
  const requestId = Math.random().toString(36).substring(2, 10);
  const pathname = request.nextUrl.pathname;
  
  log(`[${requestId}] Processing: ${pathname}`);
  
  // STEP 1: Check if this is a system route that should be bypassed
  if (
    pathname.match(/\.(\w+)$/) || // Files with extensions
    SYSTEM_ROUTES.some(route => pathname.startsWith(route))
  ) {
    log(`[${requestId}] Bypassing system path: ${pathname}`);
    return NextResponse.next();
  }
  
  // STEP 2: Check if this is a route we know about
  const isKnownRoute = [...PROTECTED_ROUTES, ...PUBLIC_ROUTES].some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If it's not a known route, just pass through without any auth logic
  // This prevents infinite loops on 404 pages
  if (!isKnownRoute) {
    log(`[${requestId}] Unknown route, bypassing auth: ${pathname}`);
    return NextResponse.next();
  }
  
  // STEP 3: Special handling for auth callback
  if (pathname.startsWith('/auth/callback')) {
    log(`[${requestId}] Auth callback, proceeding: ${pathname}`);
    return NextResponse.next();
  }
  
  // STEP 4: For known routes, check authentication
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();
  
  log(`[${requestId}] Session state:`, { 
    path: pathname,
    hasSession: !!session,
    user: session?.user?.email
  });
  
  // STEP 5: Handle protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute && !session) {
    log(`[${requestId}] Protected route without session, redirecting to login: ${pathname}`);
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // STEP 6: Handle login page with active session
  if (pathname === '/login' && session) {
    log(`[${requestId}] User already logged in, redirecting from login`);
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/dashboard';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }
  
  // For all other known routes, just pass through
  log(`[${requestId}] Allowing request to proceed: ${pathname}`);
  return res;
}

/**
 * Matcher configuration
 * 
 * This explicitly lists only the routes we want the middleware to run on.
 * The middleware itself will further filter to only apply auth logic to known routes.
 */
export const config = {
  matcher: [
    // Match all routes except for static files and _next
    '/((?!_next/|.*\\.).*)',
    // Exclude API routes
    '/((?!api/).*)'
  ]
}
