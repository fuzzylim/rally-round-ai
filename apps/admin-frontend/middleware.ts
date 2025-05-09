import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { hasAccess, checkAccess } from '@rallyround/rbac'

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const cookieStore = {
    get: (name: string) => request.cookies.get(name)
  }
  
  const supabase = createRouteHandlerClient(
    { cookies: () => cookieStore as any }
  )

  // Get the user's session
  const { data: { session } } = await supabase.auth.getSession()

  // Admin routes require authentication
  if (!session) {
    const redirectUrl = new URL('/login', request.nextUrl.origin)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Get user roles to check admin access
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)

  const roles = userRoles?.map(r => r.role) || []
  
  // For the admin frontend, we need admin or org_admin roles for access
  const hasAdminAccess = roles.includes('admin') || roles.includes('org_admin')
  
  if (!hasAdminAccess) {
    return NextResponse.redirect(new URL('/unauthorized', request.nextUrl.origin))
  }

  // For specific admin sections, implement more granular RBAC
  const rbacRoutes = [
    { path: '/admin/users', resource: 'members', action: 'manage' },
    { path: '/admin/organizations', resource: 'organizations', action: 'manage' },
    { path: '/admin/fundraisers', resource: 'fundraisers', action: 'manage' },
    { path: '/admin/competitions', resource: 'competitions', action: 'manage' },
  ]

  for (const { path, resource, action } of rbacRoutes) {
    if (request.nextUrl.pathname.startsWith(path)) {
      const hasPermission = await hasAccess(
        session.user.id, 
        resource as any, 
        action as any,
        { userId: session.user.id }
      )

      if (!hasPermission) {
        return NextResponse.redirect(new URL('/admin/unauthorized', request.nextUrl.origin))
      }
    }
  }

  return NextResponse.next()
}

// Specify which routes the middleware applies to
export const config = {
  matcher: [
    '/admin/:path*'
  ],
}
