import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// Import removed temporarily for deployment
// import { organizationService } from '@rallyround/db';

export const dynamic = 'force-dynamic';

/**
 * Get organizations for the current user
 * GET /api/organizations/user
 */
export async function GET(request: Request) {
  try {
    // Get authenticated user
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Mock data for deployment testing
    const mockOrganizations = [
      {
        id: 'org-1',
        name: 'Default Organization',
        description: 'This is a mock organization for testing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    // Return mock data
    return NextResponse.json(mockOrganizations, { status: 200 });
  } catch (error) {
    console.error('Error in route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
