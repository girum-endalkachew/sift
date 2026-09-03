import { NextRequest, NextResponse } from 'next/server';
import { siftRawInput } from '@/lib/organization/organizer';
import { getSessionUser } from '@/lib/auth';
import { db, items } from '@/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    const body = await request.json();
    const { text, autoSave = false } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Text field is required' }, { status: 400 });
    }

    const sifted = siftRawInput(text);

    if (autoSave && sifted.length > 0) {
      const recordsToInsert = sifted.map((item) => ({
        id: crypto.randomUUID(),
        userId: session?.userId || null,
        title: item.title,
        content: `Extracted from: "${item.raw}"`,
        type: item.type,
        status: item.status,
        priority: item.priority,
        dueDate: item.dueDate,
      }));

      await db.insert(items).values(recordsToInsert);

      return NextResponse.json({
        success: true,
        count: recordsToInsert.length,
        data: recordsToInsert,
      }, { status: 201 });
    }

    return NextResponse.json({ success: true, count: sifted.length, data: sifted });
  } catch (error) {
    console.error('Error in Sift engine:', error);
    return NextResponse.json({ success: false, error: 'Failed to process text' }, { status: 500 });
  }
}