import { NextRequest, NextResponse } from 'next/server';
import { db, items } from '@/db';
import { eq } from 'drizzle-orm';

// POST /api/items/clear
// Body: { mode: "DONE" | "ALL" }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({ mode: 'DONE' }));
    const mode = body.mode || 'DONE';

    if (mode === 'ALL') {
      await db.delete(items);
      return NextResponse.json({ success: true, message: 'All items cleared' });
    } else {
      await db.delete(items).where(eq(items.status, 'DONE'));
      return NextResponse.json({ success: true, message: 'Completed items cleared' });
    }
  } catch (error) {
    console.error('Error clearing items:', error);
    return NextResponse.json({ success: false, error: 'Failed to clear items' }, { status: 500 });
  }
}