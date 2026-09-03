import { NextRequest, NextResponse } from 'next/server';
import { db, feedback } from '@/db';
import { getAdminSession } from '@/lib/admin';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Admin only' }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(feedback).where(eq(feedback.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete feedback' }, { status: 500 });
  }
}