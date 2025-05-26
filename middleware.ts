import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if we're on the production domain
  const isProductionDomain = request.headers.get('host') === 'battein-onboard-brown.vercel.app';

  // Only enable maintenance mode on production domain
  if (isProductionDomain) {
    // Skip maintenance redirect for the maintenance page itself
    if (request.nextUrl.pathname === '/maintenance') {
      return NextResponse.next();
    }

    // Redirect all other traffic to maintenance page
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // In development or other domains, allow all requests to pass through
  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - maintenance (maintenance page)
     */
    '/((?!_next/static|_next/image|favicon.ico|maintenance).*)',
  ],
}; 