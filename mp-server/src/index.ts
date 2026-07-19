import http from 'node:http';
import { WebSocketServer, type WebSocket } from 'ws';
import { lookupPlayer } from './db.js';
import { MatchMaker } from './matchmaker.js';
import { MP_PROTOCOL_VERSION } from './protocol.js';
import { validateClientMessage } from './validation.js';

const PORT = Number(process.env.PORT ?? 8787);
const HEARTBEAT_TIMEOUT_MS = Number(process.env.MP_HEARTBEAT_TIMEOUT_MS ?? 45_000);
const MAX_PAYLOAD_BYTES = 16 * 1024;
const allowedOrigins = new Set(
  (process.env.MP_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function log(event: string, fields: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ level: 'info', service: 'basket-hop-mp', event, ...fields }));
}

const matchMaker = new MatchMaker({ log });
const helloSeen = new WeakSet<WebSocket>();
const preAuthRates = new WeakMap<WebSocket, { startedAt: number; count: number }>();

async function handleMessage(ws: WebSocket, raw: string): Promise<void> {
  const parsed = validateClientMessage(raw);
  if (!parsed.ok) {
    matchMaker.send(ws, { type: 'error', code: parsed.code, message: parsed.message });
    return;
  }
  const message = parsed.message;

  if (message.type === 'hello') {
    if (helloSeen.has(ws)) {
      matchMaker.send(ws, {
        type: 'error',
        code: 'duplicate_hello',
        message: 'hello may only be sent once per connection.',
      });
      log('auth_rejected', { reason: 'duplicate_hello' });
      return;
    }
    helloSeen.add(ws);
    if (message.protocol !== MP_PROTOCOL_VERSION) {
      matchMaker.send(ws, {
        type: 'error',
        code: 'protocol',
        message: `App update required (got protocol ${message.protocol}, need ${MP_PROTOCOL_VERSION}). Hard-refresh the page and try again.`,
      });
      log('auth_rejected', { playerId: message.playerId, reason: 'protocol' });
      return;
    }

    let player;
    try {
      player = await lookupPlayer(message.playerId);
    } catch (error) {
      console.error(
        JSON.stringify({
          level: 'error',
          service: 'basket-hop-mp',
          event: 'player_lookup_failed',
          playerId: message.playerId,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      matchMaker.send(ws, {
        type: 'error',
        code: 'db',
        message: 'Could not verify player right now.',
      });
      return;
    }

    if (!player) {
      matchMaker.send(ws, {
        type: 'error',
        code: 'unregistered',
        message: 'Register a nickname in the game before online versus.',
      });
      log('auth_rejected', { playerId: message.playerId, reason: 'unregistered' });
      return;
    }
    if (ws.readyState !== 1) {
      log('auth_abandoned', { playerId: message.playerId, reason: 'socket_closed' });
      return;
    }

    const registration = matchMaker.registerSession(
      ws,
      player.playerId,
      player.nickname,
      message.resumeToken,
    );
    if (!registration.ok) {
      matchMaker.send(ws, {
        type: 'error',
        code: registration.code,
        message: registration.message,
      });
      try {
        ws.close(4003, registration.code);
      } catch {
        // Socket may already be closing.
      }
      return;
    }
    const { session, resumed } = registration;
    matchMaker.send(ws, {
      type: 'welcome',
      playerId: session.playerId,
      nickname: session.nickname,
      resumeToken: session.resumeToken,
      serverTime: Date.now(),
    });
    if (resumed) matchMaker.restoreSessionState(session);
    return;
  }

  const session = matchMaker.getSession(ws);
  if (!session) {
    matchMaker.send(ws, {
      type: 'error',
      code: 'not_authed',
      message: 'Send hello with your playerId first.',
    });
    return;
  }

  if (message.type === 'tap' && !matchMaker.allowMessage(session, true, false)) return;
  matchMaker.touchHeartbeat(ws);

  switch (message.type) {
    case 'heartbeat':
      matchMaker.send(ws, {
        type: 'pong',
        clientTime: message.clientTime,
        serverTime: Date.now(),
      });
      break;
    case 'queue':
      matchMaker.enqueue(session);
      break;
    case 'queue_cancel':
      matchMaker.dequeue(session);
      break;
    case 'create_room':
      matchMaker.createPrivateRoom(session);
      break;
    case 'join_room':
      matchMaker.joinPrivateRoom(session, message.code ?? '');
      break;
    case 'leave_room':
      matchMaker.dequeue(session);
      matchMaker.leaveRoom(session);
      break;
    case 'tap':
    case 'snapshot':
    case 'match_end':
      matchMaker.handleMatchMessage(session, message);
      break;
    default:
      matchMaker.send(ws, {
        type: 'error',
        code: 'unknown',
        message: 'Unknown message type.',
      });
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/health' || req.url === '/') {
    const stats = matchMaker.stats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        service: 'basket-hop-mp',
        protocol: MP_PROTOCOL_VERSION,
        ...stats,
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

const wss = new WebSocketServer({
  server,
  maxPayload: MAX_PAYLOAD_BYTES,
  verifyClient: (info, done) => {
    if (allowedOrigins.size === 0 || (info.origin && allowedOrigins.has(info.origin))) {
      done(true);
      return;
    }
    log('origin_rejected', { origin: info.origin || null });
    done(false, 403, 'Origin not allowed');
  },
});

function allowInboundFrame(ws: WebSocket): boolean {
  const session = matchMaker.getSession(ws);
  if (session) return matchMaker.allowMessage(session, false);

  const now = Date.now();
  const rate = preAuthRates.get(ws) ?? { startedAt: now, count: 0 };
  if (now - rate.startedAt >= 10_000) {
    rate.startedAt = now;
    rate.count = 0;
  }
  rate.count += 1;
  preAuthRates.set(ws, rate);
  if (rate.count <= 30) return true;
  try {
    ws.close(4008, 'rate limit');
  } catch {
    // Socket may already be closing.
  }
  return false;
}

wss.on('connection', (ws) => {
  ws.on('message', (data, isBinary) => {
    if (!allowInboundFrame(ws)) return;
    if (isBinary) {
      matchMaker.send(ws, {
        type: 'error',
        code: 'bad_message',
        message: 'Binary messages are not supported.',
      });
      return;
    }
    const raw = typeof data === 'string' ? data : data.toString('utf8');
    void handleMessage(ws, raw);
  });
  ws.on('close', () => {
    matchMaker.detach(ws, 'close');
  });
  ws.on('error', () => {
    matchMaker.detach(ws, 'error');
  });
});

setInterval(() => {
  matchMaker.sweepStale(HEARTBEAT_TIMEOUT_MS);
}, 10_000).unref();

server.listen(PORT, '0.0.0.0', () => {
  log('server_listening', {
    host: '0.0.0.0',
    port: PORT,
    allowedOrigins: allowedOrigins.size,
    maxPayload: MAX_PAYLOAD_BYTES,
  });
});
