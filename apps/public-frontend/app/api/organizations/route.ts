import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// Direct import temporarily removed for deployment
// import { organizationService } from '@rallyround/db';

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
    
    // Create the organization directly with Supabase for deployment
    // First create the organization record
    const { data: organization, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        description: description || null,
        logo_url: logoUrl || null,
        website: website || null,
        created_by_id: userId,
      })
      .select()
      .single();
      
    if (orgError) {
      console.error('Error creating organization:', orgError);
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
    }
    
    // Add the user as an owner to the organization
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization.id,
        user_id: userId,
        role: 'owner',
      });
      
    if (memberError) {
      console.error('Error adding member to organization:', memberError);
      return NextResponse.json({ error: 'Failed to add member to organization' }, { status: 500 });
    }
    
    return NextResponse.json(organization, { status: 201 });
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
    
    // Get all organizations where the user is a member using direct Supabase queries
    const { data: memberships, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', userId);
      
    if (membershipError) {
      console.error('Error fetching organization memberships:', membershipError);
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }
    
    if (memberships.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    
    // Get all organization details
    const organizationIds = memberships.map(m => m.organization_id);
    const { data: organizations, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .in('id', organizationIds);
      
    if (orgError) {
      console.error('Error fetching organizations:', orgError);
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
    }
    
    // Combine organization data with membership data
    const orgsWithMembership = organizations.map(org => {
      const membership = memberships.find(m => m.organization_id === org.id);
      return {
        ...org,
        role: membership ? membership.role : null
      };
    });
    
    return NextResponse.json(orgsWithMembership, { status: 200 });
  } catch (error) {
    console.error('Error in route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
