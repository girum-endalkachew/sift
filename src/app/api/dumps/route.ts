import { NextResponse } from 'next/server';
import { db, dumps } from '@/db';
import { getSessionUser } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const list = await db
      .select()
      .from(dumps)
      .where(eq(dumps.userId, session.userId))
      .orderBy(desc(dumps.createdAt))
      .limit(100);

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching dumps:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dumps' }, { status: 500 });
  }
}