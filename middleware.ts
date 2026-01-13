import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    if (token) {
      // already logged-in user trying to access login/register
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/library', req.url));
      }
    }
    return NextResponse.next();
  }

  // Protect root route
  if (pathname === '/') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    } else {
      // logged-in → redirect based on role
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/library', req.url));
      }
    }
  }

  // Protect other routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  //Role-based access
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/library', req.url));
  }

  if (pathname.startsWith('/library') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return NextResponse.next();
}

// Apply middleware to these paths
export const config = {
  matcher: [
    '/', // include root
    '/login',
    '/register',
    '/library/:path*',//only user
    '/admin/dashboard/:path*', //only admin
    '/genres/:path*',//only admin
    '/admin/:path*',//only admin
  ],
};
