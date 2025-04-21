import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@rallyround/ui';

// In a real app, this would fetch data from Supabase
async function getTeams() {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '1',
      name: 'Eastside Tigers',
      sport: 'Basketball',
      ageGroup: 'U16',
      members: 12,
      image: '/team-placeholder.jpg',
      role: 'Manager'
    },
    {
      id: '2',
      name: 'Central High School',
      sport: 'Athletics',
      ageGroup: 'Varsity',
      members: 28,
      image: '/team-placeholder.jpg',
      role: 'Member'
    },
    {
      id: '3',
      name: 'Metro Soccer Club',
      sport: 'Soccer',
      ageGroup: 'U14',
      members: 18,
      image: '/team-placeholder.jpg',
      role: 'Coach'
    },
    {
      id: '4',
      name: 'West County Swimming',
      sport: 'Swimming',
      ageGroup: 'Junior',
      members: 15,
      image: '/team-placeholder.jpg',
      role: 'Member'
    }
  ];
}

export default async function TeamsList() {
  const teams = await getTeams();
  
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {teams.map((team) => (
        <Card key={team.id} className="overflow-hidden">
          <div className="h-32 bg-gray-300 w-full">
            {/* In a real app, this would be a proper image */}
            <div className="h-full w-full flex items-center justify-center bg-blue-100">
              <span className="text-lg font-bold text-blue-800">{team.name.substring(0, 2)}</span>
            </div>
          </div>
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {team.sport}
              </span>
              <span className="ml-2 text-sm text-gray-500">{team.ageGroup}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>{team.members} members</p>
                <p className="font-medium text-gray-700">Your role: {team.role}</p>
              </div>
              <Link href={`/teams/${team.id}`}>
                <Button variant="outline" size="sm">View Team</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
