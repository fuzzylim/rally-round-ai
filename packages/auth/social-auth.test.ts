import { signInWithSocial, handleSocialAuthCallback } from './social-auth';
import { createClientSupabaseClient } from './index';

// Mock the supabase client
jest.mock('./index', () => ({
  createClientSupabaseClient: jest.fn(),
}));

describe('Social Auth Functions', () => {
  const mockSupabaseClient = {
    auth: {
      signInWithOAuth: jest.fn(),
      getSession: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClientSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient);
    
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://rallyround.app',
      },
      writable: true,
    });
  });

  describe('signInWithSocial', () => {
    it('should call signInWithOAuth with the correct provider and options', async () => {
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://auth.provider.com/authorize' },
        error: null,
      });

      const result = await signInWithSocial('google');

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'https://rallyround.app/auth/callback',
          scopes: 'profile email',
        },
      });

      expect(result).toEqual({
        url: 'https://auth.provider.com/authorize',
        error: null,
      });
    });

    it('should handle custom redirect URL', async () => {
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://auth.provider.com/authorize' },
        error: null,
      });

      await signInWithSocial('github', 'https://custom-redirect.com');

      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'https://custom-redirect.com',
          scopes: undefined,
        },
      });
    });

    it('should handle errors from Supabase', async () => {
      const mockError = new Error('Auth provider error');
      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: mockError,
      });

      const result = await signInWithSocial('google');

      expect(result).toEqual({
        url: null,
        error: mockError,
      });
    });

    it('should catch and handle exceptions', async () => {
      const mockError = new Error('Network error');
      mockSupabaseClient.auth.signInWithOAuth.mockRejectedValue(mockError);

      const result = await signInWithSocial('google');

      expect(result).toEqual({
        url: null,
        error: mockError,
      });
    });
  });

  describe('handleSocialAuthCallback', () => {
    it('should handle successful auth callback with existing profile', async () => {
      // Mock session data
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user123',
              email: 'user@example.com',
              user_metadata: {
                full_name: 'Test User',
                avatar_url: 'https://example.com/avatar.jpg',
              },
            },
          },
        },
        error: null,
      });

      // Mock profile data
      mockSupabaseClient.single.mockResolvedValue({
        data: {
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg',
        },
        error: null,
      });

      const result = await handleSocialAuthCallback();

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('name, avatar_url');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'user123');
      expect(mockSupabaseClient.single).toHaveBeenCalled();

      expect(result).toEqual({
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        error: null,
      });
    });

    it('should create a profile if one does not exist', async () => {
      // Mock session data
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user123',
              email: 'user@example.com',
              user_metadata: {
                full_name: 'Test User',
                avatar_url: 'https://example.com/avatar.jpg',
              },
            },
          },
        },
        error: null,
      });

      // Mock profile not found
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: null,
      });

      // Mock insert
      mockSupabaseClient.insert.mockResolvedValue({
        data: {},
        error: null,
      });

      const result = await handleSocialAuthCallback();

      expect(mockSupabaseClient.insert).toHaveBeenCalledWith({
        id: 'user123',
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        updated_at: expect.any(String),
      });

      expect(result).toEqual({
        user: {
          id: 'user123',
          email: 'user@example.com',
          name: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
        },
        error: null,
      });
    });

    it('should handle errors from getSession', async () => {
      const mockError = new Error('Session error');
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: mockError,
      });

      const result = await handleSocialAuthCallback();

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });

    it('should handle no session found', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const result = await handleSocialAuthCallback();

      expect(result.user).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('No session found');
    });

    it('should catch and handle exceptions', async () => {
      const mockError = new Error('Network error');
      mockSupabaseClient.auth.getSession.mockRejectedValue(mockError);

      const result = await handleSocialAuthCallback();

      expect(result).toEqual({
        user: null,
        error: mockError,
      });
    });
  });
});
