# Basket Hop — Matchmaking server (Railway)

Node WebSocket service for online versus: presence, quick match queue, and private room codes.

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
2. Set **Root Directory** to `mp-server`
3. Variables:
   - `DATABASE_URL` = Basket Hop Neon pooled URL (same DB as Vercel)
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
- This phase connects players into a lobby/room. Live ball sync is the next step.
