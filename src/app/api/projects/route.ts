import { NextRequest, NextResponse } from 'next/server';
import { db, projects } from '@/db';
import { desc } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/projects
export async function GET() {
  try {
    const list = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const newProject = {
      id: crypto.randomUUID(),
      userId: 'local-user', // Single user mode for now
      name: name.trim(),
      description: description || null,
    };

    await db.insert(projects).values(newProject);
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}