import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/password/reset'];
// Define routes that require authentication
const protectedRoutes = ['/dashboard', '/structurai', '/brain-dumper'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Redirect authentication and dashboard routes to home page
  if (url.pathname === '/signin' || 
      url.pathname === '/signup' || 
      url.pathname === '/password/reset' || 
      url.pathname === '/dashboard' ||
      url.pathname.startsWith('/dashboard/')) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // Redirect brain-dumper to structurai
  if (url.pathname === '/brain-dumper' ||
      url.pathname.startsWith('/brain-dumper/')) {
    url.pathname = '/structurai';
    return NextResponse.redirect(url);
  }
  
  // Allow access to all other routes
  return NextResponse.next();
}

// Match only specific routes
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/signin',
    '/signup',
    '/password/reset',
    '/structurai',
    '/brain-dumper'
  ]
};