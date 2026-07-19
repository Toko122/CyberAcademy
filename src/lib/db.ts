import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { serverEnv } from "@/lib/env";

declare global {
  var __cyberAcademyPool: Pool | undefined;
}

function sslConfig() {
  return serverEnv.dbSsl === "require" ? { rejectUnauthorized: true } : false;
}

function createPool() {
  return new Pool({
    connectionString: serverEnv.databaseUrl,
    ssl: sslConfig(),
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

const pool = globalThis.__cyberAcademyPool ?? createPool();
if (!serverEnv.isProduction) globalThis.__cyberAcademyPool = pool;

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = []
): Promise<QueryResult<T>> {
  return pool.query<T>(text, [...values]);
}

export async function withTransaction<T>(
  operation: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
