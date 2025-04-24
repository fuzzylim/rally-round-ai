# 🔒 Authentication Security

> This document outlines security considerations and implementations for RallyRound's authentication flows.

## Security Vulnerabilities Fixed

### 🛡️ Client-Side URL Redirect Vulnerability (April 2025)

**Issue**: The authentication callback page was vulnerable to an open redirect attack, which could allow attackers to redirect users to malicious websites after authentication.

**CVE Reference**: N/A (Internal finding #3)

**Fix Implementation**:
- Added URL validation to prevent redirects to untrusted domains
- Implemented a trusted domain allowlist approach
- Created fallback to safe paths when untrusted URLs are detected
- Added detailed logging for security audit purposes

**Code Location**: `/apps/public-frontend/app/auth/callback/page.tsx`

**Implementation Details**:
```typescript
// Validation logic for redirect URLs
const trustedDomains = [
  'rallyround.club',
  'app.rallyround.club',
  'api.rallyround.club',
  'localhost',
  '127.0.0.1',
  'vercel.app'
];

// Only allow redirects to trusted domains or relative paths
if (url.startsWith('/') || trustedDomains.some(domain => urlObj.hostname.endsWith(domain))) {
  // URL is safe
} else {
  // URL is not trusted, redirect to safe default
}
```

## Best Practices

### Redirect Handling
- Always validate redirect URLs before performing client-side redirects
- Use relative URLs within the application when possible
- Maintain a trusted domain allowlist for external redirects
- Log suspicious redirect attempts for security monitoring

### Cookie Security
- All authentication cookies use `HttpOnly` and `Secure` flags
- Implement proper CSRF protection for authentication operations
- Use SameSite cookie attributes to prevent cross-site request attacks

## Implementation References
- [OWASP - Unvalidated Redirects and Forwards](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/04-Testing_for_Client-side_URL_Redirect)
- [Supabase Auth Best Practices](https://supabase.com/docs/guides/auth/auth-helpers)
