import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from './components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RallyRound - Community Fundraising & Sports Management',
  description: 'Platform for sports clubs, schools, and community groups to fundraise and manage competitions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        <AuthProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
        <Analytics 
          debug={process.env.NODE_ENV === 'development'}
          beforeSend={(event) => {
            // Don't track sensitive URLs (e.g., admin pages, etc.)
            if (event.url.includes('/admin') || event.url.includes('/private')) {
              return null;
            }
            return event;
          }}
        />
      </body>
    </html>
  );
}
