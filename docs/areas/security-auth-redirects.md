# 🔒 Authentication Redirect Security

> This document outlines security considerations and implementations for handling redirects in RallyRound's authentication flows.

## Security Vulnerabilities Fixed

### 🛡️ Client-side URL Redirect Vulnerability (April 2025)

**Issue**: The authentication callback page was vulnerable to an open redirect attack, which could allow attackers to redirect users to malicious websites after authentication by manipulating the `redirect` URL parameter.

**GitHub Alert Reference**: Code scanning alert no. 11

**Vulnerability Details**:
- Previous implementation only checked if the URL had the same origin, which could be bypassed
- Attack vector: `https://rallyround.club/auth/callback?redirect=https://malicious-site.com`

**Fix Implementation**:
- Implemented a strict whitelist approach for allowed redirect paths
- Created a constant `ALLOWED_REDIRECT_PATHS` containing only trusted paths
- All redirect targets are validated against this whitelist
- Any redirect target not in the whitelist defaults to '/dashboard'

**Code Location**: `/apps/public-frontend/app/auth/callback/page.tsx`

**Implementation Details**:
```typescript
// Whitelist of allowed redirect paths
const ALLOWED_REDIRECT_PATHS = ['/dashboard', '/profile', '/settings'];

// Validate redirect URL against whitelist
function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    // Allow only paths in the whitelist
    return ALLOWED_REDIRECT_PATHS.includes(parsedUrl.pathname);
  } catch {
    return false; // Invalid URLs are not safe
  }
}

// Usage in the authentication flow
const redirectTo = params.get('redirect') || '/dashboard';
const safeRedirectTo = ALLOWED_REDIRECT_PATHS.includes(redirectTo) ? redirectTo : '/dashboard';
```

## Best Practices for Secure Redirects

### Whitelist Approach
- Always use a whitelist for allowed redirect destinations
- Keep the whitelist as small as possible, limited to pages users should land on after authentication
- For dynamic paths (like `/teams/:id`), use path pattern validation with regex

### URL Validation
- Always parse URLs before redirecting to verify their structure
- Never trust user-provided URLs or paths without validation
- Use default safe destinations when validation fails
- Log suspicious redirect attempts for security monitoring

### Implementation Checklist
- [ ] Restrict redirects to a small set of known, safe paths
- [ ] Add unit tests to verify redirect security
- [ ] Include new paths in the whitelist when adding features that need post-auth redirects
- [ ] Periodically audit the whitelist to remove unused paths

## References
- [OWASP - Unvalidated Redirects and Forwards](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/04-Testing_for_Client-side_URL_Redirect)
- [CWE-601: URL Redirection to Untrusted Site](https://cwe.mitre.org/data/definitions/601.html)
