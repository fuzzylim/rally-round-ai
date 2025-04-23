import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// Import directly from the service file to avoid potential export issues
import { organizationService } from '@rallyround/db/src/services/organization-service';

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
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Parse request body
    const body = await request.json();
    const { name, description, logoUrl, website } = body;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }
    
    // Create organization using the service
    const result = await organizationService.createOrganization({
      name,
      description,
      logoUrl,
      website,
      createdById: userId,
    });
    
    // Return the new organization
    return NextResponse.json(result.organization);
  } catch (error) {
    console.error('Error creating organization:', error);
    
    // Return detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
      ? `${error.message}\n${error.stack}`
      : 'Failed to create organization';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
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
    
    // Get user profile from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    // Get all organizations
    // In a real app, you might want to paginate this
    const organizations = await organizationService.getUserOrganizations(session.user.id);
    
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    
    // Return detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
      ? `${error.message}\n${error.stack}`
      : 'Failed to fetch organizations';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
