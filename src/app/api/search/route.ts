import { NextRequest, NextResponse } from 'next/server';
import { db, items } from '@/db';
import { and, or, like, eq, desc, sql } from 'drizzle-orm';

// GET /api/search?q=aca&type=TASK&status=TODO
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const conditions = [];

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(
        or(
          like(items.title, pattern),
          like(items.content, pattern)
        )
      );
    }

    if (type) {
      conditions.push(eq(items.type, type as any));
    }

    if (status) {
      conditions.push(eq(items.status, status as any));
    }

    if (priority) {
      conditions.push(eq(items.priority, priority as any));
    }

    const query = db.select().from(items);

    const result =
      conditions.length > 0
        ? await query.where(and(...conditions)).orderBy(desc(items.updatedAt)).limit(50)
        : await query.orderBy(desc(items.updatedAt)).limit(50);

    return NextResponse.json({ success: true, count: result.length, data: result });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}