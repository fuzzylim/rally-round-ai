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
    
    const userId = session.user.id;
    
    // Get organizations for this user
    const organizations = await organizationService.getUserOrganizations(userId);
    
    // If the user has no organizations, create a default one
    if (organizations.length === 0) {
      const userProfile = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single();
      
      const userName = userProfile.data?.full_name || session.user.email || 'User';
      const organization = await organizationService.getOrCreateDefaultOrganization(userId, userName);
      
      return NextResponse.json([organization], { status: 200 });
    }
    
    return NextResponse.json(organizations, { status: 200 });
  } catch (error) {
    console.error('Error in route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
