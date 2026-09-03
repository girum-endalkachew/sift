import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, admin: null }, { status: 401 });
  }
  return NextResponse.json({ success: true, admin: { email: session.email } });
}