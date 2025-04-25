import Link from 'next/link';
import { Button } from '@rallyround/ui';

export const metadata = {
  title: 'Competitions | RallyRound',
  description: 'Join friendly competitions starting with golf and more',
};

// Simulated competition data - in a real app, this would be fetched from Supabase
const competitions = [
  {
    id: '1',
    title: 'Monthly Golf Challenge',
    date: 'May 20, 2025',
    location: 'Royal Sydney Golf Club',
    type: 'Golf',
    participantCount: 16,
    status: 'Upcoming',
    description: 'A friendly 18-hole competition with handicap scoring. All skill levels welcome!'
  },
  {
    id: '2',
    title: 'Corporate Golf Day',
    date: 'June 15, 2025',
    location: 'The Lakes Golf Club',
    type: 'Golf',
    participantCount: 24,
    status: 'Registration Open',
    description: 'Network while enjoying a round of golf. Teams of 4, best ball format.'
  },
  {
    id: '3',
    title: 'Seniors Golf Tournament',
    date: 'May 28, 2025',
    location: 'New South Wales Golf Club',
    type: 'Golf',
    participantCount: 12,
    status: 'Registration Open',
    description: 'For golfers aged 60+. Enjoy a relaxed 9-hole competition with lunch included.'
  }
];

export default function CompetitionsPage() {
  return (
    <div className="bg-slate-950">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Friendly Competitions</h1>
            <p className="mt-2 text-slate-400">
              We're kicking off with golf competitions, but we want to hear what other sports you're keen on!
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href="/competitions/create">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                Create Competition
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Competition */}
        <div className="mt-10 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/60 rounded-xl p-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1">
              <h2 className="text-xl font-bold text-white sm:text-2xl">Monthly Golf Challenge</h2>
              <p className="mt-3 text-slate-300 max-w-3xl">
                Join our monthly golf competition at Royal Sydney Golf Club. All skill levels welcome - we use a handicap system to keep it fair dinkum for everyone.
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-slate-300">20 May 2025</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-slate-300">Royal Sydney Golf Club</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:ml-8">
              <Link href="/competitions/1">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Competitions */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-white mb-6">Upcoming Competitions</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((comp) => (
              <div key={comp.id} className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-16 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 flex items-center justify-between px-6">
                  <span className="font-medium text-white">{comp.type}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200">
                    {comp.status}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">{comp.title}</h3>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-slate-300 text-sm">{comp.date}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-slate-300 text-sm">{comp.location}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <span className="text-slate-300 text-sm">{comp.participantCount} participants</span>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-slate-400 text-sm line-clamp-2">
                    {comp.description}
                  </p>
                  
                  <div className="mt-5">
                    <Link href={`/competitions/${comp.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                        Register
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Feedback Section */}
        <div className="mt-16 bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">What competitions would you like to see?</h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              We're starting with golf, but we want to hear from you! What other sports or activities would you like to compete in?
            </p>
          </div>
          
          <form className="mt-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="sport" className="block text-sm font-medium text-white">What competition would you like to see?</label>
                <select
                  id="sport"
                  className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                >
                  <option value="">Select a sport or activity</option>
                  <option value="tennis">Tennis</option>
                  <option value="cricket">Cricket</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="swimming">Swimming</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="other">Other (please specify)</option>
                </select>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="other-sport" className="block text-sm font-medium text-white">If other, please specify</label>
                <input
                  type="text"
                  id="other-sport"
                  className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  placeholder="E.g., Lawn Bowls, Darts, etc."
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="details" className="block text-sm font-medium text-white">Any specific details or format you'd like to see?</label>
                <textarea
                  id="details"
                  rows={4}
                  className="mt-1 block w-full rounded-md bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  placeholder="Tell us what you have in mind..."
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
