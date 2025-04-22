'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';
import { AuthErrorBoundary } from '../../components/auth/AuthErrorBoundary';

function safeRedirect(url: string) {
  // Add a delay to ensure logs are visible and session is set
  console.log('⏳ [Auth] Waiting for session to settle before redirect...');
  setTimeout(() => {
    console.log('➡️ [Auth] Redirecting to:', url);
    window.location.href = url;
  }, 2000);
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const { handleAuthCallback } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      // Only run once
      if (hasStartedRef.current) {
        console.log('⏭️ [Auth] Callback already processed, skipping...');
        return;
      }
      hasStartedRef.current = true;
      console.log('🔄 [Auth] Starting callback processing...');

      try {
        // Process the callback
        console.log('🔍 [Auth] Processing auth callback...');
        const { user, error } = await handleAuthCallback();

        if (error) {
          console.error('❌ [Auth] Callback error:', error);
          setError(error);
          router.replace('/login');
          return;
        }

        if (!user) {
          console.error('❌ [Auth] No user returned from callback');
          const err = new Error('No user returned from callback');
          setError(err);
          router.replace('/login');
          return;
        }

        console.log('✅ [Auth] Callback successful:', user.email);

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
  }, [handleAuthCallback, router]);

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
