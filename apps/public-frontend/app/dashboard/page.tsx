import { Suspense } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@rallyround/ui';
import DashboardNav from './dashboard-nav';
import DashboardStats from './stats';
import UpcomingEvents from './upcoming-events';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Link href="/fundraisers/create">
              <Button>Create Fundraiser</Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-6">
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats />
          </Suspense>
        </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* My Fundraisers */}
          <Card>
            <CardHeader>
              <CardTitle>My Fundraisers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">School Equipment Drive</h3>
                      <p className="text-sm text-gray-500">$3,240 of $5,000</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <Link href="/fundraisers/1">
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Team Travel Fund</h3>
                      <p className="text-sm text-gray-500">$1,890 of $3,000</p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '63%' }}></div>
                      </div>
                    </div>
                    <Link href="/fundraisers/2">
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/fundraisers" className="text-sm text-blue-600 hover:text-blue-500">
                    View all fundraisers →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Teams */}
          <Card>
            <CardHeader>
              <CardTitle>My Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Eastside Tigers</h3>
                      <p className="text-sm text-gray-500">Basketball • U16</p>
                    </div>
                    <Link href="/teams/1">
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Central High School</h3>
                      <p className="text-sm text-gray-500">Athletics • Varsity</p>
                    </div>
                    <Link href="/teams/2">
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/teams" className="text-sm text-blue-600 hover:text-blue-500">
                    View all teams →
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
              <Suspense fallback={<div>Loading events...</div>}>
                <UpcomingEvents />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
