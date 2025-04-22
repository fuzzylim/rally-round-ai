import { Provider } from '@supabase/supabase-js';
import { signInWithSocial, handleSocialAuthCallback } from './social-auth';
import { supabase } from './supabase-singleton';

// Re-export social auth functions and client
export { signInWithSocial, handleSocialAuthCallback, supabase };

// Types
export type AuthUser = {
  id: string;
  email?: string;
  name?: string; // deprecated, use fullName
  fullName?: string;
  avatarUrl?: string;
  roles?: string[];
};

export type AuthResult = {
  user: AuthUser | null;
  error: Error | null;
};

// Legacy functions for backwards compatibility
export function createSupabaseClient() {
  console.warn('createSupabaseClient is deprecated, use the supabase singleton instead');
  return supabase;
}

export function createClientSupabaseClient() {
  console.warn('createClientSupabaseClient is deprecated, use the supabase singleton instead');
  return supabase;
}

// Get the current user from Supabase
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createSupabaseClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Fetch additional user data from profile table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, email')
      .eq('id', user.id)
      .single();
    
    return {
      id: user.id,
      email: user.email,
      name: profile?.full_name || user.email?.split('@')[0] || 'User',
      fullName: profile?.full_name || user.email?.split('@')[0] || 'User',
      avatarUrl: profile?.avatar_url,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Sign in with email and password
export async function signInWithEmail(
  email: string, 
  password: string
): Promise<AuthResult> {
  const supabase = createClientSupabaseClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { user: null, error };
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', data.user.id)
      .single();
    
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.email?.split('@')[0] || 'User',
        avatarUrl: profile?.avatar_url,
      },
      error: null,
    };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  const supabase = createClientSupabaseClient();
  
  try {
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('No user data returned from signup');
    }

    // Create a profile for the user
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      email,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      throw profileError;
    }
    
    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        fullName,
        name: fullName, // Keep name for backward compatibility
      } : null,
      error: null,
    };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

// Sign out
export async function signOut(): Promise<{ error: Error | null }> {
  const supabase = createClientSupabaseClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return { error: error as Error };
  }
}

// Get session
export async function getSession() {
  const supabase = createSupabaseClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export default {
  createSupabaseClient,
  createClientSupabaseClient,
  getCurrentUser,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getSession,
  signInWithSocial,
  handleSocialAuthCallback,
};
