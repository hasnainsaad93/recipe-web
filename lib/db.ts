import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pgPool?: Pool };

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add it in the workspace Secrets panel.");
  }
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  }
  return globalForPg.pgPool;
}

export async function query<T = any>(text: string, params: unknown[] = []): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
