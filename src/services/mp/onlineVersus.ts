import type { MpClient } from './client';
import type {
  MpMatchResult,
  MpMatchSnapshot,
  MpPlayerInfo,
  MpServerMessage,
} from '../../../shared/contracts/mp';
import { VersusGame, type VersusPlayerId, type VersusResult } from '../../game/VersusGame';
import { SnapshotBuffer } from './snapshotBuffer';

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
 * Server-authoritative session with sequenced inputs, local prediction,
 * pending-input replay, adaptive interpolation, and bounded reconciliation.
 */
export class OnlineVersusSession {
  yourSlot: VersusPlayerId = 0;
  youAreHost = false;
  players: MpPlayerInfo[] = [];
  active = false;

  private localTapSeq = 0;
  private buffer = new SnapshotBuffer();
  private pendingTaps: Array<{ seq: number; serverTime: number }> = [];
  private presentation: MpMatchSnapshot | null = null;
  private lastCorrectionPx = 0;

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
        this.begin(message.yourSlot, message.youAreHost, message.players, message.startAt);
        return true;
      case 'tap':
        // Protocol-v3 compatibility only; the server now owns simulation.
        return true;
      case 'snapshot':
        if (this.active) this.onRemoteSnapshot(message.state);
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

  private begin(
    yourSlot: VersusPlayerId,
    youAreHost: boolean,
    players: MpPlayerInfo[],
    _startAt: number,
  ): void {
    const resuming = this.active && this.yourSlot === yourSlot;
    this.yourSlot = yourSlot;
    this.youAreHost = youAreHost;
    this.players = players;
    if (resuming) {
      this.game.networkMode = 'puppet';
      this.game.puppetOwnSlot = yourSlot;
      for (const tap of this.pendingTaps) this.sendTap(tap);
      this.handlers.onStatus?.('');
      return;
    }
    this.active = true;
    this.localTapSeq = 0;
    this.pendingTaps = [];
    this.buffer.clear();
    this.presentation = null;
    this.lastCorrectionPx = 0;
    this.game.reset();
    this.game.startPlaying();
    this.game.networkMode = 'puppet';
    this.game.puppetOwnSlot = yourSlot;
    this.handlers.onMatchStart({ yourSlot, youAreHost, players });
  }

  private onRemoteSnapshot(state: MpMatchSnapshot): void {
    this.buffer.push(state, Date.now());
    const acknowledged = state.ackTapSeq[this.yourSlot] ?? 0;
    if (this.pendingTaps.length === 0 && this.localTapSeq < acknowledged) {
      this.localTapSeq = acknowledged;
    }
    this.pendingTaps = this.pendingTaps.filter((tap) => tap.seq > acknowledged);
    // Preserve prediction while an input is in flight. Once acknowledged, the
    // authoritative snapshot contains that input and bounded reconciliation is safe.
    this.game.applyAuthoritativeRemote(state, this.yourSlot, false);
    this.lastCorrectionPx = this.game.reconcileOwnWithPending(
      state,
      this.yourSlot,
      this.pendingTaps,
      this.mp.serverNow(),
    );
  }

  /** Interpolate remote/shared presentation state; keep the own ball predicted. */
  sampleRemoteState(nowMs: number): void {
    void nowMs;
    if (!this.active) return;
    const latest = this.buffer.latest;
    if (!latest) return;

    const delay = this.buffer.recommendedDelayMs(this.mp.getRttMs());
    const renderServerTime = this.mp.serverNow() - delay;
    this.presentation = this.buffer.sampleAt(renderServerTime) ?? latest;
  }

  handleLocalTap(): void {
    if (!this.active) return;
    this.localTapSeq += 1;
    this.game.handleTap(this.yourSlot);
    const serverTime = this.mp.serverNow();
    const tap = { seq: this.localTapSeq, serverTime };
    this.pendingTaps.push(tap);
    this.sendTap(tap);
  }

  private sendTap(tap: { seq: number; serverTime: number }): void {
    this.mp.send({
      type: 'tap',
      slot: this.yourSlot,
      seq: tap.seq,
      clientTime: tap.serverTime,
    });
  }

  getRttMs(): number {
    return this.mp.getRttMs();
  }

  getPresentationSnapshot(): MpMatchSnapshot | null {
    return this.presentation ?? this.buffer.latest;
  }

  getDiagnostics(): {
    rttMs: number;
    jitterMs: number;
    interpolationMs: number;
    bufferedSnapshots: number;
    correctionPx: number;
    underrunRate: number;
  } {
    return {
      rttMs: this.mp.getRttMs(),
      jitterMs: Math.max(this.mp.getJitterMs(), this.buffer.jitterMs),
      interpolationMs: this.buffer.recommendedDelayMs(this.mp.getRttMs()),
      bufferedSnapshots: this.buffer.size,
      correctionPx: this.lastCorrectionPx,
      underrunRate: this.buffer.underrunRate,
    };
  }

  private endFromNetwork(result: MpMatchResult): void {
    if (!this.active) return;
    this.game.markMatchOver();
    this.teardown();
    this.handlers.onMatchEnd({
      scoreP1: result.scoreP1,
      scoreP2: result.scoreP2,
      winner: result.winner,
      durationSec: 120,
      reason: result.reason,
    });
  }

  teardown(): void {
    this.active = false;
    this.game.networkMode = 'authority';
    this.buffer.clear();
    this.pendingTaps = [];
    this.presentation = null;
  }

  dispose(): void {
    this.teardown();
  }
}
