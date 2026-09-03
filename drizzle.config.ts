import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:data/sift.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});