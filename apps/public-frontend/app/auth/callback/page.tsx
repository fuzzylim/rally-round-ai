'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { handleAuthCallback, loading, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    async function processCallback() {
      try {
        await handleAuthCallback();
        // Redirect to dashboard after successful login
        router.push('/dashboard');
      } catch (err) {
        console.error('Error in auth callback:', err);
        setLocalError('Authentication failed. Please try again.');
      }
    }

    processCallback();
  }, [handleAuthCallback, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800/50 p-8 shadow-xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Completing login...</h2>
            <div className="mt-6 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || localError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800/50 p-8 shadow-xl backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">Authentication Error</h2>
            <p className="mt-4 text-white">{error?.message || localError}</p>
            <button
              onClick={() => router.push('/login')}
              className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-slate-800/50 p-8 shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Redirecting...</h2>
          <p className="mt-4 text-gray-300">You'll be redirected to your dashboard shortly.</p>
        </div>
      </div>
    </div>
  );
}
