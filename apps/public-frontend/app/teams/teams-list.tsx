import Link from 'next/link';
import { Button } from '@rallyround/ui';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Import removed temporarily for deployment
// import { teamService, TeamWithMembership } from '@rallyround/db';

// Temporary type definition for deployment
type TeamWithMembership = {
  id: string;
  name: string;
  sport: string;
  ageGroup: string;
  logoUrl?: string | null;
  members: number;
  role: string;
};

// Temporary mock function for deployment
async function getTeams(): Promise<TeamWithMembership[]> {
  // We'll return an empty array during deployment
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return [];
  }
  
  console.log('Using temporary mock teams data for deployment');
  return [];
}

export default async function TeamsList() {
  try {
    const teams = await getTeams();
    
    // Teams will always be empty during deployment
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-white mb-2">Teams Feature Temporarily Disabled</h3>
        <p className="text-slate-400 mb-6">
          The teams feature is temporarily disabled during deployment.
          <br />
          Please check back after the deployment is complete.
        </p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
            Return Home
          </Button>
        </Link>
      </div>
    );
  } catch (error) {
    console.error('Error in TeamsList component:', error);
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-white mb-2">Error loading teams</h3>
        <p className="text-red-400 mb-6">The teams feature is temporarily unavailable.</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">
            Return Home
          </Button>
        </Link>
      </div>
    );
  }
}
