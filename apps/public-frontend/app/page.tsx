import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@rallyround/ui';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo - simplified for mobile */}
          <div className="flex items-center gap-2">
            <Image 
              src="/heart-blue-pink.svg" 
              alt="" 
              width={28} 
              height={28} 
              className="h-7 w-7 sm:h-8 sm:w-8" 
            />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient tracking-tight">RallyRound</h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/events" className="text-slate-300 hover:text-gradient-primary transition-colors duration-300 font-medium">Events</Link>
            <Link href="/finances" className="text-slate-300 hover:text-gradient-primary transition-colors duration-300 font-medium">Finances</Link>
            <Link href="/clubs" className="text-slate-300 hover:text-gradient-primary transition-colors duration-300 font-medium">Clubs</Link>
            <Link href="/about" className="text-slate-300 hover:text-gradient-primary transition-colors duration-300 font-medium">About Us</Link>
          </nav>

          {/* Auth buttons - responsive sizing */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-200 hover:bg-slate-800 px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-3 py-1 text-sm sm:px-4 sm:py-2 sm:text-base">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Join Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">Join thousands of clubs today</h2>
          <p className="mt-4 text-xl text-slate-400">
            Start organising your events and building your community with RallyRound.
          </p>
          <div className="mt-8">
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started for Free
            </Link>
          </div>
          <div className="mt-6">
            <p className="text-slate-400 mb-2">Want to see something specific?</p>
            <Link href="/feedback" className="text-blue-400 hover:text-blue-300 font-medium">
              We want to hear from you! Share your feedback →
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-grow">
        <section className="bg-slate-900 py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/mesh-gradient.svg')] bg-cover bg-fixed opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">From the bush to the city</h2>
              <p className="mt-4 text-lg text-slate-400">
                Aussie clubs across the country use RallyRound to minimise screen time and maximise real-world connections.
              </p>
            </div>
            
            {/* Golf Competition Feature */}
            <div className="mb-16 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/60 rounded-xl p-8">
              <div className="md:flex md:items-center md:justify-between">
                <div className="md:flex-1">
                  <span className="inline-flex items-center rounded-md bg-green-900/30 px-2.5 py-0.5 text-sm font-medium text-green-300">
                    New Feature
                  </span>
                  <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">Friendly Golf Competitions</h2>
                  <p className="mt-3 text-slate-300 max-w-3xl">
                    We're kicking off with golf competitions! Join our monthly tournaments or organise your own casual game with mates. 
                    All skill levels welcome - we use a handicap system to keep it fair dinkum.
                  </p>
                  <div className="mt-6">
                    <a href="/competitions" className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
                      View upcoming golf events
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:ml-8">
                  <a href="/competitions" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    Get on the green
                  </a>
                </div>
              </div>
            </div>
            <div className="max-w-3xl">
              <p className="mt-6 text-xl leading-relaxed">
                RallyRound helps Aussie social clubs and community groups organise meet-ups,
                manage finances, and create real connections — with minimal screen time.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="px-8 py-3 text-lg rounded-full border-2 border-white/60 text-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Get organised, then get offline</h2>
              <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
                We believe technology should help you spend more time face-to-face, not glued to screens. RallyRound offers all the tools
                you need to run your social club efficiently, so you can focus on real-life connections.
              </p>
            </div>
            <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gradient-primary">Financial Management</h3>
                <p className="mt-4 text-slate-300 leading-relaxed">
                  Track membership dues, manage expenses, and coordinate group purchases. Keep your club's finances transparent and organized.
                </p>
              </div>

              <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gradient-primary">Event Planning</h3>
                <p className="mt-4 text-slate-300 leading-relaxed">
                  Create and manage social gatherings, workshops, and activities. Handle RSVPs, schedules, and location details.
                </p>
              </div>

              <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-md p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gradient-primary">Member Management</h3>
                <p className="mt-4 text-slate-300 leading-relaxed">
                  Maintain member profiles, track participation, and manage role assignments. Keep your club organized and connected.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gradient-to-br from-slate-950 to-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">RallyRound</h3>
              <p className="text-gray-400">
                Bringing communities together through sports and fundraising.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link href="/fundraisers" className="text-gray-400 hover:text-white">Fundraisers</Link></li>
                <li><Link href="/competitions" className="text-gray-400 hover:text-white">Competitions</Link></li>
                <li><Link href="/teams" className="text-gray-400 hover:text-white">Teams</Link></li>
                <li><Link href="/members" className="text-gray-400 hover:text-white">Member Management</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2025 RallyRound. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
