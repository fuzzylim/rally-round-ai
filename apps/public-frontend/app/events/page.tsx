import Link from 'next/link';
import { Button } from '@rallyround/ui';

export const metadata = {
  title: 'Events | RallyRound',
  description: 'Find local meet-ups and get off your screen faster',
};

// Simulated events data - in a real app, this would be fetched from Supabase
const events = [
  {
    id: '1',
    title: 'Monthly Book Club Catchup',
    date: 'May 15, 2025',
    time: '7:00 PM - 9:00 PM',
    location: 'City Library, Meeting Room B',
    club: 'Inner City Book Club',
    description: 'We\'ll be discussing "The Midnight Library" by Matt Haig over a cuppa. BYO snacks. New members welcome!',
    attendeeCount: 18
  },
  {
    id: '2',
    title: 'Bushwalking Adventure',
    date: 'May 10, 2025',
    time: '9:00 AM - 12:00 PM',
    location: 'Riverside Park, North Entrance',
    club: 'Urban Bushwalkers',
    description: 'An 8km trek through beautiful bushland. Bring your hat, sunscreen and water bottle. Moderate difficulty.',
    attendeeCount: 24
  },
  {
    id: '3',
    title: 'Italian Cuisine Workshop',
    date: 'May 22, 2025',
    time: '6:30 PM - 8:30 PM',
    location: 'Community Center Kitchen',
    club: 'Culinary Adventures',
    description: 'Learn to make authentic pasta from scratch with our resident Italian cuisine expert.',
    attendeeCount: 12
  },
  {
    id: '4',
    title: 'Photography Walk',
    date: 'May 8, 2025',
    time: '4:00 PM - 6:00 PM',
    location: 'Downtown Arts District',
    club: 'Photography Enthusiasts',
    description: 'Capture urban architecture and street life. All photography levels welcome.',
    attendeeCount: 15
  },
];

export default function EventsPage() {
  return (
    <div className="bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Meet-ups & Events</h1>
            <p className="mt-2 text-slate-400">
              Find local gatherings, spend less time on your device, and more time with real people.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/events/create">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                Create Event
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Finder - Minimising Screen Time */}
        <div className="mt-8 bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-lg p-4">
          <div className="pb-2 border-b border-slate-700 mb-3">
            <p className="text-slate-300 text-sm">Find in seconds, enjoy for hours. Get off your screen and into the real world.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="club-filter" className="block text-sm font-medium text-white">
                Filter by Club
              </label>
              <select
                id="club-filter"
                className="mt-1 block w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
              >
                <option value="">All Clubs</option>
                <option value="Inner City Book Club">Inner City Book Club</option>
                <option value="Urban Bushwalkers">Urban Bushwalkers</option>
                <option value="Culinary Adventures">Culinary Adventures</option>
                <option value="Photography Enthusiasts">Photography Enthusiasts</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-white">
                Filter by Date
              </label>
              <select
                id="date-filter"
                className="mt-1 block w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
              >
                <option value="">All Dates</option>
                <option value="this-week">This Week</option>
                <option value="next-week">Next Week</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-white">
                Event Type
              </label>
              <select
                id="type-filter"
                className="mt-1 block w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
              >
                <option value="">All Types</option>
                <option value="meeting">Meetings</option>
                <option value="social">Social Gatherings</option>
                <option value="workshop">Workshops</option>
                <option value="outdoor">Outdoor Activities</option>
              </select>
            </div>
          </div>
        </div>

        {/* Get Off Your Screen */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Find Your Next Outing</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-24 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-xs text-slate-300">{event.date.split(',')[0]}</div>
                    <div className="text-xl font-bold text-white">{event.date.split(',')[1]}</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gradient-primary">{event.title}</h3>
                  
                  <div className="mt-2 text-sm font-medium text-slate-300">
                    {event.club}
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-slate-300 text-sm">{event.time}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-slate-300 text-sm">{event.location}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-slate-300 text-sm">{event.attendeeCount} attendees</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-slate-400 text-sm line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="mt-5 flex justify-between">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                        View Details
                      </Button>
                    </Link>
                    
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white" size="sm">
                      Count Me In
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Easy Planning, More Doing */}
        <div className="mt-8 text-center">
          <div className="mb-3">
            <p className="text-slate-400 text-sm">Less time planning, more time enjoying life with your mates</p>
          </div>
          <Link href="/events/calendar">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
              Quick Calendar View
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
