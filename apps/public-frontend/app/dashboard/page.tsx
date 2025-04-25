import { Suspense } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@rallyround/ui';
import DashboardNav from './dashboard-nav';
import DashboardStats from './stats';
import UpcomingEvents from './upcoming-events';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-slate-800 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Link href="/events/create">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">Create Event</Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-6">
          <Suspense fallback={<div className="text-slate-300 py-6">Loading stats...</div>}>
            {/* @ts-expect-error Async Server Component */}
            <DashboardStats />
          </Suspense>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* My Events */}
          <Card>
            <CardHeader>
              <CardTitle>My Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-800/70 backdrop-blur-md p-4 rounded-md border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">Monthly Book Discussion</h3>
                      <p className="text-sm text-slate-400">May 15, 2025 • 7:00 PM</p>
                      <p className="text-sm text-slate-400 mt-1">City Library, Meeting Room B</p>
                    </div>
                    <Link href="/events/1">
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-slate-800/70 backdrop-blur-md p-4 rounded-md border border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">Spring Trail Hike</h3>
                      <p className="text-sm text-slate-400">May 10, 2025 • 9:00 AM</p>
                      <p className="text-sm text-slate-400 mt-1">Riverside Park, North Entrance</p>
                    </div>
                    <Link href="/events/2">
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/events" className="text-sm text-blue-400 hover:text-gradient-primary">
                    View all events →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Clubs */}
          <Card>
            <CardHeader>
              <CardTitle>My Clubs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-800/70 backdrop-blur-md p-4 rounded-md border border-slate-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">Downtown Book Club</h3>
                      <p className="text-sm text-slate-400">Literary • 24 members</p>
                    </div>
                    <Link href="/clubs/1">
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-slate-800/70 backdrop-blur-md p-4 rounded-md border border-slate-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">Urban Hiking Collective</h3>
                      <p className="text-sm text-slate-400">Outdoor • 37 members</p>
                    </div>
                    <Link href="/clubs/2">
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/clubs" className="text-sm text-blue-400 hover:text-gradient-primary">
                    View all clubs →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-slate-300 py-6">Loading events...</div>}>
                {/* @ts-expect-error Async Server Component */}
                <UpcomingEvents />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
