import { Provider } from '@supabase/supabase-js';
import type { AuthResult } from './index';
import { supabase } from './supabase-singleton';

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
  try {
    // Get the base URL from env or window.location
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL
        ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
        : '';

    if (!baseUrl) {
      throw new Error('Unable to determine base URL for auth callback');
    }

    // Ensure the callback URL is absolute
    const callbackUrl = redirectTo
      ? new URL(redirectTo, baseUrl).toString()
      : `${baseUrl}/auth/callback`;

    console.log('🔐 [Social Auth] Starting social login:', {
      provider,
      callbackUrl,
      baseUrl,
      timestamp: new Date().toISOString()
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl,
        scopes: provider === 'google' ? 'profile email' : undefined,
      },
    });
    
    if (error) {
      console.error('❌ [Social Auth] OAuth error:', error);
      return { url: null, error };
    }
    
    console.log('✅ [Social Auth] OAuth URL generated:', data.url);
    
    return { url: data.url, error: null };
  } catch (error) {
    console.error('🚨 [Social Auth] Unexpected error:', error);
    return { url: null, error: error as Error };
  }
}

/**
 * Handle the social auth callback
 * This should be called in the callback page to complete the authentication process
 */
export async function handleSocialAuthCallback(): Promise<AuthResult> {
  console.log('🔄 [1] Starting social auth callback...');

  try {
    console.log('🔄 [2] Getting session...');
    // Exchange the code for a session
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log('❌ [2.1] Session error:', error);
      throw error;
    }

    if (!data.session) {
      console.log('❌ [2.2] No session data');
      throw new Error('No session data returned from Supabase auth. This could mean:\n' +
        '1. The OAuth callback was invalid\n' +
        '2. The session cookie was not set\n' +
        '3. The auth state was lost');
    }

    console.log('✅ [2.3] Session obtained:', {
      userId: data.session.user.id,
      email: data.session.user.email,
      metadata: data.session.user.user_metadata,
      aud: data.session.user.aud,
      role: data.session.user.role,
      lastSignInAt: data.session.user.last_sign_in_at,
      sessionId: data.session.access_token?.split('.')[2]?.substring(0, 8),
    });

    // Get user profile
    console.log('🔄 [3] Fetching profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, email')
      .eq('id', data.session.user.id)
      .single();

    if (profileError) {
      console.log('⚠️ [3.1] Profile fetch error:', profileError);
    } else {
      console.log('✅ [3.2] Profile fetch result:', profile);
    }
    
    // Create profile if it doesn't exist
    if (!profile) {
      console.log('🔄 [4] No profile found, creating new profile...');
      
      // Get user metadata from the session
      const { user } = data.session;
      const fullName = user?.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      const email = user?.email || '';
      const avatarUrl = user?.user_metadata?.avatar_url || null;

      console.log('ℹ️ [4.1] Profile data:', {
        id: data.session.user.id,
        fullName,
        email,
        avatarUrl,
      });

      console.log('🔄 [4.2] Inserting profile...');
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.session.user.id,
          full_name: fullName,
          email: email,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.log('❌ [4.3] Profile creation error:', insertError);
        throw insertError;
      }

      console.log('✅ [4.4] Profile created successfully:', insertData);
    }
    
    return {
      user: {
        id: data.session.user.id,
        email: profile?.email || data.session.user.email!,
        name: profile?.full_name || 
              data.session.user.user_metadata?.full_name || 
              data.session.user.user_metadata?.name || 
              data.session.user.email?.split('@')[0] || 
              'User',
        avatarUrl: profile?.avatar_url || data.session.user.user_metadata?.avatar_url,
      },
      error: null,
    };
  } catch (error) {
    console.error('🚨 [Social Auth] Fatal error:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return { user: null, error: error as Error };
  }
}

export default {
  signInWithSocial,
  handleSocialAuthCallback,
};
