import { NextRequest, NextResponse } from 'next/server';
import { db, feedback } from '@/db';
import { getSessionUser } from '@/lib/auth';
import { eq } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await db.delete(feedback).where(eq(feedback.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete feedback' }, { status: 500 });
  }
}