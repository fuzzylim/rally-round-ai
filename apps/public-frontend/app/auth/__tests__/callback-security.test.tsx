/**
 * Tests for the URL redirect security fix in the auth callback page
 * 
 * These tests specifically focus on the URL validation to prevent
 * open redirect vulnerabilities (GitHub security alert #3)
 */

import { safeRedirect } from '../callback/page';

// Mock window.location for testing redirects
Object.defineProperty(window, 'location', {
  value: { href: '' },
  writable: true,
});

// Mock console for cleaner test output
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();

// Mock setTimeout to run immediately in tests
jest.useFakeTimers();

describe('safeRedirect security', () => {
  beforeEach(() => {
    window.location.href = '';
    jest.clearAllMocks();
  });

  describe('Relative URL validation', () => {
    it('allows relative URLs starting with /', () => {
      safeRedirect('/dashboard');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('allows deeper relative paths', () => {
      safeRedirect('/teams/123/members');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/teams/123/members');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('allows relative URLs with query parameters', () => {
      safeRedirect('/dashboard?tab=overview&view=compact');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard?tab=overview&view=compact');
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Trusted domain validation', () => {
    it('allows URLs from main domain', () => {
      safeRedirect('https://rallyround.club/dashboard');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('https://rallyround.club/dashboard');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('allows URLs from subdomains', () => {
      safeRedirect('https://app.rallyround.club/profile');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('https://app.rallyround.club/profile');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('allows URLs from localhost', () => {
      safeRedirect('http://localhost:3000/dashboard');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('http://localhost:3000/dashboard');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('allows URLs from vercel.app', () => {
      safeRedirect('https://rally-round-ai.vercel.app/teams');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('https://rally-round-ai.vercel.app/teams');
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  describe('Malicious URL rejection', () => {
    it('rejects untrusted domains and redirects to /dashboard', () => {
      safeRedirect('https://malicious-site.com/fake-login');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
      expect(console.warn).toHaveBeenCalled();
    });

    it('rejects data: URLs', () => {
      safeRedirect('data:text/html,<script>alert("XSS")</script>');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
      expect(console.warn).toHaveBeenCalled();
    });

    it('rejects javascript: URLs', () => {
      safeRedirect('javascript:alert("XSS")');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
      expect(console.warn).toHaveBeenCalled();
    });

    it('rejects lookalike domains', () => {
      safeRedirect('https://rallyroundclub.com/dashboard');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
      expect(console.warn).toHaveBeenCalled();
    });

    it('rejects domains that end with trusted domains', () => {
      safeRedirect('https://evil-rallyround.club.attacker.com/phishing');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('handles invalid URLs', () => {
      safeRedirect('not-a-valid-url');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
      expect(console.error).toHaveBeenCalled();
    });

    it('handles empty URLs', () => {
      safeRedirect('');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
    });

    it('handles URLs with no protocol', () => {
      safeRedirect('rallyround.club/dashboard');
      jest.advanceTimersByTime(1000);
      expect(window.location.href).toBe('/dashboard');
    });
  });
});
