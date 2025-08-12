import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const publicPaths = ['/', '/sign-in', '/sign-up', '/verify'];
  const isPublicPath = publicPaths.includes(path);

  // Get token from cookies
  const token = request.cookies.get('token')?.value || '';

  // Redirect authenticated users away from public pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // Redirect unauthenticated users to login page for protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
  }

  // Allow request to proceed if none of the above conditions are met
  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}