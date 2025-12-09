// middleware.ts (in your root directory)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchUpstreamProfile, doesProfileExistFromResponse } from './lib/profile'

const DASHBOARD_VIEWS = ['personal', 'lab-owner', 'doctor'] as const
type DashboardView = (typeof DASHBOARD_VIEWS)[number]

const DEFAULT_DASHBOARD_VIEW: DashboardView = 'personal'

function buildDashboardUrl(request: NextRequest, view: DashboardView = DEFAULT_DASHBOARD_VIEW) {
  const url = new URL(request.url)
  url.pathname = '/dashboard'
  url.searchParams.set('view', view)
  return url
}

function isValidDashboardView(view: string | null): view is DashboardView {
  return DASHBOARD_VIEWS.includes(view as DashboardView)
}

// Helper function to check profile on server/edge side using shared upstream helper
async function checkUserProfile(token: string): Promise<boolean> {
  if (!token || token === 'undefined' || token.trim() === '') {
    return false
  }

  try {
    // Reuse the same upstream call that the Next.js API route uses
    const response = await fetchUpstreamProfile(`Bearer ${token}`)

    if (!response.ok) return false

    const data = await response.json()

    // Reuse the same "profile exists" check as client/server helpers
    return doesProfileExistFromResponse(data)
  } catch (error) {
    console.error('Error checking profile in middleware:', error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile/create', '/personal', '/auth/onboarding']
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Get access token from cookies
  const token = request.cookies.get('access_token')?.value
  
  // If no token or token is undefined/empty, redirect to login for protected routes
  if (isProtectedRoute && (!token || token === 'undefined' || token.trim() === '')) {
    const loginUrl = new URL('/auth?view=login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // If user is authenticated and trying to access login page, check profile and redirect accordingly
  if (pathname === '/login' && token && token !== 'undefined' && token.trim() !== '') {
    const profileExists = await checkUserProfile(token)
    
    if (profileExists) {
      const dashboardUrl = buildDashboardUrl(request)
      return NextResponse.redirect(dashboardUrl)
    } else {
      const profileUrl = new URL('/profile/create', request.url)
      return NextResponse.redirect(profileUrl)
    }
  }
  
  // If user is authenticated and trying to access /profile/create but profile exists,
  // redirect them to their default dashboard (e.g. /personal)
  if (pathname.startsWith('/profile/create') && token && token !== 'undefined' && token.trim() !== '') {
    const profileExists = await checkUserProfile(token)
    
    if (profileExists) {
      const dashboardUrl = buildDashboardUrl(request)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  // If user is authenticated and trying to access sections that require an existing profile
  // (/dashboard, /personal, /auth/onboarding) but profile doesn't exist, redirect to create profile
  if (
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/personal') ||
      pathname.startsWith('/auth/onboarding')) &&
    token &&
    token !== 'undefined' &&
    token.trim() !== ''
  ) {
    const profileExists = await checkUserProfile(token)
    
    if (!profileExists) {
      const profileUrl = new URL('/profile/create', request.url)
      return NextResponse.redirect(profileUrl)
    }
  }
  
  if (pathname === '/dashboard') {
    const view = searchParams.get('view')
    
    if (!isValidDashboardView(view)) {
      const dashboardUrl = buildDashboardUrl(request)
      return NextResponse.redirect(dashboardUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/create/:path*',
    '/personal/:path*',
    '/auth/onboarding/:path*',
    '/login'
  ]
}