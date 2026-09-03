import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;
const isServerless = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

let url: string;
let authToken: string | undefined;

if (tursoUrl) {
  url = tursoUrl;
  authToken = tursoToken;
} else {
  const dbDir = path.join(process.cwd(), 'data');
  if (!isServerless && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  url = `file:${path.join(dbDir, 'sift.db')}`;
}

export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client, { schema });
export * from './schema';