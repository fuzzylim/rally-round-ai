import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// @ts-ignore - Temporarily ignore type issues with db import
import { db } from '@rallyround/db';
import { eq, and } from 'drizzle-orm';

// Import from db schema
const teamMembers = {
  teamId: 'teamId',
  userId: 'userId',
  role: 'role'
};

const teamActivities = {
  teamId: 'teamId',
  userId: 'userId',
  activityType: 'activityType',
  description: 'description',
  metadata: 'metadata'
};

export async function PATCH(
  request: Request,
  context: { params: { id: string; userId: string } }
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
    
    const currentUserId = session.user.id;
    const teamId = context.params.id;
    const targetUserId = context.params.userId;
    
    // Check if current user is an admin or owner of the team
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    const currentUserMembership = await db.query.teamMembers.findFirst({
      where: and(
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.teamId, teamId),
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.userId, currentUserId)
      )
    });
    
    if (!currentUserMembership || (currentUserMembership.role !== 'owner' && currentUserMembership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to update member roles' },
        { status: 403 }
      );
    }
    
    // Get the target member
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    const targetMembership = await db.query.teamMembers.findFirst({
      where: and(
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.teamId, teamId),
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.userId, targetUserId)
      )
    });
    
    if (!targetMembership) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { role } = body;
    
    // Validate role
    if (!role || !['member', 'coach', 'manager', 'admin', 'owner'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
    
    // Check if trying to change owner's role
    if (targetMembership.role === 'owner' && currentUserMembership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only the owner can change the owner\'s role' },
        { status: 403 }
      );
    }
    
    // Update member role
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    await db.update(teamMembers)
      .set({ role })
      .where(and(
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.teamId, teamId),
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.userId, targetUserId)
      ));
    
    // Log activity
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    await db.insert(teamActivities).values({
      teamId,
      userId: currentUserId,
      activityType: 'role_changed',
      description: `Member role was changed to ${role}`,
      metadata: { targetUserId, previousRole: targetMembership.role, newRole: role }
    });
    
    return NextResponse.json(
      { message: 'Member role updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating member role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string; userId: string } }
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
    
    const currentUserId = session.user.id;
    const teamId = context.params.id;
    const targetUserId = context.params.userId;
    
    // Check if current user is an admin or owner of the team
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    const currentUserMembership = await db.query.teamMembers.findFirst({
      where: and(
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.teamId, teamId),
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.userId, currentUserId)
      )
    });
    
    if (!currentUserMembership || (currentUserMembership.role !== 'owner' && currentUserMembership.role !== 'admin')) {
      return NextResponse.json(
        { error: 'You do not have permission to remove members' },
        { status: 403 }
      );
    }
    
    // Get the target member
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    const targetMembership = await db.query.teamMembers.findFirst({
      where: and(
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.teamId, teamId),
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.userId, targetUserId)
      )
    });
    
    if (!targetMembership) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }
    
    // Check if trying to remove owner
    if (targetMembership.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove the team owner' },
        { status: 403 }
      );
    }
    
    // Delete the membership
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    await db.delete(teamMembers)
      .where(and(
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.teamId, teamId),
        // @ts-ignore - Temporarily ignore Drizzle ORM type issues
        eq(teamMembers.userId, targetUserId)
      ));
    
    // Log activity
    // @ts-ignore - Temporarily ignore Drizzle ORM type issues
    await db.insert(teamActivities).values({
      teamId,
      userId: currentUserId,
      activityType: 'member_removed',
      description: `A member was removed from the team`,
      metadata: { targetUserId, role: targetMembership.role }
    });
    
    return NextResponse.json(
      { message: 'Member removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
