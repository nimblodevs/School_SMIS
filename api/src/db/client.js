import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { AsyncLocalStorage } from "node:async_hooks";
import { sql } from "drizzle-orm";
import * as schema from "./schema.js";

const databaseContext = new AsyncLocalStorage();
let database;
let pool;

export function getDatabase() {
  const requestDatabase = databaseContext.getStore()?.database;
  if (requestDatabase) return requestDatabase;

  if (database) return database;

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to connect to Neon PostgreSQL.");
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  database = drizzle(pool, { schema });
  return database;
}

export function withDatabaseContext(requestDatabase, callback) {
  const parentContext = databaseContext.getStore();
  return databaseContext.run(
    {
      database: requestDatabase,
      rls: parentContext?.rls ?? {},
    },
    callback,
  );
}

export async function setDatabaseRlsContext(update) {
  const context = databaseContext.getStore();
  if (!context) {
    throw new Error(
      "RLS context can only be set within a request transaction.",
    );
  }

  context.rls = { ...context.rls, ...update };
  const {
    schoolId,
    userId,
    isSuperAdmin,
    authOperation,
    onboardingOperation,
    schoolLookup,
  } = context.rls;
  await context.database.execute(
    sql`select
      set_config('app.current_school_id', ${schoolId ?? ""}, true),
      set_config('app.current_user_id', ${userId ?? ""}, true),
      set_config('app.is_super_admin', ${isSuperAdmin ? "true" : "false"}, true),
      set_config('app.auth_operation', ${authOperation ? "true" : "false"}, true),
      set_config('app.onboarding_operation', ${onboardingOperation ? "true" : "false"}, true),
      set_config('app.school_lookup', ${schoolLookup ? "true" : "false"}, true)`,
  );
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = undefined;
    database = undefined;
  }
}
