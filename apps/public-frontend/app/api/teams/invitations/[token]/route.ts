import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@rallyround/db';
import { teamInvitations, teamMembers, teamActivities } from '@rallyround/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    
    // Find invitation by token
    const invitation = await db.query.teamInvitations.findFirst({
      where: eq(teamInvitations.token, token),
      with: {
        team: true
      }
    });
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }
    
    // Check if invitation has expired
    if (invitation.status !== 'pending' || new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired or is no longer valid' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      invitation: {
        ...invitation,
        team: {
          id: invitation.team.id,
          name: invitation.team.name,
          sport: invitation.team.sport,
          ageGroup: invitation.team.ageGroup
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
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
    const token = params.token;
    
    // Parse request body
    const body = await request.json();
    const { action } = body;
    
    if (!action || (action !== 'accept' && action !== 'decline')) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    // Find invitation by token
    const invitation = await db.query.teamInvitations.findFirst({
      where: eq(teamInvitations.token, token)
    });
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }
    
    // Check if invitation has expired
    if (invitation.status !== 'pending' || new Date(invitation.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired or is no longer valid' },
        { status: 400 }
      );
    }
    
    // Check if user's email matches the invitation email
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== invitation.email) {
      return NextResponse.json(
        { error: 'This invitation was sent to a different email address' },
        { status: 403 }
      );
    }
    
    if (action === 'accept') {
      // Check if user is already a member of the team
      const existingMembership = await db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.teamId, invitation.teamId),
          eq(teamMembers.userId, userId)
        )
      });
      
      if (existingMembership) {
        // Update invitation status
        await db.update(teamInvitations)
          .set({
            status: 'accepted',
            acceptedAt: new Date().toISOString()
          })
          .where(eq(teamInvitations.id, invitation.id));
        
        return NextResponse.json(
          { message: 'You are already a member of this team' },
          { status: 200 }
        );
      }
      
      // Add user to team
      await db.insert(teamMembers).values({
        teamId: invitation.teamId,
        userId,
        role: invitation.role
      });
      
      // Update invitation status
      await db.update(teamInvitations)
        .set({
          status: 'accepted',
          acceptedAt: new Date().toISOString()
        })
        .where(eq(teamInvitations.id, invitation.id));
      
      // Log activity
      await db.insert(teamActivities).values({
        teamId: invitation.teamId,
        userId,
        activityType: 'member_joined',
        description: `${user?.email} joined the team`,
        metadata: { invitationId: invitation.id }
      });
      
      return NextResponse.json(
        { message: 'Successfully joined the team' },
        { status: 200 }
      );
    } else {
      // Update invitation status to declined
      await db.update(teamInvitations)
        .set({ status: 'declined' })
        .where(eq(teamInvitations.id, invitation.id));
      
      // Log activity
      await db.insert(teamActivities).values({
        teamId: invitation.teamId,
        userId: invitation.invitedById,
        activityType: 'invitation_declined',
        description: `${user?.email} declined the invitation`,
        metadata: { invitationId: invitation.id }
      });
      
      return NextResponse.json(
        { message: 'Invitation declined' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
