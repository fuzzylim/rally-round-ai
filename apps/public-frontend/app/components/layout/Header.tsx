'use client';

import { useAuth } from '../auth/AuthProvider';
import LogoutButton from '../auth/LogoutButton';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-slate-900 border-b border-slate-800 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                RallyRound
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-1 sm:space-x-4">
              <Link 
                href="/dashboard" 
                className={`${
                  pathname.startsWith('/dashboard') 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-slate-300 hover:border-slate-400 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
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
                href="/competitions" 
                className={`${
                  pathname.startsWith('/competitions') 
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-slate-300 hover:border-slate-400 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Competitions
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
            </nav>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-slate-300">
                  {user.name || user.email}
                </div>
                <LogoutButton variant="secondary" />
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded-md font-medium bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
