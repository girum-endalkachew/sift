import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sift-local-secret-key-change-in-production-12345'
);

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/admin/login',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/admin/login',
  '/api/sift',
  '/api/feedback',
];

const USER_PROTECTED = [
  '/workspace',
  '/inbox',
  '/tasks',
  '/schedule',
  '/projects',
  '/history',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const userToken = request.cookies.get('sift_session')?.value;
  const adminToken = request.cookies.get('sift_admin_session')?.value;

  let isUser = false;
  let isAdmin = false;

  if (userToken) {
    try {
      await jwtVerify(userToken, JWT_SECRET);
      isUser = true;
    } catch {}
  }

  if (adminToken) {
    try {
      const { payload } = await jwtVerify(adminToken, JWT_SECRET);
      isAdmin = payload.role === 'admin';
    } catch {}
  }

  // Admin area
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') {
      if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
      return NextResponse.next();
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Normal auth pages
  if (isUser && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    // POST /api/feedback is public; GET is checked in route itself
    return NextResponse.next();
  }

  const needsUser = USER_PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (needsUser && !isUser) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};