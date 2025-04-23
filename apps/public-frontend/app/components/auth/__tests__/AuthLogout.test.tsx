import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/dashboard',
}));

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}));

// Test component that uses the auth context
function LogoutButton() {
  const { logout, user } = useAuth();
  return (
    <div>
      {user ? <div data-testid="user-email">{user.email}</div> : <div>Not logged in</div>}
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
}

describe('Auth Logout Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPush.mockClear();
    
    // Setup mock Supabase client
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });
    const mockGetSession = jest.fn().mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            user_metadata: {
              full_name: 'Test User',
            },
          },
        },
      },
    });
    
    const mockOnAuthStateChange = jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });
    
    (createClientComponentClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
        getSession: mockGetSession,
        onAuthStateChange: mockOnAuthStateChange,
      },
    });
  });

  it('should sign out the user and redirect to login page', async () => {
    // Render the component with AuthProvider
    render(
      <AuthProvider>
        <LogoutButton />
      </AuthProvider>
    );

    // Wait for the initial auth state to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    // Setup mock for signOut to be called during the test
    const mockSupabase = (createClientComponentClient as jest.Mock)();
    
    // Click the logout button
    const user = userEvent.setup();
    await act(async () => {
      await user.click(screen.getByTestId('logout-button'));
    });

    // Verify signOut was called
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    
    // Verify user is redirected to login page
    expect(mockPush).toHaveBeenCalledWith('/login');
    
    // Wait for the component to update after logout
    await waitFor(() => {
      expect(screen.queryByTestId('user-email')).not.toBeInTheDocument();
    });
  });

  it('should handle errors during logout', async () => {
    // Setup mock for signOut to return an error
    const mockError = new Error('Logout failed');
    const mockSupabase = (createClientComponentClient as jest.Mock)();
    mockSupabase.auth.signOut.mockResolvedValueOnce({ error: mockError });
    
    // Render the component with AuthProvider
    render(
      <AuthProvider>
        <LogoutButton />
      </AuthProvider>
    );

    // Wait for the initial auth state to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    // Click the logout button
    const user = userEvent.setup();
    await act(async () => {
      await user.click(screen.getByTestId('logout-button'));
    });

    // Verify signOut was called
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    
    // Verify user is NOT redirected to login page when there's an error
    expect(mockPush).not.toHaveBeenCalled();
    
    // User should still be shown as logged in
    expect(screen.getByTestId('user-email')).toBeInTheDocument();
  });
});
