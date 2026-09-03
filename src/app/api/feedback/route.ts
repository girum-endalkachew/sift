import { NextRequest, NextResponse } from 'next/server';
import { db, feedback, users } from '@/db';
import { getSessionUser } from '@/lib/auth';
import { getAdminSession } from '@/lib/admin';
import { desc, eq } from 'drizzle-orm';
import crypto from 'crypto';

// Anyone can submit feedback
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    const body = await request.json();
    const { message, email } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const newFeedback = {
      id: crypto.randomUUID(),
      userId: session?.userId || null,
      email: email ? email.trim() : session?.email || null,
      message: message.trim(),
    };

    await db.insert(feedback).values(newFeedback);

    return NextResponse.json({ success: true, message: 'Thank you for your feedback!' }, { status: 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to save feedback' }, { status: 500 });
  }
}

// Only admin can list feedback
export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 401 });
    }

    const list = await db
      .select({
        id: feedback.id,
        message: feedback.message,
        email: feedback.email,
        createdAt: feedback.createdAt,
        userId: feedback.userId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(feedback)
      .leftJoin(users, eq(feedback.userId, users.id))
      .orderBy(desc(feedback.createdAt))
      .limit(200);

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback' }, { status: 500 });
  }
}