// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    console.log('middleware is working kys')
  // Get the session token from cookies
  const sessionToken = req.cookies.get('next-auth.session-token') || req.cookies.get('__Secure-next-auth.session-token');

  // Define protected paths
  const protectedPaths = ['/dashboard', '/profile']; // Add your protected routes here
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedPaths.includes(path);

  // If no session token is found and the route is protected, redirect to login
  if (!sessionToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  // Continue with the request if session token exists or the route is not protected
  return NextResponse.next();
}

// Config: define which routes are protected by the middleware
export const config = {
  matcher: ['/dashboard', '/profile'], // Add your protected routes here
};
