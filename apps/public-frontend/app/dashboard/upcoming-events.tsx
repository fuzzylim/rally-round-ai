import { Button } from '@rallyround/ui';
import Link from 'next/link';

// In a real app, this would fetch data from Supabase
async function getUpcomingEvents() {
  // Simulating API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 1,
      name: 'Spring Tournament',
      date: 'May 15, 2025',
      type: 'Competition',
      location: 'Springfield Sports Center',
    },
    {
      id: 2,
      name: 'Team Fundraising Dinner',
      date: 'May 22, 2025',
      type: 'Fundraiser',
      location: 'Community Hall'
    },
    {
      id: 3,
      name: 'Summer Training Camp',
      date: 'June 5-12, 2025',
      type: 'Team Event',
      location: 'Mountain View Resort'
    }
  ];
}

export default async function UpcomingEvents() {
  const events = await getUpcomingEvents();
  
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="bg-white p-4 rounded-md border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{event.name}</h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>{event.date}</p>
                <p>{event.location}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                {event.type}
              </span>
            </div>
            <Link href={`/events/${event.id}`}>
              <Button variant="outline" size="sm">View</Button>
            </Link>
          </div>
        </div>
      ))}
      <div className="mt-4">
        <Link href="/events" className="text-sm text-blue-600 hover:text-blue-500">
          View all events →
        </Link>
      </div>
    </div>
  );
}
