import { auth } from "./server/auth";


const AUTH_ROUTES = ['/signin', '/signup'];
const DEFAULT_REDIRECT = '/dashboard';

export default auth((req) => {
  try {
    // If user is not authenticated and tries to access protected routes
    if (!req.auth && !AUTH_ROUTES.includes(req.nextUrl.pathname)) {
      const signInUrl = new URL("/signin", req.nextUrl.origin);
      return new Response(null, {
        status: 302,
        headers: {
          Location: signInUrl.toString(),
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }

    // If user is authenticated but tries to access auth pages
    if (req.auth && AUTH_ROUTES.includes(req.nextUrl.pathname)) {
      const dashboardUrl = new URL(DEFAULT_REDIRECT, req.nextUrl.origin);
      return new Response(null, {
        status: 302,
        headers: {
          Location: dashboardUrl.toString(),
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return new Response(null, { status: 500 });
  }
});

// Fixed: Static matcher configuration
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/signin',
    '/signup'
  ]
};