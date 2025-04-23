import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@rallyround/db';
import { teams, teamMembers, teamInvitations, teamActivities } from '@rallyround/db/schema';
import { eq, and } from 'drizzle-orm';
import { addDays } from 'date-fns';

export async function POST(request: Request) {
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
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Parse request body
    const body = await request.json();
    const { teamId, email, role, message } = body;
    
    // Validate required fields
    if (!teamId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user is a team admin or owner
    const membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      )
    });
    
    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to invite members to this team' },
        { status: 403 }
      );
    }
    
    // Check if invitation already exists
    const existingInvitation = await db.query.teamInvitations.findFirst({
      where: and(
        eq(teamInvitations.teamId, teamId),
        eq(teamInvitations.email, email),
        eq(teamInvitations.status, 'pending')
      )
    });
    
    if (existingInvitation) {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email' },
        { status: 409 }
      );
    }
    
    // Create invitation
    const expiresAt = addDays(new Date(), 7);
    const [invitation] = await db.insert(teamInvitations).values({
      teamId,
      email,
      role: role || 'member',
      invitedById: userId,
      expiresAt: expiresAt.toISOString(),
      message
    }).returning();
    
    if (!invitation) {
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }
    
    // Get team details
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId)
    });
    
    // Log invitation activity
    await db.insert(teamActivities).values({
      teamId,
      userId,
      activityType: 'member_invited',
      description: `Invitation sent to ${email}`,
      metadata: { invitationId: invitation.id, email }
    });
    
    // TODO: Send invitation email
    
    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get('teamId');
    
    if (!teamId) {
      return NextResponse.json(
        { error: 'Team ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user is a team admin or owner
    const membership = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, teamId),
        eq(teamMembers.userId, userId)
      )
    });
    
    if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to view invitations for this team' },
        { status: 403 }
      );
    }
    
    // Get pending invitations for the team
    const invitations = await db.query.teamInvitations.findMany({
      where: and(
        eq(teamInvitations.teamId, teamId),
        eq(teamInvitations.status, 'pending')
      ),
      with: {
        invitedBy: true
      }
    });
    
    return NextResponse.json({ invitations }, { status: 200 });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
