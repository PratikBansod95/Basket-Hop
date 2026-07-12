import { getDb } from "../db.js";
import type {
  LeaderboardEntry,
  LeaderboardSurface,
  PlayerProfile,
} from "../../shared/contracts/leaderboard.js";

interface PlayerRow {
  id: string;
  nickname: string;
  nickname_normalized: string;
  best_score: number;
  best_logs: number;
  created_at: string | Date;
  updated_at: string | Date;
}

interface LeaderboardRow {
  id: string;
  nickname: string;
  best_score: number;
  best_logs: number;
  updated_at: string | Date;
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function mapPlayer(row: PlayerRow): PlayerProfile {
  return {
    playerId: row.id,
    nickname: row.nickname,
    bestScore: row.best_score,
    bestLogs: row.best_logs,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

export async function checkDatabaseHealth(): Promise<void> {
  const sql = getDb();
  await sql`select 1`;
}

export async function getPlayerById(playerId: string): Promise<PlayerProfile | null> {
  const sql = getDb();
  const rows = (await sql`
    select id, nickname, nickname_normalized, best_score, best_logs, created_at, updated_at
    from players
    where id = ${playerId}
    limit 1
  `) as PlayerRow[];

  return rows.length > 0 ? mapPlayer(rows[0]) : null;
}

export async function getPlayerByNicknameKey(nicknameKey: string): Promise<PlayerProfile | null> {
  const sql = getDb();
  const rows = (await sql`
    select id, nickname, nickname_normalized, best_score, best_logs, created_at, updated_at
    from players
    where nickname_normalized = ${nicknameKey}
    limit 1
  `) as PlayerRow[];

  return rows.length > 0 ? mapPlayer(rows[0]) : null;
}

export async function upsertPlayer(
  playerId: string,
  nickname: string,
  nicknameKey: string,
): Promise<PlayerProfile> {
  const sql = getDb();
  const rows = (await sql`
    insert into players (id, nickname, nickname_normalized)
    values (${playerId}::uuid, ${nickname}, ${nicknameKey})
    on conflict (id)
    do update set
      nickname = excluded.nickname,
      nickname_normalized = excluded.nickname_normalized,
      updated_at = now(),
      last_seen_at = now()
    returning id, nickname, nickname_normalized, best_score, best_logs, created_at, updated_at
  `) as PlayerRow[];

  return mapPlayer(rows[0]);
}

export async function touchPlayer(playerId: string): Promise<void> {
  const sql = getDb();
  await sql`
    update players
    set last_seen_at = now()
    where id = ${playerId}::uuid
  `;
}

export async function insertScoreSubmission(
  playerId: string,
  clientRunId: string,
  score: number,
  logsClimbed: number,
  perfects: number,
  goods: number,
  peakCombo: number,
  surface: LeaderboardSurface,
): Promise<boolean> {
  const sql = getDb();
  const rows = (await sql`
    insert into score_submissions (
      player_id,
      client_run_id,
      score,
      logs_climbed,
      perfects,
      goods,
      peak_combo,
      surface
    )
    values (
      ${playerId}::uuid,
      ${clientRunId},
      ${score},
      ${logsClimbed},
      ${perfects},
      ${goods},
      ${peakCombo},
      ${surface}
    )
    on conflict (player_id, client_run_id) do nothing
    returning id
  `) as Array<{ id: string }>;

  return rows.length > 0;
}

export async function updatePlayerBest(
  playerId: string,
  score: number,
  logsClimbed: number,
): Promise<PlayerProfile> {
  const sql = getDb();
  const rows = (await sql`
    update players
    set
      best_score = case
        when ${score} > best_score then ${score}
        else best_score
      end,
      best_logs = case
        when ${score} > best_score then ${logsClimbed}
        when ${score} = best_score and ${logsClimbed} > best_logs then ${logsClimbed}
        else best_logs
      end,
      updated_at = case
        when ${score} > best_score then now()
        when ${score} = best_score and ${logsClimbed} > best_logs then now()
        else updated_at
      end,
      last_seen_at = now()
    where id = ${playerId}::uuid
    returning id, nickname, nickname_normalized, best_score, best_logs, created_at, updated_at
  `) as PlayerRow[];

  return mapPlayer(rows[0]);
}

export async function getLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
  const sql = getDb();
  const rows = (await sql`
    select id, nickname, best_score, best_logs, updated_at
    from players
    where best_score > 0
    order by best_score desc, best_logs desc, updated_at asc, nickname_normalized asc
    limit ${limit}
  `) as LeaderboardRow[];

  return rows.map((row, index) => ({
    rank: index + 1,
    playerId: row.id,
    nickname: row.nickname,
    score: row.best_score,
    logsClimbed: row.best_logs,
    updatedAt: toIso(row.updated_at),
  }));
}

export async function getPlayerRank(playerId: string): Promise<LeaderboardEntry | null> {
  const sql = getDb();
  const rows = (await sql`
    with ranked_players as (
      select
        id,
        nickname,
        best_score,
        best_logs,
        updated_at,
        row_number() over (
          order by best_score desc, best_logs desc, updated_at asc, nickname_normalized asc
        ) as rank
      from players
      where best_score > 0
    )
    select id, nickname, best_score, best_logs, updated_at, rank
    from ranked_players
    where id = ${playerId}::uuid
    limit 1
  `) as Array<
    LeaderboardRow & {
      rank: number;
    }
  >;

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    rank: row.rank,
    playerId: row.id,
    nickname: row.nickname,
    score: row.best_score,
    logsClimbed: row.best_logs,
    updatedAt: toIso(row.updated_at),
  };
}
