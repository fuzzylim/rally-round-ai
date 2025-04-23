import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
// Import directly from the service files to avoid potential export issues
import { teamService } from '@rallyround/db/src/services/team-service';
import { organizationService } from '@rallyround/db/src/services/organization-service';

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
    const { name, description, sport, ageGroup, logoUrl, organizationId } = body;
    
    // Validate required fields
    if (!name || !sport || !ageGroup) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate organization ID
    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user is a member of the organization
    const isMember = await organizationService.isOrganizationMember(organizationId, userId);
    if (!isMember) {
      return NextResponse.json(
        { error: 'You are not a member of this organization' },
        { status: 403 }
      );
    }
    
    console.log('Creating team with user ID:', userId);
    
    // Create team using the team service
    const { team, membership } = await teamService.createTeam({
      name,
      description: description || null,
      sport,
      ageGroup,
      logoUrl: logoUrl || null,
      createdById: userId,
      organizationId
    });
    
    console.log('Team created:', team);
    
    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    // Return the real error message in development for debugging
    const errMsg = (process.env.NODE_ENV !== 'production' && error instanceof Error)
      ? error.message + (error.stack ? ('\n' + error.stack) : '')
      : 'Internal server error';
    return NextResponse.json(
      { error: errMsg },
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
    const url = new URL(request.url);
    const organizationId = url.searchParams.get('organizationId');
    
    // Get teams using the team service
    let teams;
    if (organizationId) {
      // Get teams for a specific organization
      teams = await teamService.getTeamsByOrganization(organizationId, userId);
    } else {
      // Get all teams for the user
      teams = await teamService.getUserTeams(userId);
    }
    
    return NextResponse.json({ teams }, { status: 200 });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
