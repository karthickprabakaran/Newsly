import { NextResponse } from 'next/server'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  
  // Define protected routes
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
  
  // Check our simple login cookie
  const isLoggedIn = req.cookies.get('user-logged-in')?.value === 'true'
  
  // If trying to access protected route without login cookie, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If user is logged in and trying to access login/signup, redirect to news
  if (isLoggedIn && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/news', req.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}