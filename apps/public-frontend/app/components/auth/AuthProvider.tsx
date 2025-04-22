'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Provider } from '@supabase/supabase-js';
import { 
  getCurrentUser, 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  signInWithSocial,
  handleSocialAuthCallback,
  AuthUser 
} from '@rallyround/auth';

// Define the shape of our auth context
type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  handleAuthCallback: () => Promise<void>;
  logout: () => Promise<void>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signUp: async () => {},
  signInWithProvider: async () => {},
  handleAuthCallback: async () => {},
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the application
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user, error } = await signInWithEmail(email, password);
      
      if (error) {
        setError(error);
        return;
      }
      
      setUser(user);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user, error } = await signUpWithEmail(email, password, name);
      
      if (error) {
        setError(error);
        return;
      }
      
      setUser(user);
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signOut();
      
      if (error) {
        setError(error);
        return;
      }
      
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with a social provider (Google, GitHub, etc.)
  const signInWithProvider = async (provider: Provider) => {
    try {
      setLoading(true);
      setError(null);
      const { url, error } = await signInWithSocial(provider);
      
      if (error) {
        setError(error);
        return;
      }
      
      // Redirect to the provider's login page
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Social sign in error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the auth callback after social login
  const handleAuthCallback = async () => {
    try {
      setLoading(true);
      setError(null);
      const { user, error } = await handleSocialAuthCallback();
      
      if (error) {
        setError(error);
        return;
      }
      
      setUser(user);
    } catch (err) {
      console.error('Auth callback error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Create the auth value object
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithProvider,
    handleAuthCallback,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
