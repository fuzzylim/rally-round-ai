import { Provider } from '@supabase/supabase-js';
import { createClientSupabaseClient } from './index';
import type { AuthResult } from './index';

/**
 * Sign in with a social provider (Google, GitHub, etc.)
 * @param provider The social provider to sign in with
 * @param redirectTo Optional URL to redirect to after sign in
 * @returns A promise that resolves to the URL to redirect to
 */
export async function signInWithSocial(
  provider: Provider,
  redirectTo?: string
): Promise<{ url: string | null; error: Error | null }> {
  const supabase = createClientSupabaseClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        scopes: provider === 'google' ? 'profile email' : undefined,
      },
    });
    
    if (error) {
      return { url: null, error };
    }
    
    return { url: data.url, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
}

/**
 * Handle the social auth callback
 * This should be called in the callback page to complete the authentication process
 */
export async function handleSocialAuthCallback(): Promise<AuthResult> {
  const supabase = createClientSupabaseClient();
  
  try {
    // Get the auth parameters from the URL
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return { user: null, error: error || new Error('No session found') };
    }
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url')
      .eq('id', data.session.user.id)
      .single();
    
    // Create profile if it doesn't exist
    if (!profile) {
      const userName = data.session.user.user_metadata?.full_name || 
                      data.session.user.user_metadata?.name ||
                      data.session.user.email?.split('@')[0] ||
                      'User';
      
      const avatarUrl = data.session.user.user_metadata?.avatar_url || null;
      
      await supabase.from('profiles').insert({
        id: data.session.user.id,
        name: userName,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });
    }
    
    return {
      user: {
        id: data.session.user.id,
        email: data.session.user.email,
        name: profile?.name || 
              data.session.user.user_metadata?.full_name || 
              data.session.user.user_metadata?.name || 
              data.session.user.email?.split('@')[0] || 
              'User',
        avatarUrl: profile?.avatar_url || data.session.user.user_metadata?.avatar_url,
      },
      error: null,
    };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

export default {
  signInWithSocial,
  handleSocialAuthCallback,
};
