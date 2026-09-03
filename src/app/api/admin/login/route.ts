import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminCredentials,
  isAdminConfigured,
  createAdminToken,
  ADMIN_COOKIE,
} from '@/lib/admin';

export async function POST(request: NextRequest) {
  try {
    if (!isAdminConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Admin is not configured on the server' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    const admin = getAdminCredentials();

    if (email !== admin.email || password !== admin.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin email or password' },
        { status: 401 }
      );
    }

    const token = await createAdminToken(email);

    const response = NextResponse.json({
      success: true,
      admin: { email },
    });

    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ success: false, error: 'Admin login failed' }, { status: 500 });
  }
}