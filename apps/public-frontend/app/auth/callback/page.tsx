'use client';

import { useEffect, useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthErrorBoundary } from '../../components/auth/AuthErrorBoundary';

/**
 * Safely redirect to a URL after validating it
 * 
 * This prevents open redirect vulnerabilities by ensuring the URL is either:
 * 1. A relative path (starts with /)
 * 2. A trusted domain that's part of our application
 * 
 * @param url The URL to redirect to
 * @returns void
 */
function safeRedirect(url: string) {
  // List of trusted domains for our application
  const trustedDomains = [
    'rallyround.club',
    'app.rallyround.club',
    'api.rallyround.club',
    'localhost',
    '127.0.0.1',
    'vercel.app'
  ];

  // Validate the URL
  let isValid = false;
  
  try {
    // If URL is relative (starts with /), it's safe
    if (url.startsWith('/')) {
      isValid = true;
    } else {
      // For absolute URLs, check if the domain is trusted
      const urlObj = new URL(url);
      isValid = trustedDomains.some(domain => 
        urlObj.hostname === domain || 
        urlObj.hostname.endsWith(`.${domain}`)
      );
    }
  } catch (e) {
    // If URL parsing fails, it's invalid
    console.error('⚠️ [Auth] Invalid redirect URL:', url);
    isValid = false;
  }

  // If URL is invalid, redirect to dashboard as fallback
  const safeUrl = isValid ? url : '/dashboard';
  
  if (!isValid) {
    console.warn('⚠️ [Auth] Redirect URL not trusted, using fallback:', safeUrl);
  }

  // Add a delay to ensure logs are visible and session is set
  console.log('⏳ [Auth] Waiting for session to settle before redirect...');
  setTimeout(() => {
    console.log('➡️ [Auth] Redirecting to:', safeUrl);
    const sanitizedUrl = DOMPurify.sanitize(safeUrl);
    window.location.href = sanitizedUrl;
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
        const redirectTo = params.get('redirect') || '/dashboard';
        console.log('➡️ [Auth] Redirecting to:', redirectTo);

        // Redirect to the target URL
        safeRedirect(redirectTo);
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
