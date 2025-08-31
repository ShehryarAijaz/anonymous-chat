import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
 
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths
  const publicPaths = ['/', '/sign-in', '/sign-up', '/verify-code/:path*'];
  const isPublicPath = publicPaths.some(publicPath => {
    if (publicPath.includes(':')) {
      // Handle dynamic routes like /verify-code/[username]
      const regex = new RegExp(publicPath.replace(/:\w+\*/g, '[^/]+'));
      return regex.test(path);
    }
    return publicPath === path;
  });

  // Get NextAuth token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Redirect authenticated users away from public pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login page for protected routes
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
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
    '/verify-code/:path*'
  ]
}