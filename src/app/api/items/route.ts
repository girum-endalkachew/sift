import { NextRequest, NextResponse } from 'next/server';
import { db, items } from '@/db';
import { createItemSchema } from '@/lib/validation';
import { getSessionUser } from '@/lib/auth';
import { desc, eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    const userId = session?.userId || null;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let conditions = [];
    if (userId) {
      conditions.push(eq(items.userId, userId));
    }
    if (status) {
      conditions.push(eq(items.status, status as any));
    }
    if (type) {
      conditions.push(eq(items.type, type as any));
    }

    const query = db.select().from(items);
    const result = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(desc(items.createdAt))
      : await query.orderBy(desc(items.createdAt));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    const body = await request.json();
    const validatedData = createItemSchema.parse(body);

    const newItem = {
      id: crypto.randomUUID(),
      userId: session?.userId || null,
      title: validatedData.title,
      content: validatedData.content || null,
      type: validatedData.type,
      status: validatedData.status,
      priority: validatedData.priority,
      dueDate: validatedData.dueDate || null,
      projectId: validatedData.projectId || null,
    };

    await db.insert(items).values(newItem);
    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Error creating item:', error);
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}