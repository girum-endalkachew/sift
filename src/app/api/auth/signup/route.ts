import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/db';
import { hashPassword, createSessionToken, COOKIE_NAME } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).get();
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();

    const newUser = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
    };

    await db.insert(users).values(newUser);

    const token = await createSessionToken(userId, cleanEmail);

    const response = NextResponse.json({
      success: true,
      user: { id: userId, name: newUser.name, email: cleanEmail },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Signup failed' }, { status: 500 });
  }
}