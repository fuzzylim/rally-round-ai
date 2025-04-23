import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@rallyround/ui';
import DashboardNav from '../dashboard/dashboard-nav';
import TeamsList from './teams-list';

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-slate-800 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Teams</h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Link href="/teams/create">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">Create Team</Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-6">
          <Suspense fallback={<div className="text-slate-300 py-6">Loading teams...</div>}>
            {/* @ts-expect-error Async Server Component */}
            <TeamsList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
