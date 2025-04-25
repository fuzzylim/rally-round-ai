import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthProvider';
import { getCurrentUser, signInWithEmail, signOut } from '@rallyround/auth';

// Mock Next.js hooks that might be used by the AuthProvider
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => '/test'),
  useSearchParams: vi.fn(() => ({ get: vi.fn() })),
}));

// Mock the auth functions with proper typing
vi.mock('@rallyround/auth', () => ({
  getCurrentUser: vi.fn(),
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  signInWithSocial: vi.fn(),
  handleSocialAuthCallback: vi.fn(),
}));

// Cast mocked functions with proper types
const mockedGetCurrentUser = getCurrentUser as unknown as ReturnType<typeof vi.fn>;
const mockedSignInWithEmail = signInWithEmail as unknown as ReturnType<typeof vi.fn>;
const mockedSignOut = signOut as unknown as ReturnType<typeof vi.fn>;

// Test component that uses the auth context
function TestComponent() {
  const { user, loading, error, signIn } = useAuth();
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {user && <div>User: {user.email}</div>}
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', () => {
    // Configure the mock to return undefined initially (loading state)
    mockedGetCurrentUser.mockReturnValueOnce(new Promise(() => {})); // Pending promise
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should load user on mount', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockedGetCurrentUser.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });
    
    expect(mockedGetCurrentUser).toHaveBeenCalled();
  });

  it('should handle sign in', async () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockedSignInWithEmail.mockResolvedValue({ user: mockUser, error: null });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });

    expect(mockedSignInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle sign in error', async () => {
    const error = new Error('Invalid credentials');
    mockedSignInWithEmail.mockResolvedValue({ user: null, error });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText(`Error: ${error.message}`)).toBeInTheDocument();
    });
  });

  it('should handle sign out', async () => {
    // First render with a user
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockedGetCurrentUser.mockResolvedValue(mockUser);
    mockedSignOut.mockResolvedValue({ error: null });

    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });

    // Mock user being signed out
    mockedGetCurrentUser.mockResolvedValue(null);
    
    // Re-render to trigger the effect
    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for user to be removed from UI
    await waitFor(() => {
      expect(screen.queryByText(`User: ${mockUser.email}`)).not.toBeInTheDocument();
    });
  });
});
