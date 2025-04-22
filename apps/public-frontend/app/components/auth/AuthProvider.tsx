'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Provider, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { AuthUser } from '@rallyround/auth';

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
  const [session, setSession] = useState<Session | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  
  // Known routes in the application
  const KNOWN_ROUTES = [
    '/',
    '/login',
    '/signup',
    '/dashboard',
    '/teams',
    '/teams/create',
    '/fundraisers/create',
    '/competitions',
    '/auth/callback'
  ];
  
  // Check if the current path is a known route
  const isKnownRoute = KNOWN_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // Check if the current path is a system path
  const isSystemPath = 
    pathname.includes('/_next/') || 
    pathname.includes('/api/') ||
    pathname.match(/\.(\w+)$/);

  // Load user on initial render and setup auth listener
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        console.log('🔍 [Auth] Loading initial user state...');

        // Get current session and user using auth helpers
        const { data: { session } } = await supabase.auth.getSession();
        console.log('ℹ️ [Auth] Initial session state:', !!session);
        setSession(session);

        if (session?.user) {
          console.log('✅ [Auth] Found user from session:', session.user.email);
          
          // Transform to our AuthUser type
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name || 
                  session.user.email?.split('@')[0] || 'User',
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
        } else {
          console.log('ℹ️ [Auth] No session found');
          setUser(null);
          setSession(null);
        }
      } catch (err) {
        console.error('❌ [Auth] Error loading user:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener with the auth helpers client
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 [Auth] Auth state change:', { event, session: !!session });
        setSession(session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ [Auth] User signed in:', session.user.email);
          // Transform to our AuthUser type
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name || 
                  session.user.email?.split('@')[0] || 'User',
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
          // Only refresh if we're on a known route (not a 404 page)
          if (isKnownRoute && !isSystemPath) {
            console.log('🔄 [Auth] Refreshing after sign in');
            router.refresh();
          } else {
            console.log('⛔ [Auth] Skipping refresh on system path or 404 page');
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🚨 [Auth] User signed out or deleted');
          setUser(null);
          // Only refresh if we're on a known route (not a 404 page)
          if (isKnownRoute && !isSystemPath) {
            console.log('🔄 [Auth] Refreshing after sign out');
            router.refresh();
          } else {
            console.log('⛔ [Auth] Skipping refresh on system path or 404 page');
          }
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('🔄 [Auth] Token refreshed');
          // Update user on token refresh in case metadata changed
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name || 
                  session.user.email?.split('@')[0] || 'User',
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
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
      
      // Update session and user
      if (data.session && data.user) {
        setSession(data.session);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || 
                data.user.user_metadata?.name || 
                data.user.email?.split('@')[0] || 'User',
          avatarUrl: data.user.user_metadata?.avatar_url,
        });
      }
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
        options: { 
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      
      // Update session and user if available immediately (autoconfirm)
      if (data.session && data.user) {
        setSession(data.session);
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.full_name || name,
          avatarUrl: data.user.user_metadata?.avatar_url,
        });
      }
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
      setSession(null);
      // Use client-side navigation to avoid full page refresh
      router.push('/login');
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
      
      // Use the auth helpers directly
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'google' ? 'profile email' : undefined,
        },
      });
      
      if (error) {
        setError(error);
        return;
      }
      
      // Redirect to the provider's login page
      if (data.url) {
        window.location.href = data.url;
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

      // The Supabase client will automatically handle the code exchange
      // from the URL hash or query parameters
      console.log('🔍 [Auth] Checking for existing session...');
      const { data: { session } } = await supabase.auth.getSession();
      
      // If there's no session, the client didn't auto-process the auth callback
      if (!session) {
        console.log('🔍 [Auth] No session found, waiting for client processing...');
        
        // Wait a moment to ensure any client-side processing has time to complete
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Check again if session was set after delay
        const { data: { session: delayedSession } } = await supabase.auth.getSession();
        
        if (!delayedSession) {
          console.error('❌ [Auth] Unable to establish session after callback');
          const err = new Error('Authentication failed - could not establish session');
          setError(err);
          return { user: null, error: err };
        }
      }

      // Get the final session state to verify everything worked
      const { data: { session: finalSession } } = await supabase.auth.getSession();
      
      if (!finalSession?.user) {
        console.error('❌ [Auth] No user in session after callback');
        const err = new Error('Authentication failed - no user found');
        setError(err);
        return { user: null, error: err };
      }

      // Create our standard user object from session
      const authUser: AuthUser = {
        id: finalSession.user.id,
        email: finalSession.user.email || '',
        name: finalSession.user.user_metadata?.full_name || 
              finalSession.user.user_metadata?.name || 
              finalSession.user.email?.split('@')[0] || 'User',
        avatarUrl: finalSession.user.user_metadata?.avatar_url,
      };

      console.log('✅ [Auth] Callback successful:', authUser.email);
      setUser(authUser);
      setSession(finalSession);
      return { user: authUser, error: null };
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
