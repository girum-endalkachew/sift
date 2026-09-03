import { NextRequest, NextResponse } from 'next/server';
import { db, dumps, items } from '@/db';
import { getSessionUser } from '@/lib/auth';
import { eq, and, desc } from 'drizzle-orm';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSessionUser();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const dump = await db
      .select()
      .from(dumps)
      .where(and(eq(dumps.id, id), eq(dumps.userId, session.userId)))
      .get();

    if (!dump) {
      return NextResponse.json({ success: false, error: 'Dump not found' }, { status: 404 });
    }

    const dumpItems = await db
      .select()
      .from(items)
      .where(eq(items.dumpId, id))
      .orderBy(desc(items.createdAt));

    return NextResponse.json({ success: true, data: { dump, items: dumpItems } });
  } catch (error) {
    console.error('Error fetching dump:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dump' }, { status: 500 });
  }
}