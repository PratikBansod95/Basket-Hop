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
  onError?: (message: string) => void;
};

export class MpClient {
  private ws: WebSocket | null = null;
  private heartbeatTimer: number | null = null;
  private playerId = '';

  constructor(private handlers: MpClientHandlers) {}

  /** Swap message handlers after lobby → match handoff. */
  setHandlers(handlers: MpClientHandlers): void {
    this.handlers = handlers;
  }

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  connect(playerId: string): void {
    this.disconnect();
    this.playerId = playerId;
    const url = getMpWsUrl();
    if (!url) {
      this.handlers.onError?.(
        'Online versus is not configured yet. Set VITE_MP_WS_URL to your Railway WS URL.',
      );
      return;
    }

    try {
      this.ws = new WebSocket(url);
    } catch {
      this.handlers.onError?.('Could not open a WebSocket connection.');
      return;
    }

    this.ws.addEventListener('open', () => {
      this.send({ type: 'hello', protocol: MP_PROTOCOL_VERSION, playerId: this.playerId });
      this.startHeartbeat();
      this.handlers.onOpen?.();
    });

    this.ws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(String(event.data)) as MpServerMessage;
        this.handlers.onMessage(message);
      } catch {
        // ignore malformed
      }
    });

    this.ws.addEventListener('close', () => {
      this.stopHeartbeat();
      this.handlers.onClose?.();
    });

    this.ws.addEventListener('error', () => {
      this.handlers.onError?.('Match server connection failed.');
    });
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
    }
    this.ws = null;
  }

  send(message: MpClientMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify(message));
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = window.setInterval(() => {
      this.send({ type: 'heartbeat' });
    }, 15_000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}
