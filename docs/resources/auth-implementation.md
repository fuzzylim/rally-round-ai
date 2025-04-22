# Supabase Authentication Implementation

This document outlines the authentication implementation for the RallyRound platform using Supabase Auth.

## Overview

RallyRound uses Supabase for authentication, with a React context provider that makes auth functionality available throughout the application. The implementation follows best practices for Next.js applications, including:

- Server-side authentication checks
- Client-side auth state management
- Typed interfaces for auth data
- Comprehensive test coverage

## Architecture

### Auth Package

The `@rallyround/auth` package provides core authentication functionality:

```typescript
// Key exports from @rallyround/auth
export function createSupabaseClient(): SupabaseClient;
export async function getCurrentUser(): Promise<AuthUser | null>;
export async function signInWithEmail(email: string, password: string): Promise<AuthResult>;
export async function signUpWithEmail(email: string, password: string, name: string): Promise<AuthResult>;
export async function signOut(): Promise<{ error: Error | null }>;
export async function getSession();
```

### Auth Provider

The `AuthProvider` component wraps the application and provides authentication context:

```tsx
// Usage in _app.tsx or layout.tsx
<AuthProvider>
  <App />
</AuthProvider>
```

### Auth Hook

The `useAuth` hook provides access to authentication state and methods:

```tsx
const { user, loading, error, signIn, signUp, logout } = useAuth();
```

## Data Flow

1. **Initial Load**:
   - `AuthProvider` calls `getCurrentUser()` to check for an existing session
   - If a session exists, user data is loaded and stored in context

2. **Sign In**:
   - User submits credentials via a form
   - Form calls `signIn(email, password)` from the auth hook
   - Auth hook calls `signInWithEmail` from the auth package
   - On success, user data is stored in context

3. **Sign Up**:
   - Similar to sign in, but calls `signUp(email, password, name)`
   - Creates both an auth entry and a profile record

4. **Sign Out**:
   - Calls `logout()` from the auth hook
   - Clears the session and user data from context

## Testing

Authentication components and functions are tested using Jest and React Testing Library:

- Unit tests for auth package functions
- Component tests for AuthProvider
- Integration tests for auth flows

## Security Considerations

- Passwords are never stored in the application
- Authentication tokens are handled by Supabase
- Profile data is stored in a separate table with RLS policies
- Session cookies are HTTP-only

## Environment Configuration

Required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Future Improvements

- Add social login providers (Google, GitHub)
- Implement passwordless authentication
- Add multi-factor authentication
- Enhance role-based access control
