'use client';

import { useAuth } from '../auth/AuthProvider';
import LogoutButton from '../auth/LogoutButton';
import Link from 'next/link';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                Rally Round
              </Link>
            </div>
            <nav className="ml-6 flex items-center space-x-4">
              <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Dashboard
              </Link>
              <Link href="/teams" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Teams
              </Link>
              <Link href="/competitions" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Competitions
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-700">
                  {user.name || user.email}
                </div>
                <LogoutButton variant="secondary" />
              </div>
            ) : (
              <Link href="/login" className="px-4 py-2 rounded font-medium bg-blue-600 text-white hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
