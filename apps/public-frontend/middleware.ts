import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hasAccess } from '@rallyround/rbac'

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
    },
  })

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the route requires authentication,
  // redirect to the sign-in page
  const authRoutes = ['/dashboard', '/profile', '/fundraisers/create', '/teams']
  const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  
  if (!session && isAuthRoute) {
    const redirectUrl = new URL('/login', request.nextUrl.origin)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // For specific admin routes, check RBAC permissions
  const rbacRoutes = [
    { path: '/fundraisers/create', resource: 'fundraisers', action: 'create' },
    { path: '/teams/manage', resource: 'teams', action: 'manage' },
    { path: '/competitions/create', resource: 'competitions', action: 'create' },
  ]

  for (const { path, resource, action } of rbacRoutes) {
    if (request.nextUrl.pathname.startsWith(path) && session) {
      const hasPermission = await hasAccess(
        session.user.id, 
        resource as any, 
        action as any,
        { userId: session.user.id }
      )

      if (!hasPermission) {
        return NextResponse.redirect(new URL('/unauthorized', request.nextUrl.origin))
      }
    }
  }

  return NextResponse.next()
}

// Specify which routes the middleware applies to
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/fundraisers/:path*',
    '/teams/:path*',
    '/competitions/:path*',
    '/events/:path*',
    '/members/:path*',
  ],
}
