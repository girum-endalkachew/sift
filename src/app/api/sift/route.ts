import { NextRequest, NextResponse } from 'next/server';
import { siftRawInput } from '@/lib/organization/organizer';
import { enrichWithAI } from '@/lib/ai/provider';
import { getSessionUser } from '@/lib/auth';
import { db, items, dumps } from '@/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    const body = await request.json();
    const { text, autoSave = false } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ success: false, error: 'Text field is required' }, { status: 400 });
    }

    let siftedResults = await enrichWithAI(text).catch(() => null);

    if (!siftedResults || siftedResults.length === 0) {
      const deterministic = siftRawInput(text);
      siftedResults = deterministic.map((d) => ({
        title: d.title,
        type: d.type,
        priority: d.priority,
        dueDate: d.dueDate,
        raw: d.raw,
      }));
    }

    if (autoSave && siftedResults.length > 0) {
      const dumpId = crypto.randomUUID();

      await db.insert(dumps).values({
        id: dumpId,
        userId: session?.userId || null,
        rawText: text,
        itemCount: siftedResults.length,
      });

      const recordsToInsert = siftedResults.map((item: any) => ({
        id: crypto.randomUUID(),
        userId: session?.userId || null,
        dumpId,
        title: item.title,
        content: item.raw ? `Extracted from: "${item.raw}"` : `Extracted from dump`,
        type: item.type,
        status: (item.type === 'TASK' || item.type === 'EVENT' ? 'TODO' : 'INBOX') as any,
        priority: item.priority,
        dueDate: item.dueDate || null,
        isFocused: false,
      }));

      await db.insert(items).values(recordsToInsert);

      return NextResponse.json({
        success: true,
        count: recordsToInsert.length,
        dumpId,
        data: recordsToInsert,
      }, { status: 201 });
    }

    return NextResponse.json({ success: true, count: siftedResults.length, data: siftedResults });
  } catch (error) {
    console.error('Error in Sift engine:', error);
    return NextResponse.json({ success: false, error: 'Failed to process text' }, { status: 500 });
  }
}