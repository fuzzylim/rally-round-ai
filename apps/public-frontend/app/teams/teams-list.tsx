import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@rallyround/ui';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { teamService, TeamWithMembership } from '@rallyround/db';

// Team interface is now imported from @rallyround/db

// Fetch teams from the database using the team service
async function getTeams(): Promise<TeamWithMembership[]> {
  // We'll throw errors up to the component for display
  const supabase = createServerComponentClient({ cookies });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return [];
  }
  
  try {
    // Get user ID from session
    const userId = session.user.id;
    console.log('Fetching teams for user:', userId);
    
    // Use the team service to get teams
    const teams = await teamService.getUserTeams(userId);
    console.log('Teams fetched successfully:', teams.length);
    
    return teams;
  } catch (error) {
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error fetching teams:', error.message, error.stack);
    } else {
      console.error('Unknown error fetching teams:', error);
    }
    // Throw error up for display
    throw error;
  }
}

export default async function TeamsList() {
  let teams: TeamWithMembership[] = [];
  let errorMessage: string | null = null;

  try {
    teams = await getTeams();
    console.log('Teams processed successfully:', teams.length);
    
    if (teams.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-white mb-2">No teams yet</h3>
          <p className="text-slate-400 mb-6">You haven't joined any teams yet. Create a new team or ask for an invitation.</p>
          <Link href="/teams/create">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">Create Your First Team</Button>
          </Link>
        </div>
      );
    }
  
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team: TeamWithMembership) => (
          <Card key={team.id} className="overflow-hidden bg-slate-800/70 backdrop-blur-md border border-slate-700">
            <div className="h-32 bg-slate-700 w-full">
              {team.logoUrl ? (
                <img 
                  src={team.logoUrl} 
                  alt={`${team.name} logo`} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/30 to-indigo-600/30">
                  <span className="text-2xl font-bold text-white">{team.name.substring(0, 2)}</span>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-white">{team.name}</CardTitle>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200">
                  {team.sport}
                </span>
                <span className="ml-2 text-sm text-slate-400">{team.ageGroup}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-400">
                  <p>{team.members} members</p>
                  <p className="font-medium text-slate-300">Your role: {team.role}</p>
                </div>
                <Link href={`/teams/${team.id}`}>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700">View Team</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  } catch (error) {
    // Show detailed error message for debugging
    if (error instanceof Error) {
      errorMessage = error.message + (error.stack ? `\n${error.stack}` : '');
    } else if (typeof error === 'object' && error !== null && 'toString' in error) {
      errorMessage = (error as any).toString();
    } else {
      errorMessage = 'Unknown error occurred.';
    }
  }

  if (errorMessage) {
    // Try to extract contained errors from AggregateError for display
    let aggregateErrors: string | null = null;
    if (typeof error !== 'undefined' && error && typeof error === 'object' && 'errors' in error && Array.isArray((error as any).errors)) {
      aggregateErrors = (error as any).errors.map((err: any, idx: number) => `Error [${idx}]: ${err && err.message ? err.message : JSON.stringify(err)}`).join('\n');
    }
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-white mb-2">Error loading teams</h3>
        <pre className="text-xs text-red-400 mb-6 whitespace-pre-wrap bg-slate-900/60 p-4 rounded border border-red-900 max-w-2xl mx-auto overflow-x-auto">{errorMessage}
{aggregateErrors ? aggregateErrors : ''}
</pre>
        <Link href="/teams/create">
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white">Create Team</Button>
        </Link>
      </div>
    );
  }
}
