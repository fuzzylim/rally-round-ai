# Authentication in RallyRound

RallyRound uses a secure, cookie-based authentication system built on Supabase Auth. This document explains the implementation details, security considerations, and best practices.

## Overview

The authentication system is implemented in the [`@rallyround/auth`](../packages/auth/README.md) package and provides:

- **Secure cookie-based session storage**
- **Social login providers** (Google, GitHub, etc.)
- **Email/password authentication**
- **Protected routes** via Next.js middleware
- **Server-side session validation**

## Architecture

![Authentication Flow](https://www.plantuml.com/plantuml/png/TP31QiCm38RlUGehkUIWmGEwXl-Xf8UXjuGQxwqFR5MPGfbz0wTzqU_Gw4C-7_VVXZ9cQZXfgXCXo47hqY24YJIKbpXM3BXc-jgVBNJuaPdICqCXgdAcgpQXCBGk5LJMuP9OGr3s53GVs9z4bvLgXWCOY_fbmxh-3B2e18MQ_4xEhGfvmx5FSDLvQrVS7oRqXeMDrz7LWzCOvmTFppudcv1dLPrwVsJbjTtHxQtVRKD90jz_qRRMdwXl)

### Client-Side Flow

1. User initiates login (social or email/password)
2. Supabase Auth handles authentication and returns tokens
3. Tokens are stored in HttpOnly cookies
4. `AuthProvider` provides authentication state to React components
5. Protected routes verified client-side by checking auth state

### Server-Side Flow

1. Next.js middleware runs on each request
2. `createMiddlewareClient` extracts cookies and validates session
3. If session is invalid for protected routes, redirects to login
4. Server components use `createServerClient` to access authenticated data

## Security Measures

Our authentication implementation incorporates several security best practices:

### 1. HttpOnly Cookies

We store authentication tokens in HttpOnly cookies which:
- Cannot be accessed by JavaScript
- Protects against XSS attacks
- Prevents token theft via client-side code

### 2. CSRF Protection

We implement CSRF protection via:
- SameSite=Strict cookie attribute
- Origin checking in critical routes
- Secure cookie configuration

### 3. PKCE Authentication Flow

The PKCE (Proof Key for Code Exchange) flow:
- Generates a code challenge and verifier
- Ensures possession of the verifier during token exchange
- Protects against authorization code interception

### 4. Session Management

Sessions are:
- Validated server-side
- Limited to 8 hours by default
- Refreshed automatically
- Invalidated securely on logout

## Implementation

### Environment Variables

Required environment variables for authentication:

```properties
# Required Supabase config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Security-enhanced cookie settings
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME=sb-your_project_ref-auth-token
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_LIFETIME=28800 # 8 hours in seconds
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SAME_SITE=strict
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SECURE=true
NEXT_PUBLIC_COOKIE_DOMAIN=yourdomain.com # For production
```

### Auth Provider Setup

The AuthProvider component should be included at the root of your application:

```tsx
// app/layout.tsx
import { AuthProvider } from '@rallyround/auth';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Middleware Configuration

Protect routes using Next.js middleware with improved 404 handling:

```tsx
// middleware.ts
import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Define known routes
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/callback',
  '/competitions'
];

const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/teams',
  '/fundraisers/create'
];

// Helper to check if a path matches any known route patterns
function isKnownRoute(path: string): boolean {
  // Check public routes
  if (PUBLIC_ROUTES.some(route => path === route || path.startsWith(`${route}/`))) {
    return true;
  }
  
  // Check protected routes
  if (PROTECTED_ROUTES.some(route => path === route || path.startsWith(`${route}/`))) {
    return true;
  }
  
  return false;
}

export async function middleware(request) {
  // Skip middleware for unknown routes to prevent infinite redirects on 404 pages
  const path = request.nextUrl.pathname;
  
  // Skip middleware for static files and API routes
  if (
    path.startsWith('/_next') || 
    path.startsWith('/api/') ||
    path.includes('.') ||
    !isKnownRoute(path)
  ) {
    return NextResponse.next();
  }
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { data: { session } } = await supabase.auth.getSession();
  
  // Handle protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  );
  
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Handle login/signup routes when already authenticated
  if (session && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Database Security

In addition to authentication, we implement Row Level Security (RLS) in Supabase to ensure data access control:

```sql
-- Example RLS policy
CREATE POLICY "Users can only view their own profiles"
ON "profiles"
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can only update their own profiles"
ON "profiles"
FOR UPDATE
USING (auth.uid() = id);
```

## Best Practices

1. **Never store sensitive data in JWT payload**
   - Keep JWTs small and focused on identity
   - Store sensitive permissions in the database

2. **Always validate sessions server-side**
   - Don't rely solely on client-side checks
   - Implement middleware protection

3. **Use proper error handling**
   - Don't leak sensitive details in error messages
   - Provide user-friendly authentication errors

4. **Implement rate limiting**
   - Protect authentication endpoints
   - Prevent brute force attacks

5. **Regularly audit authentication logs**
   - Monitor for suspicious activity
   - Track failed login attempts

## Testing Authentication

### Manual Testing

We use a comprehensive manual testing approach to verify authentication functionality:

```bash
pnpm -F public-frontend test:manual
```

This script checks:
- Middleware functionality for public and protected routes
- 404 page handling and prevention of infinite loops
- Healthcheck API responses
- Auth provider behavior

### Automated Testing

For automated testing of the authentication flow:

1. Create test users in Supabase
2. Configure test social providers if needed
3. Test login, signup, and logout flows
4. Verify protected routes are properly secured
5. Confirm token rotation works correctly

> Note: Due to ESM compatibility issues with Jest and certain dependencies, some automated tests may require special configuration. See the `TESTING.md` file in the public-frontend app for more details.

## 404 Handling and Route Protection

Our authentication system includes special handling for 404 pages to prevent infinite redirect loops:

1. **Server-Side 404 Component**
   - A custom `not-found.tsx` page provides a consistent user experience
   - Implemented as a Server Component following Next.js 15 best practices

2. **Route Detection in Middleware**
   - Middleware checks if a route is known before applying auth logic
   - Unknown routes bypass authentication checks entirely
   - Prevents redirect loops on non-existent pages

3. **AuthProvider Improvements**
   - Client-side AuthProvider checks if routes are known
   - Avoids unnecessary session refreshes on 404 pages
   - Uses client-side navigation for error handling

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Return Home
      </a>
    </div>
  );
}
```

## Troubleshooting

Common issues and solutions:

1. **Cookies not being set**
   - Check secure/same-site settings
   - Ensure domain configuration is correct

2. **Auth callback errors**
   - Verify redirect URLs are properly configured
   - Check for code exchange errors

3. **Session not persisting**
   - Confirm cookie settings
   - Check middleware implementation

4. **CORS issues with authentication**
   - Configure Supabase CORS settings
   - Check API endpoint configurations

5. **Infinite redirect loops on 404 pages**
   - Ensure middleware properly detects unknown routes
   - Verify the not-found.tsx component is correctly implemented
   - Check that AuthProvider isn't refreshing sessions on unknown routes

## References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [OWASP Authentication Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
