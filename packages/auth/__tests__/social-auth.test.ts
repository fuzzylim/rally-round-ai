import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { signInWithSocial, handleSocialAuthCallback } from '../social-auth';

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key');

// Create mock functions
const mockSignInWithOAuth = vi.fn();
const mockGetSession = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      getSession: mockGetSession,
    },
    from: () => ({
      select: mockSelect,
      insert: mockInsert,
    }),
  }),
}));

describe('social-auth', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Set up chained mock functions for database queries
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ single: mockSingle });
  });

  describe('signInWithSocial', () => {
    it('should call signInWithOAuth with correct provider and options', async () => {
      const provider = 'google';

      // Set up the mock implementation
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth-provider.com/auth' },
        error: null,
      });

      const result = await signInWithSocial(provider);

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider,
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
          scopes: 'profile email',
        },
      });

      expect(result).toEqual({
        url: 'https://oauth-provider.com/auth',
        error: null,
      });
    });

    it('should handle errors from signInWithOAuth', async () => {
      const provider = 'google';
      const error = new Error('OAuth error');

      mockSignInWithOAuth.mockResolvedValue({
        data: null,
        error,
      });

      const result = await signInWithSocial(provider);

      expect(result).toEqual({
        url: null,
        error,
      });
    });
  });

  describe('handleSocialAuthCallback', () => {
    it('should handle successful auth callback with existing profile', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      };

      const mockProfile = {
        full_name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        email: 'test@example.com'
      };

      mockGetSession.mockResolvedValue({
        data: {
          session: { user: mockUser }
        },
        error: null,
      });

      mockSingle.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await handleSocialAuthCallback();

      expect(mockGetSession).toHaveBeenCalled();
      expect(mockSelect).toHaveBeenCalledWith('full_name, avatar_url, email');
      expect(mockEq).toHaveBeenCalledWith('id', mockUser.id);
      expect(mockInsert).not.toHaveBeenCalled();

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockProfile.email,
          name: mockProfile.full_name,
          avatarUrl: mockProfile.avatar_url,
        },
        error: null,
      });
    });

    it('should create profile if it does not exist', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      };

      mockGetSession.mockResolvedValue({
        data: {
          session: { user: mockUser }
        },
        error: null,
      });

      mockSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      mockInsert.mockResolvedValue({
        data: { id: mockUser.id },
        error: null,
      });

      const result = await handleSocialAuthCallback();

      expect(mockInsert).toHaveBeenCalledWith({
        id: mockUser.id,
        full_name: mockUser.user_metadata.full_name,
        email: mockUser.email,
        avatar_url: mockUser.user_metadata.avatar_url,
        updated_at: expect.any(String),
      });

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.user_metadata.full_name,
          avatarUrl: mockUser.user_metadata.avatar_url,
        },
        error: null,
      });
    });

    it('should handle errors during auth callback', async () => {
      const error = new Error('Session error');
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error,
      });

      const result = await handleSocialAuthCallback();

      expect(mockGetSession).toHaveBeenCalled();
      expect(mockSelect).not.toHaveBeenCalled();
      expect(mockInsert).not.toHaveBeenCalled();

      expect(result).toEqual({
        user: null,
        error,
      });
    });

    it('should handle missing session', async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await handleSocialAuthCallback();

      expect(mockGetSession).toHaveBeenCalled();
      expect(mockSelect).not.toHaveBeenCalled();
      expect(mockInsert).not.toHaveBeenCalled();

      expect(result).toEqual({
        user: null,
        error: new Error('No session found'),
      });
    });
  });
});
