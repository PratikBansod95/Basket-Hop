import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MpClient } from './client';

type Listener = (event: { data?: string }) => void;

class FakeWebSocket {
  static readonly OPEN = 1;
  static instances: FakeWebSocket[] = [];
  readyState = 0;
  sent: string[] = [];
  private listeners = new Map<string, Listener[]>();

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  addEventListener(type: string, listener: Listener): void {
    const list = this.listeners.get(type) ?? [];
    list.push(listener);
    this.listeners.set(type, list);
  }

  send(raw: string): void {
    this.sent.push(raw);
  }

  close(): void {
    this.readyState = 3;
  }

  emit(type: string, event: { data?: string } = {}): void {
    if (type === 'open') this.readyState = FakeWebSocket.OPEN;
    for (const listener of this.listeners.get(type) ?? []) listener(event);
  }
}

describe('MpClient socket generations', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeWebSocket.instances = [];
    vi.stubGlobal('WebSocket', FakeWebSocket);
    vi.stubGlobal('window', {
      location: { hostname: 'localhost' },
      setInterval,
      clearInterval,
      setTimeout,
      clearTimeout,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('ignores late events from a replaced socket', () => {
    const onClose = vi.fn();
    const client = new MpClient({ onMessage: vi.fn(), onClose });
    client.connect('123e4567-e89b-42d3-a456-426614174000');
    const first = FakeWebSocket.instances[0]!;

    client.connect('123e4567-e89b-42d3-a456-426614174000');
    const second = FakeWebSocket.instances[1]!;
    first.emit('close');
    second.emit('open');

    expect(onClose).not.toHaveBeenCalled();
    expect(second.sent.map((raw) => JSON.parse(raw))).toContainEqual(
      expect.objectContaining({ type: 'hello' }),
    );
  });

  it('reconnects with the server-issued resume token', () => {
    const onReconnecting = vi.fn();
    const client = new MpClient({ onMessage: vi.fn(), onReconnecting });
    client.connect('123e4567-e89b-42d3-a456-426614174000');
    const first = FakeWebSocket.instances[0]!;
    first.emit('open');
    first.emit('message', {
      data: JSON.stringify({
        type: 'welcome',
        playerId: '123e4567-e89b-42d3-a456-426614174000',
        nickname: 'Player',
        resumeToken: 'resume-token-value-1234567890',
        serverTime: Date.now(),
      }),
    });
    first.emit('close');
    vi.advanceTimersByTime(250);
    const resumed = FakeWebSocket.instances[1]!;
    resumed.emit('open');

    expect(onReconnecting).toHaveBeenCalledWith(1);
    expect(resumed.sent.map((raw) => JSON.parse(raw))).toContainEqual(
      expect.objectContaining({
        type: 'hello',
        resumeToken: 'resume-token-value-1234567890',
      }),
    );
  });
});
