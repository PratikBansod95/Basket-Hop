create extension if not exists pgcrypto;

create table if not exists players (
  id uuid primary key,
  nickname text not null,
  nickname_normalized text not null unique,
  best_score integer not null default 0,
  best_logs integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists score_submissions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  client_run_id text not null,
  score integer not null,
  logs_climbed integer not null,
  perfects integer not null,
  goods integer not null,
  peak_combo integer not null,
  surface text not null check (surface in ('web', 'playables')),
  submitted_at timestamptz not null default now(),
  unique (player_id, client_run_id)
);

create index if not exists idx_players_best_score
  on players (best_score desc, best_logs desc, updated_at asc);

create index if not exists idx_score_submissions_player_id
  on score_submissions (player_id, submitted_at desc);
