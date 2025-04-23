"use client";

import { Analytics } from "@vercel/analytics/next";

export function AnalyticsProvider() {
  return (
    <Analytics
      debug={process.env.NODE_ENV === "development"}
      beforeSend={(event) => {
        // Don't track sensitive URLs (e.g., admin pages, etc.)
        if (event.url.includes("/admin") || event.url.includes("/private")) {
          return null;
        }
        return event;
      }}
    />
  );
}
