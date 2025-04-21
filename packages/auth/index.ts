import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types
export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  roles?: string[];
};

export type AuthResult = {
  user: AuthUser | null;
  error: Error | null;
};

// Create a Supabase client (works in both client and server components)
export function createSupabaseClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// Legacy function for backwards compatibility
export function createClientSupabaseClient(): SupabaseClient {
  return createSupabaseClient();
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', user.id)
      .single();
    
    return {
      id: user.id,
      email: user.email,
      name: profile?.name || user.email?.split('@')[0] || 'User',
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
  name: string
): Promise<AuthResult> {
  const supabase = createClientSupabaseClient();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      return { user: null, error };
    }
    
    if (data.user) {
      // Create a profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        avatar_url: null,
        updated_at: new Date().toISOString(),
      });
    }
    
    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        name,
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
};
