'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthErrorBoundary } from '../../components/auth/AuthErrorBoundary';

function safeRedirect(url: string) {
  // Add a delay to ensure logs are visible and session is set
  console.log('⏳ [Auth] Waiting for session to settle before redirect...');
  setTimeout(() => {
    console.log('➡️ [Auth] Redirecting to:', url);
    window.location.href = url;
  }, 1000);
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      // Only run once
      if (hasStartedRef.current) {
        console.log('⏭️ [Auth] Callback already processed, skipping...');
        return;
      }
      hasStartedRef.current = true;
      setIsLoading(true);
      console.log('🔄 [Auth] Starting callback processing...');

      try {
        // The Supabase client will automatically handle the code exchange
        // from the URL hash or query parameters
        console.log('🔍 [Auth] Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        // If there's no session, the client didn't auto-process the auth callback
        if (!session) {
          console.log('🔍 [Auth] No session found, manual code processing needed');
          
          // Wait a moment to ensure any client-side processing has time to complete
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Check again if session was set after delay
          const { data: { session: delayedSession } } = await supabase.auth.getSession();
          
          if (!delayedSession) {
            console.error('❌ [Auth] Unable to establish session after callback');
            throw new Error('Authentication failed - could not establish session');
          }
        }

        // Get the final session state to verify everything worked
        const { data: { session: finalSession } } = await supabase.auth.getSession();
        
        if (!finalSession?.user) {
          console.error('❌ [Auth] No user in session after callback');
          const err = new Error('Authentication failed - no user found');
          setError(err);
          router.replace('/login');
          return;
        }

        console.log('✅ [Auth] Callback successful:', finalSession.user.email);

        // Get the redirect URL
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect');
        const allowedPaths = ['/dashboard', '/profile', '/settings']; // Whitelisted paths
        let safeRedirectTo = '/dashboard'; // Default redirect
        if (redirectTo) {
          try {
            const redirectUrl = new URL(redirectTo, window.location.origin); // Parse URL
            const redirectPathname = redirectUrl.pathname; // Extract pathname
            if (allowedPaths.includes(redirectPathname)) {
              safeRedirectTo = redirectPathname; // Use sanitized pathname
            }
          } catch (e) {
            console.error('❌ [Auth] Invalid redirect URL:', redirectTo, e);
          }
        }
        console.log('➡️ [Auth] Redirecting to:', safeRedirectTo);

        // Redirect to the target URL
        safeRedirect(safeRedirectTo);
      } catch (e) {
        console.error('❌ [Auth] Unexpected error:', e);
        setError(e as Error);
        router.replace('/login');
      }
    };

    processCallback();
  }, [supabase, router]);

  if (error) {
    throw error; // This will be caught by the error boundary
  }

  return (
    <AuthErrorBoundary>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900">
            Completing Sign in...
          </h2>
          <div className="space-y-4">
            <div className="h-2 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-2 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-2 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </AuthErrorBoundary>
  );
}
