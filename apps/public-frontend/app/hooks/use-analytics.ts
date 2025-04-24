import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';

type EventOptions = {
  [key: string]: string | number | boolean | undefined;
};

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const trackEvent = useCallback(
    (eventName: string, options?: EventOptions) => {
      if (typeof window !== 'undefined' && window.va) {
        // Filter out any undefined values
        const filteredOptions = options 
          ? Object.fromEntries(
              Object.entries(options).filter(([_, v]) => v !== undefined)
            ) 
          : undefined;

        window.va('event', {
          name: eventName,
          ...filteredOptions,
          path: pathname,
          referrer: document.referrer || undefined,
          query: searchParams ? Object.fromEntries(searchParams.entries()) : undefined,
        });
      }
    },
    [pathname, searchParams]
  );

  return { trackEvent };
}

// Add type definition for window.va - with correct modifiers
interface Window {
  va?: (event: string, options?: any) => void;
}
