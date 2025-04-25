import Link from 'next/link';
import { Button } from '@rallyround/ui';

export const metadata = {
  title: 'Social Clubs | RallyRound',
  description: 'Connect with local groups and spend less time online',
};

// Simulated clubs data - in a real app, this would be fetched from Supabase
const clubs = [
  {
    id: '1',
    name: 'Inner City Book Club',
    type: 'Literary',
    memberCount: 24,
    upcomingEventCount: 2,
    description: 'Passionate readers who catch up monthly over a cuppa to chat about novels, poetry, and non-fiction.',
    imageUrl: '/placeholder-book-club.jpg'
  },
  {
    id: '2',
    name: 'Urban Bushwalkers',
    type: 'Outdoor',
    memberCount: 37,
    upcomingEventCount: 3,
    description: 'Getting amongst it in local bushland, parks, and hidden gems around the city with regular weekend treks and nature walks.',
    imageUrl: '/placeholder-hiking.jpg'
  },
  {
    id: '3',
    name: 'Culinary Adventures',
    type: 'Food & Drink',
    memberCount: 18,
    upcomingEventCount: 1,
    description: 'Passionate food enthusiasts who explore different cuisines through cooking classes and restaurant outings.',
    imageUrl: '/placeholder-culinary.jpg'
  },
];

export default function ClubsPage() {
  return (
    <div className="bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Local Groups</h1>
            <p className="mt-2 text-slate-400">
              Join local clubs or start your own to connect with like-minded people IRL, not just online.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/clubs/create">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                Create New Club
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Clubs */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Get Offline, Get Connected</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((club) => (
              <div key={club.id} className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-40 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{club.name.charAt(0)}</span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gradient-primary">{club.name}</h3>
                  
                  <div className="mt-2 flex space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200">
                      {club.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-200">
                      {club.memberCount} members
                    </span>
                  </div>
                  
                  <p className="mt-3 text-slate-300 text-sm">
                    {club.description}
                  </p>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-slate-400">
                      <span className="font-medium text-slate-300">{club.upcomingEventCount}</span> upcoming events
                    </div>
                    
                    <Link href={`/clubs/${club.id}`}>
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                        View Club
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">What's Happening</h2>
          <p className="text-sm text-slate-400 mb-4">Quick updates so you can get back to real life faster</p>
          
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-lg p-6">
            <ul className="divide-y divide-slate-700">
              <li className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-medium">Inner City Book Club added a new meet-up</p>
                    <p className="text-slate-400 text-sm mt-1">Book Club Catchup: "The Midnight Library"</p>
                    <p className="text-slate-500 text-xs mt-1">Yesterday arvo</p>
                  </div>
                </div>
              </li>
              
              <li className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-medium">3 new mates joined Urban Bushwalkers</p>
                    <p className="text-slate-500 text-xs mt-1">2 days ago</p>
                  </div>
                </div>
              </li>
              
              <li className="py-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-medium">Culinary Adventures collected monthly dues</p>
                    <p className="text-slate-400 text-sm mt-1">$15 per member for upcoming cooking class supplies</p>
                    <p className="text-slate-500 text-xs mt-1">3 days ago</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Join Banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/60 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Spend Less Time Online</h2>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
            Our app gets you organised in minutes so you can put your phone down faster. From book clubs to bushwalking, find your tribe and enjoy real face-to-face connections.
          </p>
          <div className="mt-6">
            <Link href="/clubs/explore">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full">
                Find Your Local Group
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
