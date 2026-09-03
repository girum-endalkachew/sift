import { NextRequest, NextResponse } from 'next/server';
import { siftRawInput } from '@/lib/organization/organizer';
import { enrichWithAI } from '@/lib/ai/provider';
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

    // 1. Try AI Enrichment (Optional Layer)
    let siftedResults = await enrichWithAI(text).catch(() => null);

    // 2. Fallback to Deterministic Engine
    if (!siftedResults || siftedResults.length === 0) {
      const deterministic = siftRawInput(text);
      siftedResults = deterministic.map((d) => ({
        title: d.title,
        type: d.type,
        priority: d.priority,
        dueDate: d.dueDate,
      }));
    }

    // 3. Save to Database if autoSave requested
    if (autoSave && siftedResults.length > 0) {
      const recordsToInsert = siftedResults.map((item) => ({
        id: crypto.randomUUID(),
        userId: session?.userId || null,
        title: item.title,
        content: `Extracted from: "${text}"`,
        type: item.type,
        status: (item.type === 'TASK' || item.type === 'EVENT' ? 'TODO' : 'INBOX') as any,
        priority: item.priority,
        dueDate: item.dueDate || null,
      }));

      await db.insert(items).values(recordsToInsert);

      return NextResponse.json({
        success: true,
        count: recordsToInsert.length,
        data: recordsToInsert,
      }, { status: 201 });
    }

    return NextResponse.json({ success: true, count: siftedResults.length, data: siftedResults });
  } catch (error) {
    console.error('Error in Sift engine:', error);
    return NextResponse.json({ success: false, error: 'Failed to process text' }, { status: 500 });
  }
}