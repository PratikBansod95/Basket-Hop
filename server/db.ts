import { sql as vercelSql } from "@vercel/postgres";
import { getServerEnv } from "./env.js";

type DbTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<unknown[]>;

let cachedDb: DbTag | null = null;

function ensureDatabaseEnv(): void {
  const env = getServerEnv();
  if (!process.env.POSTGRES_URL) {
    process.env.POSTGRES_URL = env.databaseUrl;
  }
}

export function getDb(): DbTag {
  if (!cachedDb) {
    cachedDb = async (strings, ...values) => {
      ensureDatabaseEnv();
      const result = await vercelSql(strings, ...(values as Array<string | number | boolean | null>));
      return result.rows;
    };
  }

  return cachedDb;
}
