import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const ADMIN_COOKIE = 'sift_admin_session';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sift-local-secret-key-change-in-production-12345'
);

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || '',
  };
}

export function isAdminConfigured() {
  const { email, password } = getAdminCredentials();
  return Boolean(email && password);
}

export async function createAdminToken(email: string) {
  return new SignJWT({ role: 'admin', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== 'admin') return null;
    return payload as { role: 'admin'; email: string };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export { ADMIN_COOKIE };