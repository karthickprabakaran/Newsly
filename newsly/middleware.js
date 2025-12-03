import { NextResponse } from 'next/server'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  
  // Only block obvious non-authenticated access to protected routes
  // Let client-side handle most authentication
  const protectedRoutes = ['/news', '/profile', '/suggestednews']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Skip middleware for static files and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }
  
  // Let the root path be handled by client-side logic
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // Only redirect if there's no auth cookie at all
  const authCookie = req.cookies.get('sb-access-token') || req.cookies.get('supabase.auth.token')
  
  // If trying to access protected route without any auth cookie, redirect to login
  if (isProtectedRoute && !authCookie) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}