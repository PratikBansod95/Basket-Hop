import http from 'node:http';
import { WebSocketServer, type WebSocket } from 'ws';
import { lookupPlayer } from './db.js';
import { MatchMaker } from './matchmaker.js';
import {
  MP_PROTOCOL_VERSION,
  type MpClientMessage,
} from './protocol.js';

const PORT = Number(process.env.PORT ?? 8787);
const HEARTBEAT_TIMEOUT_MS = Number(process.env.MP_HEARTBEAT_TIMEOUT_MS ?? 45_000);

const matchMaker = new MatchMaker();

function parseMessage(raw: string): MpClientMessage | null {
  try {
    const data = JSON.parse(raw) as MpClientMessage;
    if (!data || typeof data !== 'object' || typeof data.type !== 'string') return null;
    return data;
  } catch {
    return null;
  }
}

async function handleMessage(ws: WebSocket, raw: string): Promise<void> {
  const message = parseMessage(raw);
  if (!message) {
    matchMaker.send(ws, { type: 'error', code: 'bad_message', message: 'Invalid message.' });
    return;
  }

  if (message.type === 'hello') {
    if (message.protocol !== MP_PROTOCOL_VERSION) {
      matchMaker.send(ws, {
        type: 'error',
        code: 'protocol',
        message: `Unsupported protocol version. Expected ${MP_PROTOCOL_VERSION}.`,
      });
      return;
    }
    const playerId = message.playerId?.trim();
    if (!playerId) {
      matchMaker.send(ws, {
        type: 'error',
        code: 'playerId',
        message: 'playerId is required.',
      });
      return;
    }

    let player;
    try {
      player = await lookupPlayer(playerId);
    } catch (error) {
      console.error('[mp] player lookup failed', error);
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
      return;
    }

    const session = matchMaker.registerSession(ws, player.playerId, player.nickname);
    matchMaker.send(ws, {
      type: 'welcome',
      playerId: session.playerId,
      nickname: session.nickname,
    });
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

  matchMaker.touchHeartbeat(ws);

  switch (message.type) {
    case 'heartbeat':
      matchMaker.send(ws, { type: 'pong' });
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

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
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
  console.log(`[mp] listening on 0.0.0.0:${PORT}`);
});
