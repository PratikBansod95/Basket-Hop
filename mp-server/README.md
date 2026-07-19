# Basket Hop — Matchmaking server (Railway)

Node WebSocket service for authoritative online versus. It owns matchmaking,
the 60 Hz `VersusGame` simulation, 20 Hz snapshots, scoring, timer, and result.

## Local run

```bash
cd mp-server
cp ../.env.example .env   # or set DATABASE_URL
# DATABASE_URL must be the Basket Hop Neon connection string
npm install
npm run dev
```

Health check: `http://localhost:8787/health`  
WS: `ws://localhost:8787`

## Railway deploy

1. New project → **Deploy from GitHub** → select `Basket-Hop`
2. Keep the repository root as the service root. Railway discovers the root
   `railway.json`, which selects `mp-server/Dockerfile`; the server imports
   shared physics from `src/game`.
3. Variables:
   - `DATABASE_URL` = Basket Hop Neon pooled URL (same DB as Vercel)
   - `MP_ALLOWED_ORIGINS` = comma-separated exact web origins, for example
     `https://basket.example.com,https://www.basket.example.com`. Empty allows
     all origins for local development.
   - Optional: `MP_HEARTBEAT_TIMEOUT_MS` (default `45000`).
4. Generate a public domain (Settings → Networking → Generate Domain)
5. Confirm `https://YOUR-SERVICE.up.railway.app/health` returns `{ "ok": true, ... }`

## Client env

In Vercel (and local `.env`):

```
VITE_MP_WS_URL=wss://YOUR-SERVICE.up.railway.app
```

Redeploy the Vite app after setting it.

## Notes

- Players must already have a nickname registered (Neon `players` row).
- The server accepts tap inputs only. Client `snapshot` and `match_end` messages
  are rejected; they remain in the protocol temporarily for rolling upgrades.
- A disconnected player has five seconds to reconnect with its `resumeToken`.
- WebSocket payloads are capped at 16 KiB and sessions are rate/buffer limited.
- **Single-instance constraint:** rooms, resume tokens, simulation state, and
  queues are in process memory. Run exactly one replica. Horizontal scaling
  requires shared room/session state plus sticky routing or an external
  authoritative match worker.

## Verification

```bash
cd mp-server
npm test
npm run typecheck
```
