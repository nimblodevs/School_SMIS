import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema.js';

let database;
let pool;

export function getDatabase() {
  if (database) return database;

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to connect to Neon PostgreSQL.');
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  database = drizzle(pool, { schema });
  return database;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = undefined;
    database = undefined;
  }
}
