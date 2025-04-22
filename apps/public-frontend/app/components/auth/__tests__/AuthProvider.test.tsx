import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthProvider';
import { getCurrentUser, signInWithEmail, signOut } from '@rallyround/auth';

// Mock the auth functions
vi.mock('@rallyround/auth', () => ({
  getCurrentUser: vi.fn(),
  signInWithEmail: vi.fn(),
  signOut: vi.fn(),
  signInWithSocial: vi.fn(),
  handleSocialAuthCallback: vi.fn(),
}));

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
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should load user on mount', async () => {
    const mockUser = { email: 'test@example.com' };
    getCurrentUser.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });
  });

  it('should handle sign in', async () => {
    const mockUser = { email: 'test@example.com' };
    signInWithEmail.mockResolvedValue({ user: mockUser, error: null });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });

    expect(signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle sign in error', async () => {
    const error = new Error('Invalid credentials');
    signInWithEmail.mockResolvedValue({ user: null, error });

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
    const mockUser = { email: 'test@example.com' };
    getCurrentUser.mockResolvedValue(mockUser);
    signOut.mockResolvedValue({ error: null });

    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument();
    });

    // Mock user being signed out
    getCurrentUser.mockResolvedValue(null);
    
    // Re-render to trigger the effect
    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText(`User: ${mockUser.email}`)).not.toBeInTheDocument();
    });
  });
});
