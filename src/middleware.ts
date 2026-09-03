import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sift-local-secret-key-change-in-production-12345'
);

// Paths that never require authentication
const PUBLIC_PATHS = [
  '/',              // Landing page
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/sift',      // Allow public demo of Sift engine
];

// Paths that require authentication
const PROTECTED_PATHS = ['/workspace', '/inbox', '/tasks', '/schedule', '/projects'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('sift_session')?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect authenticated users away from login/signup
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (!isAuthenticated && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};