import type { MpClient } from './client';
import type {
  MpMatchResult,
  MpMatchSnapshot,
  MpPlayerInfo,
  MpServerMessage,
} from '../../../shared/contracts/mp';
import { VersusGame, type VersusPlayerId, type VersusResult } from '../../game/VersusGame';
import { SnapshotBuffer, interpDelayMs } from './snapshotBuffer';

const SNAPSHOT_HZ = 20;
const SNAPSHOT_INTERVAL_MS = 1000 / SNAPSHOT_HZ;

export type OnlineVersusHandlers = {
  onCountdown: (seconds: number, players: MpPlayerInfo[]) => void;
  onMatchStart: (info: {
    yourSlot: VersusPlayerId;
    youAreHost: boolean;
    players: MpPlayerInfo[];
  }) => void;
  onMatchEnd: (result: VersusResult & { reason: MpMatchResult['reason'] }) => void;
  onStatus?: (text: string) => void;
};

/**
 * Host-authoritative session with sequenced inputs, event + tick snaps,
 * RTT-based interpolation, and guest own-ball prediction.
 */
export class OnlineVersusSession {
  yourSlot: VersusPlayerId = 0;
  youAreHost = false;
  players: MpPlayerInfo[] = [];
  active = false;

  private snapSeq = 0;
  private lastPublishAt = 0;
  private localTapSeq = 0;
  private lastRemoteTapSeq = 0;
  private buffer = new SnapshotBuffer();
  /** Offset: hostServerTime ≈ localNow + hostClockOffset */
  private hostClockOffset = 0;
  private hostClockSamples = 0;

  constructor(
    private mp: MpClient,
    private game: VersusGame,
    private handlers: OnlineVersusHandlers,
  ) {}

  bindMessage(message: MpServerMessage): boolean {
    switch (message.type) {
      case 'match_countdown':
        this.handlers.onCountdown(message.seconds, message.players);
        return true;
      case 'match_start':
        this.begin(message.yourSlot, message.youAreHost, message.players);
        return true;
      case 'tap':
        if (this.youAreHost && this.active) {
          this.applyRemoteTap(message.slot, message.seq);
        }
        return true;
      case 'snapshot':
        if (!this.youAreHost && this.active) {
          this.onRemoteSnapshot(message.state);
        }
        return true;
      case 'match_end':
        this.endFromNetwork(message.result);
        return true;
      case 'pong':
        return true;
      default:
        return false;
    }
  }

  private begin(yourSlot: VersusPlayerId, youAreHost: boolean, players: MpPlayerInfo[]): void {
    this.yourSlot = yourSlot;
    this.youAreHost = youAreHost;
    this.players = players;
    this.active = true;
    this.snapSeq = 0;
    this.lastPublishAt = 0;
    this.localTapSeq = 0;
    this.lastRemoteTapSeq = 0;
    this.buffer.clear();
    this.hostClockOffset = 0;
    this.hostClockSamples = 0;
    this.game.reset();
    this.game.networkMode = youAreHost ? 'authority' : 'puppet';
    this.game.puppetOwnSlot = yourSlot;
    this.handlers.onMatchStart({ yourSlot, youAreHost, players });
  }

  private applyRemoteTap(slot: VersusPlayerId, seq: number): void {
    if (seq > 0 && seq <= this.lastRemoteTapSeq) return;
    if (seq > 0) this.lastRemoteTapSeq = seq;
    this.game.handleTap(slot);
    this.publishSnapshot(true);
  }

  private onRemoteSnapshot(state: MpMatchSnapshot): void {
    this.buffer.push(state);
    const sampleOffset = state.serverTime - performance.now();
    this.hostClockSamples += 1;
    if (this.hostClockSamples === 1) {
      this.hostClockOffset = sampleOffset;
    } else {
      this.hostClockOffset = this.hostClockOffset * 0.85 + sampleOffset * 0.15;
    }
    // Reconcile predicted own ball against latest authoritative snap (not interpolated).
    this.game.applySnapshotVisual(state, {
      ownSlot: this.yourSlot,
      mode: 'reconcile',
    });
  }

  /** Host: call after physics each frame (and after taps). */
  publishSnapshotIfDue(nowMs: number): void {
    if (!this.active || !this.youAreHost) return;
    if (nowMs - this.lastPublishAt < SNAPSHOT_INTERVAL_MS) return;
    this.publishSnapshot(false);
  }

  private publishSnapshot(force: boolean): void {
    if (!this.active || !this.youAreHost) return;
    const now = performance.now();
    if (!force && now - this.lastPublishAt < SNAPSHOT_INTERVAL_MS * 0.5) return;
    this.lastPublishAt = now;
    this.snapSeq += 1;
    this.mp.send({
      type: 'snapshot',
      state: this.game.exportSnapshot(this.snapSeq, now),
    });
  }

  /**
   * Guest: interpolate remote world into the game (opponent / hoop / scores).
   * Own ball is left for local prediction; reconciled on new snaps only.
   */
  sampleRemoteState(nowMs: number): void {
    if (!this.active || this.youAreHost) return;
    const latest = this.buffer.latest;
    if (!latest) return;

    const delay = interpDelayMs(this.mp.getRttMs());
    const renderHostTime = nowMs + this.hostClockOffset - delay;
    const sampled = this.buffer.sampleAt(renderHostTime) ?? latest;

    this.game.applySnapshotVisual(sampled, {
      ownSlot: this.yourSlot,
      mode: 'world',
    });
  }

  handleLocalTap(): void {
    if (!this.active) return;
    if (this.youAreHost) {
      this.game.handleTap(this.yourSlot);
      this.publishSnapshot(true);
      return;
    }

    this.localTapSeq += 1;
    this.game.handleTap(this.yourSlot);
    this.mp.send({
      type: 'tap',
      slot: this.yourSlot,
      seq: this.localTapSeq,
      clientTime: performance.now(),
    });
  }

  getRttMs(): number {
    return this.mp.getRttMs();
  }

  publishMatchEnd(result: VersusResult): void {
    if (!this.youAreHost || !this.active) return;
    const payload: MpMatchResult = {
      scoreP1: result.scoreP1,
      scoreP2: result.scoreP2,
      winner: result.winner,
      reason: 'timer',
    };
    this.mp.send({ type: 'match_end', result: payload });
    this.teardown();
    this.handlers.onMatchEnd({ ...result, reason: 'timer' });
  }

  private endFromNetwork(result: MpMatchResult): void {
    if (!this.active) return;
    const scoreP1 = result.reason === 'forfeit' ? this.game.scoreP1 : result.scoreP1;
    const scoreP2 = result.reason === 'forfeit' ? this.game.scoreP2 : result.scoreP2;
    this.game.markMatchOver();
    this.teardown();
    this.handlers.onMatchEnd({
      scoreP1,
      scoreP2,
      winner: result.winner,
      durationSec: 120,
      reason: result.reason,
    });
  }

  teardown(): void {
    this.active = false;
    this.game.networkMode = 'authority';
    this.buffer.clear();
  }

  dispose(): void {
    this.teardown();
  }
}
