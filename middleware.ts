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
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/user/library', req.url));
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
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else {
        return NextResponse.redirect(new URL('/user/library', req.url));
      }
    }
  }

  // Protect other routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  //Role-based access
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/user/library', req.url));
  }

  if (pathname.startsWith('/user') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

if (pathname.startsWith("/user") && role === "admin") {
    return NextResponse.redirect(
      new URL("/admin/dashboard", req.url)
    );
  }


  return NextResponse.next();
}

// Apply middleware to these paths
export const config = {
  matcher: [
    '/', // include root
    '/login',
    '/register',

    '/user/:path*',//only user
    '/user/library/:path*',//only user
    '/user/home/:path*',//only user
    '/user/books/:path*',//only user
    '/user/profile/:path*',//only user
    '/user/tutorial/:path*',//only user
    
    '/admin/:path*',//only admin
    '/admin/dashboard/:path*', //only admin
    '/admin/genres/:path*',//only admin
    '/admin/books/:path*',//only admin
    '/admin/users/:path*',//only admin
    '/admin/reviews/:path*',//only admin
    
  ],
};
