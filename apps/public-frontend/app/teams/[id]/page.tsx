import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { db } from '@rallyround/db';
import { teams, teamMembers, teamActivities } from '@rallyround/db/schema';
import { eq, desc } from 'drizzle-orm';
import DashboardNav from '../../dashboard/dashboard-nav';
import TeamHeader from './team-header';
import TeamMembers from './team-members';
import TeamActivity from './team-activity';
import InviteMember from './invite-member';

interface TeamPageProps {
  params: {
    id: string;
  };
}

async function getTeamData(teamId: string, userId: string) {
  try {
    // Get team details
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId)
    });

    if (!team) {
      return null;
    }

    // Check if user is a member of the team
    const membership = await db.query.teamMembers.findFirst({
      where: eq(teamMembers.teamId, teamId),
      with: {
        user: true
      }
    });

    if (!membership) {
      return null;
    }

    // Get all team members
    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.teamId, teamId),
      with: {
        user: true
      }
    });

    // Get recent team activities
    const activities = await db.query.teamActivities.findMany({
      where: eq(teamActivities.teamId, teamId),
      with: {
        user: true
      },
      orderBy: [desc(teamActivities.createdAt)],
      limit: 10
    });

    return {
      team,
      userRole: membership.role,
      members,
      activities
    };
  } catch (error) {
    console.error('Error fetching team data:', error);
    return null;
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return notFound();
  }

  const teamData = await getTeamData(params.id, session.user.id);

  if (!teamData) {
    return notFound();
  }

  const { team, userRole, members, activities } = teamData;
  const isAdmin = userRole === 'owner' || userRole === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <TeamHeader team={team} userRole={userRole} />
        
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Team Activity</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <TeamActivity activities={activities} />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Team Members</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {members.length} members
                </span>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <TeamMembers members={members} userRole={userRole} teamId={team.id} />
              </div>
            </div>
            
            {isAdmin && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Invite Members</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <InviteMember teamId={team.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
