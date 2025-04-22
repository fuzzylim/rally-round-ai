import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { getCurrentUser, signInWithEmail, signUpWithEmail, signOut, signInWithSocial, handleSocialAuthCallback } from '@rallyround/auth';

// Mock the auth functions
jest.mock('@rallyround/auth', () => ({
  getCurrentUser: jest.fn(),
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  signOut: jest.fn(),
  signInWithSocial: jest.fn(),
  handleSocialAuthCallback: jest.fn(),
}));

// Define a mock user for testing
const mockUser = { id: '123', name: 'Test User', email: 'test@example.com', avatarUrl: null };

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, error, signIn, signUp, signInWithProvider, handleAuthCallback, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-value">{user?.id || ''}</div>
      <div data-testid="loading-value">{loading.toString()}</div>
      <div data-testid="error-value">{error?.message || ''}</div>
      <div data-testid="signIn-value">{typeof signIn}</div>
      <div data-testid="signUp-value">{typeof signUp}</div>
      <div data-testid="signInWithProvider-value">{typeof signInWithProvider}</div>
      <div data-testid="handleAuthCallback-value">{typeof handleAuthCallback}</div>
      <div data-testid="logout-value">{typeof logout}</div>
    </div>
  );
};

// Test components
const SignInComponent = () => {
  const { signIn } = useAuth();
  return <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>;
};

const SignUpComponent = () => {
  const { signUp } = useAuth();
  return <button onClick={() => signUp('test@example.com', 'password', 'Test User')}>Sign Up</button>;
};

const LogoutComponent = () => {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
};

const SocialLoginComponent = () => {
  const { signInWithProvider } = useAuth();
  return <button onClick={() => signInWithProvider('google')}>Login with Google</button>;
};

const AuthCallbackComponent = () => {
  const { handleAuthCallback } = useAuth();
  return <button onClick={handleAuthCallback}>Handle Callback</button>;
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (getCurrentUser as jest.Mock).mockResolvedValue({ user: null, error: null });
    (signInWithEmail as jest.Mock).mockResolvedValue({ user: null, error: null });
    (signUpWithEmail as jest.Mock).mockResolvedValue({ user: null, error: null });
    (signOut as jest.Mock).mockResolvedValue({ error: null });
    (signInWithSocial as jest.Mock).mockResolvedValue({ url: null, error: null });
    (handleSocialAuthCallback as jest.Mock).mockResolvedValue({ user: null, error: null });
  });
  
  it.skip('provides auth context values', async () => {
    // Mock getCurrentUser to return the mock user
    (getCurrentUser as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        user: mockUser,
        error: null
      });
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the useEffect to complete and user to be loaded
    await waitFor(() => {
      expect(screen.getByTestId('loading-value')).toHaveTextContent('false');
    });
    
    // Now check all the values
    expect(screen.getByTestId('user-value')).toHaveTextContent(mockUser.id);
    expect(screen.getByTestId('error-value')).toHaveTextContent('');
    expect(screen.getByTestId('signIn-value')).toHaveTextContent('function');
    expect(screen.getByTestId('signUp-value')).toHaveTextContent('function');
    expect(screen.getByTestId('signInWithProvider-value')).toHaveTextContent('function');
    expect(screen.getByTestId('handleAuthCallback-value')).toHaveTextContent('function');
    expect(screen.getByTestId('logout-value')).toHaveTextContent('function');
  });
  
  it('should show loading state initially', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading-value')).toHaveTextContent('true');
    
    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-value')).toHaveTextContent('false');
    });
  });
  
  it.skip('should load user on initial render', async () => {
    // Mock getCurrentUser to return the mock user
    (getCurrentUser as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        user: mockUser,
        error: null
      });
    });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // First wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-value')).toHaveTextContent('false');
    });
    
    // Then check that the user was loaded
    expect(screen.getByTestId('user-value')).toHaveTextContent(mockUser.id);
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });
  
  it('handles sign in', async () => {
    (signInWithEmail as jest.Mock).mockResolvedValue({
      user: mockUser,
      error: null
    });
    
    render(
      <AuthProvider>
        <SignInComponent />
      </AuthProvider>
    );
    
    // Click sign in button
    fireEvent.click(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });
  
  it('handles sign up', async () => {
    (signUpWithEmail as jest.Mock).mockResolvedValue({
      user: mockUser,
      error: null
    });
    
    render(
      <AuthProvider>
        <SignUpComponent />
      </AuthProvider>
    );
    
    // Click sign up button
    fireEvent.click(screen.getByText('Sign Up'));
    
    await waitFor(() => {
      expect(signUpWithEmail).toHaveBeenCalledWith('test@example.com', 'password', 'Test User');
    });
  });
  
  it('handles logout', async () => {
    (signOut as jest.Mock).mockResolvedValue({ error: null });
    (getCurrentUser as jest.Mock).mockResolvedValue({
      user: mockUser,
      error: null
    });
    
    render(
      <AuthProvider>
        <LogoutComponent />
      </AuthProvider>
    );
    
    // Wait for the user to be loaded
    await waitFor(() => {
      expect(getCurrentUser).toHaveBeenCalled();
    });
    
    // Click the logout button
    fireEvent.click(screen.getByText('Logout'));
    
    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
  
  it('handles social login', async () => {
    // Mock window.location for redirect
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
      writable: true
    });
    
    (signInWithSocial as jest.Mock).mockResolvedValue({ 
      url: 'https://auth.provider.com/authorize', 
      error: null 
    });
    
    render(
      <AuthProvider>
        <SocialLoginComponent />
      </AuthProvider>
    );
    
    // Click the social login button
    fireEvent.click(screen.getByText('Login with Google'));
    
    await waitFor(() => {
      expect(signInWithSocial).toHaveBeenCalledWith('google');
      expect(window.location.href).toBe('https://auth.provider.com/authorize');
    });
    
    // Restore window.location
    window.location = originalLocation;
  });
  
  it('handles auth callback', async () => {
    (handleSocialAuthCallback as jest.Mock).mockResolvedValue({
      user: mockUser,
      error: null
    });
    
    render(
      <AuthProvider>
        <AuthCallbackComponent />
      </AuthProvider>
    );
    
    // Click the handle callback button
    fireEvent.click(screen.getByText('Handle Callback'));
    
    await waitFor(() => {
      expect(handleSocialAuthCallback).toHaveBeenCalled();
    });
  });
  
  it('handles sign in errors', async () => {
    const mockError = new Error('Invalid credentials');
    (signInWithEmail as jest.Mock).mockResolvedValue({ 
      user: null, 
      error: mockError 
    });
    
    render(
      <AuthProvider>
        <SignInComponent />
      </AuthProvider>
    );
    
    // Click sign in button
    fireEvent.click(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });
});
