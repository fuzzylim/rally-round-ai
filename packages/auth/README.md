# @rallyround/auth Package

The `@rallyround/auth` package provides a secure authentication system for RallyRound applications using Supabase Auth with enhanced security features.

## Key Features

- **HttpOnly Cookie Authentication** - Securely stores tokens in HttpOnly cookies instead of localStorage
- **PKCE Flow Implementation** - Uses the more secure PKCE (Proof Key for Code Exchange) auth flow
- **Enhanced Cookie Security** - Implements SameSite=Strict and Secure flags for strong protection
- **Middleware Integration** - Works with Next.js middleware for server-side route protection
- **Social Authentication** - Supports multiple social providers (Google, GitHub, etc.)
- **Improved 404 Handling** - Prevents infinite redirect loops on non-existent routes

## Installation

The package is included in the RallyRound monorepo and can be installed via:

```bash
pnpm add @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
```

## Setup

### Environment Variables

Ensure the following environment variables are set in your `.env.local` file:

```properties
# Required Supabase config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Security-enhanced cookie settings
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_NAME=sb-your_project_ref-auth-token
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_LIFETIME=28800 # 8 hours in seconds
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SAME_SITE=strict
NEXT_PUBLIC_SUPABASE_AUTH_COOKIE_SECURE=true
```

### Usage

#### Client-Side Authentication

Use the `AuthProvider` component to enable authentication in your Next.js app:

```tsx
// In app/layout.tsx or _app.tsx
import { AuthProvider } from '@rallyround/auth';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

Then access authentication functions and state in your components:

```tsx
import { useAuth } from '@rallyround/auth';

function LoginButton() {
  const { signInWithProvider, user } = useAuth();
  
  if (user) {
    return <p>Logged in as {user.email}</p>;
  }
  
  return (
    <button onClick={() => signInWithProvider('google')}>
      Sign in with Google
    </button>
  );
}
```

#### Server-Side Authentication

The package provides utilities for server-side authentication:

```tsx
// In middleware.ts
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
function isKnownRoute(path) {
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
```

For server components:

```tsx
// In a React Server Component
import { createServerClient } from '@rallyround/auth/supabase-singleton';
import { cookies } from 'next/headers';

export default async function ServerComponent() {
  const supabase = createServerClient(cookies());
  const { data } = await supabase.from('profiles').select('*');
  
  return <div>{/* Use data */}</div>;
}
```

### Auth Callback Page

A crucial part of the authentication system is the callback page that handles redirects from social providers:

```tsx
// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const handleCallback = async () => {
      // Extract the code from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (!code) return;
      
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);
      
      // Redirect to dashboard
      router.push('/dashboard');
    };
    
    handleCallback();
  }, [router, supabase]);
  
  return <div>Processing authentication...</div>;
}
```

## 404 Handling and Route Protection

This package includes special handling for 404 pages to prevent infinite redirect loops:

### Server-Side 404 Component

Use a custom `not-found.tsx` page to provide a consistent user experience:

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

### Route Detection in Middleware

The middleware checks if a route is known before applying auth logic:

1. Defines arrays of known public and protected routes
2. Uses the `isKnownRoute()` helper function to check paths
3. Bypasses authentication checks for unknown routes
4. Prevents redirect loops on non-existent pages

### AuthProvider Improvements

The AuthProvider component is designed to work with the 404 handling:

1. Checks if routes are known before refreshing sessions
2. Avoids unnecessary refreshes on 404 pages
3. Uses client-side navigation for error handling

## Security Best Practices

1. **Always Use HttpOnly Cookies**: Prevents client-side JavaScript from accessing tokens
2. **Implement SameSite Policy**: Use 'strict' to prevent CSRF attacks
3. **Set Secure Flag**: Ensures cookies are only sent over HTTPS
4. **Use PKCE Flow**: More secure than implicit flow
5. **Validate Session Server-Side**: Don't rely solely on client-side validation
6. **Handle 404 Pages Properly**: Prevent infinite redirect loops on non-existent routes

## API Reference

### Hooks

- `useAuth()` - Provides authentication state and methods

### Components

- `<AuthProvider>` - Context provider for authentication

### Utilities

- `createBrowserClient()` - Creates a Supabase client for browser usage
- `createServerClient(cookies)` - Creates a Supabase client for server components
- `createServerSupabase(cookieStore)` - Creates a Supabase client for middleware usage

## Security Technical Details

### Cookie Storage vs LocalStorage

This package uses HttpOnly cookies instead of localStorage for token storage. This provides several security benefits:

1. **XSS Protection**: HttpOnly cookies cannot be accessed by JavaScript, protecting against cross-site scripting attacks
2. **CSRF Protection**: SameSite=Strict setting prevents cross-site request forgery
3. **Better Session Management**: Cookies can be invalidated server-side

### PKCE Authentication Flow

The PKCE flow adds additional security by:

1. Generating a code verifier and challenge
2. Preventing authorization code interception attacks
3. Requiring proof of possession during token exchange
