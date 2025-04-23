import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { organizationService } from '@rallyround/db';

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
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get organizations for this user
    const organizations = await organizationService.getUserOrganizations(userId);
    
    return NextResponse.json(organizations);
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    
    // Return detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
      ? `${error.message}\n${error.stack}`
      : 'Failed to fetch user organizations';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
