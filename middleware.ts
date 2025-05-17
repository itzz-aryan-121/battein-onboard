import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the token from the cookies
  const token = request.cookies.get('admin_token')?.value

  // Check if the request is for the admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If there's no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      // Here you would verify the token
      // For now, we'll just check if it exists
      // In production, you should properly verify the JWT token
      
      // If token is valid, allow the request
      return NextResponse.next()
    } catch (error) {
      // If token is invalid, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Allow all other requests
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 