import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@rallyround/db';
import { teams, teamMembers, teamActivities } from '@rallyround/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const teamId = params.id;
    
    // Check if user is a member of the team
    const membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      )
    });
    
    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 403 }
      );
    }
    
    // Check if user is the owner (owners cannot leave their team)
    if (membership.role === 'owner') {
      return NextResponse.json(
        { error: 'Team owners cannot leave their team. Transfer ownership first.' },
        { status: 400 }
      );
    }
    
    // Delete the membership
    await db.delete(teamMembers)
      .where(and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      ));
    
    // Log activity
    await db.insert(teamActivities).values({
      teamId,
      userId,
      activityType: 'member_left',
      description: `A member left the team`,
    });
    
    return NextResponse.json(
      { message: 'Successfully left the team' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error leaving team:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
