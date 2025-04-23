'use client';

import { useAuth } from './AuthProvider';
import { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

interface LogoutButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'text';
}

export default function LogoutButton({ 
  className = '', 
  variant = 'primary' 
}: LogoutButtonProps) {
  const { logout, loading, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { trackEvent } = useAnalytics();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Track logout event before actual logout to ensure user data is available
      trackEvent('logout', { 
        userId: user?.id ?? null, 
        email: user?.email ?? null 
      });
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Base styles
  let buttonStyles = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ';
  
  // Variant-specific styles
  if (variant === 'primary') {
    buttonStyles += 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 ';
  } else if (variant === 'secondary') {
    buttonStyles += 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 ';
  } else if (variant === 'text') {
    buttonStyles += 'bg-transparent hover:text-red-700 text-gray-700 hover:underline ';
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut || loading}
      className={`${buttonStyles} ${className} ${(isLoggingOut || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
      data-testid="logout-button"
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
