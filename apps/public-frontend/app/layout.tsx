import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import { Toaster } from '@rallyround/ui';

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
        <AnalyticsProvider />
        <Toaster />
      </body>
    </html>
  );
}
