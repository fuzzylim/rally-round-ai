'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Provider } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { 
  AuthUser,
  supabase,
  signInWithSocial,
  handleSocialAuthCallback,
} from '@rallyround/auth';

// Define the shape of our auth context
type AuthResult = {
  user: AuthUser | null;
  error: Error | null;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  handleAuthCallback: () => Promise<AuthResult>;
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
  handleAuthCallback: async () => ({ user: null, error: null }),
  logout: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap the application
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  // Load user on initial render and setup auth listener
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        console.log('🔍 [Auth] Loading initial user state...');

        // First check the session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('ℹ️ [Auth] Initial session state:', !!session);

        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          console.log('✅ [Auth] Found user from session:', user?.email);
          setUser(user);
        } else {
          console.log('ℹ️ [Auth] No session found');
          setUser(null);
        }
      } catch (err) {
        console.error('❌ [Auth] Error loading user:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 [Auth] Auth state change:', { event, session: !!session });
        
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ [Auth] User signed in:', session.user.email);
          setUser(session.user);
          router.refresh();
        } else if (event === 'SIGNED_OUT') {
          console.log('🚨 [Auth] User signed out or deleted');
          setUser(null);
          router.refresh();
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 [Auth] Token refreshed');
          setUser(session.user);
        }
      }
    );

    loadUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      
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
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      const { data: { user } } = await supabase.auth.getUser();
      
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
      const { error } = await supabase.auth.signOut();
      
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
  const handleAuthCallback = async (): Promise<AuthResult> => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [Auth] Processing auth callback...');

      // First check if we already have a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('✅ [Auth] Found existing session:', session.user.email);
        setUser(session.user);
        return { user: session.user, error: null };
      }

      // If no session, handle the callback
      console.log('🔍 [Auth] No session found, handling callback...');
      const { user, error } = await handleSocialAuthCallback();
      
      if (error) {
        console.error('❌ [Auth] Callback error:', error);
        setError(error);
        return { user: null, error };
      }
      
      if (!user) {
        console.error('❌ [Auth] No user returned from callback');
        const error = new Error('No user returned from callback');
        setError(error);
        return { user: null, error };
      }

      console.log('✅ [Auth] Callback successful:', user.email);
      setUser(user);
      return { user, error: null };
    } catch (err) {
      console.error('❌ [Auth] Unexpected error:', err);
      const error = err as Error;
      setError(error);
      return { user: null, error };
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
