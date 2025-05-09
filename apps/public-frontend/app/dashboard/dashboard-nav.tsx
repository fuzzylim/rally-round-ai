'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@rallyround/ui';
import LogoutButton from '../components/auth/LogoutButton';
import { useAuth } from '../components/auth/AuthProvider';

export default function DashboardNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user } = useAuth();
  
  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src="/heart-blue-pink.svg" 
                  alt="" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8" 
                />
                <h1 className="text-2xl font-extrabold text-gradient tracking-tight">RallyRound</h1>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard" 
                className={`${
                  pathname === '/dashboard' 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-slate-300 hover:border-slate-400 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link 
                href="/events" 
                className={`${
                  pathname.startsWith('/events') 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-slate-300 hover:border-slate-400 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Events
              </Link>
              <Link 
                href="/clubs" 
                className={`${
                  pathname.startsWith('/clubs') 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-slate-300 hover:border-slate-400 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Clubs
              </Link>
              <Link 
                href="/finances" 
                className={`${
                  pathname.startsWith('/finances') 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-slate-300 hover:border-slate-400 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Finances
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/profile">
              <Button variant="outline" size="sm" className="mr-4 border-slate-600 text-slate-200 hover:bg-slate-800">Profile</Button>
            </Link>
            <LogoutButton variant="secondary" className="border-slate-600 text-slate-200 hover:bg-slate-800" />
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-slate-900 border-b border-slate-800">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              href="/dashboard" 
              className={`${
                pathname === '/dashboard' 
                  ? 'bg-slate-800 border-blue-500 text-white' 
                  : 'border-transparent text-slate-300 hover:bg-slate-800 hover:border-slate-400 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/events" 
              className={`${
                pathname.startsWith('/events') 
                  ? 'bg-slate-800 border-blue-500 text-white' 
                  : 'border-transparent text-slate-300 hover:bg-slate-800 hover:border-slate-400 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link 
              href="/clubs" 
              className={`${
                pathname.startsWith('/clubs') 
                  ? 'bg-slate-800 border-blue-500 text-white' 
                  : 'border-transparent text-slate-300 hover:bg-slate-800 hover:border-slate-400 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Clubs
            </Link>
            <Link 
              href="/competitions" 
              className={`${
                pathname.startsWith('/competitions') 
                  ? 'bg-slate-800 border-blue-500 text-white' 
                  : 'border-transparent text-slate-300 hover:bg-slate-800 hover:border-slate-400 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Competitions
            </Link>
            <Link 
              href="/finances" 
              className={`${
                pathname.startsWith('/finances') 
                  ? 'bg-slate-800 border-blue-500 text-white' 
                  : 'border-transparent text-slate-300 hover:bg-slate-800 hover:border-slate-400 hover:text-white'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Finances
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-800">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">JS</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">Jane Smith</div>
                <div className="text-sm font-medium text-slate-400">jane@example.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Profile
              </Link>
              <div className="px-4 py-2">
                <LogoutButton variant="text" className="w-full text-left text-base font-medium text-slate-300 hover:text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
