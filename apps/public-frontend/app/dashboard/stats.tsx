import { Card, CardContent } from '@rallyround/ui';

// In a real app, this would fetch data from Supabase
async function getStats() {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    totalRaised: '$4,890',
    activeTeams: '3',
    upcomingEvents: '6',
    completedFundraisers: '5'
  };
}

export default async function DashboardStats() {
  const stats = await getStats();
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Raised</div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalRaised}</div>
            <div className="mt-1 text-xs text-green-600">+12% from last month</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1">Active Teams</div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeTeams}</div>
            <div className="mt-1 text-xs text-blue-600">Across 2 organizations</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1">Upcoming Events</div>
            <div className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</div>
            <div className="mt-1 text-xs text-gray-600">In the next 30 days</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-gray-500 mb-1">Completed Fundraisers</div>
            <div className="text-2xl font-bold text-gray-900">{stats.completedFundraisers}</div>
            <div className="mt-1 text-xs text-green-600">98% goal achievement</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
