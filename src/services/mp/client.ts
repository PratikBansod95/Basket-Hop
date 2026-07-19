import {
  MP_PROTOCOL_VERSION,
  type MpClientMessage,
  type MpServerMessage,
} from '../../../shared/contracts/mp';

function trimSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function getMpWsUrl(): string {
  const configured = import.meta.env.VITE_MP_WS_URL?.trim();
  if (configured) return trimSlash(configured);

  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return 'ws://localhost:8787';
  }

  return '';
}

export type MpClientHandlers = {
  onMessage: (message: MpServerMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onReconnecting?: (attempt: number) => void;
  onError?: (message: string) => void;
};

export class MpClient {
  private ws: WebSocket | null = null;
  private heartbeatTimer: number | null = null;
  private playerId = '';
  private rttMs = 80;
  private rttSamples = 0;
  private jitterMs = 0;
  private serverClockOffsetMs = 0;
  private resumeToken = '';
  private reconnectTimer: number | null = null;
  private reconnectAttempt = 0;
  private reconnectStartedAt = 0;
  private intentionalClose = false;

  constructor(private handlers: MpClientHandlers) {}

  /** Swap message handlers after lobby → match handoff. */
  setHandlers(handlers: MpClientHandlers): void {
    this.handlers = handlers;
  }

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /** Smoothed round-trip time in milliseconds. */
  getRttMs(): number {
    return this.rttMs;
  }

  getJitterMs(): number {
    return this.jitterMs;
  }

  serverNow(): number {
    return Date.now() + this.serverClockOffsetMs;
  }

  connect(playerId: string): void {
    this.stopHeartbeat();
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.closeSocket();
    this.playerId = playerId;
    this.rttMs = 80;
    this.rttSamples = 0;
    this.jitterMs = 0;
    this.serverClockOffsetMs = 0;
    this.resumeToken = '';
    this.reconnectAttempt = 0;
    this.reconnectStartedAt = 0;
    this.intentionalClose = false;
    this.openSocket();
  }

  private openSocket(): void {
    const url = getMpWsUrl();
    if (!url) {
      this.handlers.onError?.(
        'Online versus is not configured yet. Set VITE_MP_WS_URL to your Railway WS URL.',
      );
      return;
    }

    try {
      const socket = new WebSocket(url);
      this.ws = socket;
    } catch {
      this.handlers.onError?.('Could not open a WebSocket connection.');
      return;
    }

    const socket = this.ws;
    socket.addEventListener('open', () => {
      if (this.ws !== socket) return;
      this.send({
        type: 'hello',
        protocol: Number(MP_PROTOCOL_VERSION),
        playerId: this.playerId,
        resumeToken: this.resumeToken || undefined,
      });
      this.handlers.onOpen?.();
    });

    socket.addEventListener('message', (event) => {
      if (this.ws !== socket) return;
      try {
        const message = JSON.parse(String(event.data)) as MpServerMessage;
        if (message.type === 'pong') {
          this.notePong(message.clientTime, message.serverTime);
        } else if (message.type === 'welcome') {
          this.resumeToken = message.resumeToken;
          this.reconnectAttempt = 0;
          this.reconnectStartedAt = 0;
          this.noteServerClock(message.serverTime);
          this.startHeartbeat();
        }
        this.handlers.onMessage(message);
      } catch {
        // ignore malformed
      }
    });

    socket.addEventListener('close', () => {
      if (this.ws !== socket) return;
      this.ws = null;
      this.stopHeartbeat();
      if (!this.intentionalClose && this.resumeToken) {
        const now = Date.now();
        if (this.reconnectStartedAt === 0) this.reconnectStartedAt = now;
        if (now - this.reconnectStartedAt < 5_000) {
          this.reconnectAttempt += 1;
          this.handlers.onReconnecting?.(this.reconnectAttempt);
          this.reconnectTimer = window.setTimeout(
            () => this.openSocket(),
            Math.min(1_000, 250 * this.reconnectAttempt),
          );
          return;
        }
      }
      this.handlers.onClose?.();
    });

    socket.addEventListener('error', () => {
      if (this.ws !== socket) return;
      this.handlers.onError?.('Match server connection failed.');
    });
  }

  disconnect(): void {
    this.intentionalClose = true;
    this.stopHeartbeat();
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.closeSocket();
  }

  private closeSocket(): void {
    const socket = this.ws;
    this.ws = null;
    if (!socket) return;
    try {
      socket.close();
    } catch {
      // ignore
    }
  }

  send(message: MpClientMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(message));
  }

  private notePong(clientTime: number, serverTime: number): void {
    if (!Number.isFinite(clientTime) || clientTime <= 0) return;
    const now = Date.now();
    const sample = Math.max(1, now - clientTime);
    const previousRtt = this.rttMs;
    this.rttSamples += 1;
    if (this.rttSamples === 1) {
      this.rttMs = sample;
    } else {
      this.rttMs = this.rttMs * 0.7 + sample * 0.3;
    }
    const jitterSample = Math.abs(sample - previousRtt);
    this.jitterMs =
      this.rttSamples <= 1 ? jitterSample : this.jitterMs * 0.8 + jitterSample * 0.2;
    if (Number.isFinite(serverTime) && serverTime > 0) {
      const offsetSample = serverTime + sample * 0.5 - now;
      this.serverClockOffsetMs =
        this.rttSamples <= 1
          ? offsetSample
          : this.serverClockOffsetMs * 0.85 + offsetSample * 0.15;
    }
  }

  private noteServerClock(serverTime: number): void {
    if (!Number.isFinite(serverTime) || serverTime <= 0) return;
    const offsetSample = serverTime + this.rttMs * 0.5 - Date.now();
    this.serverClockOffsetMs =
      this.rttSamples === 0
        ? offsetSample
        : this.serverClockOffsetMs * 0.7 + offsetSample * 0.3;
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    const beat = () => {
      this.send({ type: 'heartbeat', clientTime: Date.now() });
    };
    beat();
    this.heartbeatTimer = window.setInterval(beat, 2_000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
