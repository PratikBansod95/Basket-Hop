import { neon } from '@neondatabase/serverless';

export interface DbPlayer {
  playerId: string;
  nickname: string;
}

let sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!sql) {
    const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
    if (!url) {
      throw new Error('DATABASE_URL (or POSTGRES_URL) is required for player lookup.');
    }
    sql = neon(url);
  }
  return sql;
}

export async function lookupPlayer(playerId: string): Promise<DbPlayer | null> {
  const rows = (await getSql()`
    select id::text as "playerId", nickname
    from players
    where id = ${playerId}::uuid
    limit 1
  `) as Array<{ playerId: string; nickname: string }>;

  if (!rows.length) return null;
  return { playerId: rows[0].playerId, nickname: rows[0].nickname };
}
