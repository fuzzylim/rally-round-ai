import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { organizationService } from '@rallyround/db';

export const dynamic = 'force-dynamic';

/**
 * Create a new organization
 * POST /api/organizations
 */
export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { name, description, logoUrl, website } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }
    
    // Create the organization and add the user as an owner
    const result = await organizationService.createOrganization({
      name,
      description,
      logoUrl,
      website,
      createdById: userId,
    });
    
    return NextResponse.json(result.organization, { status: 201 });
  } catch (error) {
    console.error('Error in route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Get all organizations
 * GET /api/organizations
 */
export async function GET(request: Request) {
  try {
    // Get authenticated user
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get all organizations where the user is a member
    const organizations = await organizationService.getUserOrganizations(userId);
    
    return NextResponse.json(organizations, { status: 200 });
  } catch (error) {
    console.error('Error in route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
