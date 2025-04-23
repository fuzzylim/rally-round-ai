'use client';

import { track } from '@vercel/analytics';

type EventName = 
  | 'login_success'
  | 'login_error'
  | 'signup_success'
  | 'signup_error'
  | 'logout'
  | 'fundraiser_created'
  | 'competition_viewed'
  | 'team_joined';

type EventProperties = Record<string, string | number | boolean | null>;

/**
 * Custom hook for tracking analytics events in the application
 * 
 * @example
 * ```tsx
 * const { trackEvent } = useAnalytics();
 * 
 * // Track a login success event
 * const handleLogin = async () => {
 *   try {
 *     await login(email, password);
 *     trackEvent('login_success', { method: 'email' });
 *   } catch (error) {
 *     trackEvent('login_error', { reason: error.message });
 *   }
 * };
 * ```
 */
export function useAnalytics() {
  /**
   * Track a custom event with optional properties
   */
  const trackEvent = (name: EventName, properties?: EventProperties) => {
    // Only track in production to avoid polluting analytics data
    if (process.env.NODE_ENV === 'production') {
      track(name, properties);
    } else {
      // Log in development for debugging
      console.log(`[Analytics] Event: ${name}`, properties);
    }
  };

  return { trackEvent };
}
