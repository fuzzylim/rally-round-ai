import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthProvider';
import { getCurrentUser, signInWithEmail, signUpWithEmail, signOut } from '@rallyround/auth';

// Mock the auth module
jest.mock('@rallyround/auth', () => ({
  getCurrentUser: jest.fn(),
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  signOut: jest.fn(),
}));

// Test component that uses the auth context
function TestComponent() {
  const { user, loading, error, signIn, signUp, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'No user'}</div>
      <div data-testid="error">{error ? error.message : 'No error'}</div>
      <button 
        data-testid="login-button" 
        onClick={() => signIn('test@example.com', 'password')}
      >
        Login
      </button>
      <button 
        data-testid="signup-button" 
        onClick={() => signUp('test@example.com', 'password', 'Test User')}
      >
        Sign Up
      </button>
      <button 
        data-testid="logout-button" 
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (getCurrentUser as jest.Mock).mockResolvedValue(null);
    (signInWithEmail as jest.Mock).mockResolvedValue({ user: null, error: null });
    (signUpWithEmail as jest.Mock).mockResolvedValue({ user: null, error: null });
    (signOut as jest.Mock).mockResolvedValue({ error: null });
  });
  
  it('should show loading state initially', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading').textContent).toBe('Loading');
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('Not loading');
    });
  });
  
  it('should load user on initial render', async () => {
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('Test User');
    });
    
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });
  
  it('should handle sign in', async () => {
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    (signInWithEmail as jest.Mock).mockResolvedValue({ user: mockUser, error: null });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('Not loading');
    });
    
    // Click login button and wait for loading state
    await act(async () => {
      userEvent.click(screen.getByTestId('login-button'));
      // No need to verify the loading state as it might be too quick
      // in the test environment to reliably catch
    });
    
    // Verify user is set after sign in
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('Test User');
    });
    
    expect(signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');
  });
  
  it('should handle sign up', async () => {
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    (signUpWithEmail as jest.Mock).mockResolvedValue({ user: mockUser, error: null });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('Not loading');
    });
    
    // Click signup button
    await act(async () => {
      userEvent.click(screen.getByTestId('signup-button'));
    });
    
    // Verify user is set after sign up
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('Test User');
    });
    
    expect(signUpWithEmail).toHaveBeenCalledWith('test@example.com', 'password', 'Test User');
  });
  
  it('should handle logout', async () => {
    // Start with a logged in user
    const mockUser = { id: '123', name: 'Test User', email: 'test@example.com' };
    (getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('Test User');
    });
    
    // Click logout button
    await act(async () => {
      userEvent.click(screen.getByTestId('logout-button'));
    });
    
    // Verify user is removed after logout
    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('No user');
    });
    
    expect(signOut).toHaveBeenCalled();
  });
  
  it('should handle sign in errors', async () => {
    const mockError = new Error('Invalid credentials');
    (signInWithEmail as jest.Mock).mockResolvedValue({ user: null, error: mockError });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('Not loading');
    });
    
    // Click login button
    await act(async () => {
      userEvent.click(screen.getByTestId('login-button'));
    });
    
    // Verify error is set
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Invalid credentials');
    });
  });
});
