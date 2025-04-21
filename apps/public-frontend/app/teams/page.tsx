import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@rallyround/ui';
import DashboardNav from '../dashboard/dashboard-nav';
import TeamsList from './teams-list';

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Link href="/teams/create">
              <Button>Create Team</Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-6">
          <Suspense fallback={<div>Loading teams...</div>}>
            <TeamsList />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
