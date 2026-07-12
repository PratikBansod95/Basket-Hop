import type { MpClient } from './client';
import type {
  MpMatchResult,
  MpMatchSnapshot,
  MpPlayerInfo,
  MpServerMessage,
} from '../../../shared/contracts/mp';
import { VersusGame, type VersusPlayerId, type VersusResult } from '../../game/VersusGame';

const SNAPSHOT_HZ = 20;

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
 * Host runs VersusGame and broadcasts snapshots.
 * Guest applies snapshots and only sends taps for their slot.
 */
export class OnlineVersusSession {
  yourSlot: VersusPlayerId = 0;
  youAreHost = false;
  players: MpPlayerInfo[] = [];
  active = false;
  private seq = 0;
  private snapshotTimer: number | null = null;
  private lastSeq = -1;

  constructor(
    private mp: MpClient,
    private game: VersusGame,
    private handlers: OnlineVersusHandlers,
  ) {}

  /** Attach to an existing connected MpClient message stream. */
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
          this.game.handleTap(message.slot);
        }
        return true;
      case 'snapshot':
        if (!this.youAreHost && this.active) {
          this.applyRemoteSnapshot(message.state);
        }
        return true;
      case 'match_end':
        this.endFromNetwork(message.result);
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
    this.seq = 0;
    this.lastSeq = -1;
    this.game.reset();
    this.handlers.onMatchStart({ yourSlot, youAreHost, players });
    if (youAreHost) {
      this.startSnapshotLoop();
    }
  }

  private startSnapshotLoop(): void {
    this.stopSnapshotLoop();
    this.snapshotTimer = window.setInterval(() => {
      if (!this.active || !this.youAreHost) return;
      this.seq += 1;
      this.mp.send({ type: 'snapshot', state: this.game.exportSnapshot(this.seq) });
      if (this.game.phase === 'gameover') {
        // VersusGame already fired onMatchEnd; also publish over net.
      }
    }, 1000 / SNAPSHOT_HZ);
  }

  private stopSnapshotLoop(): void {
    if (this.snapshotTimer !== null) {
      window.clearInterval(this.snapshotTimer);
      this.snapshotTimer = null;
    }
  }

  private applyRemoteSnapshot(state: MpMatchSnapshot): void {
    if (state.seq <= this.lastSeq) return;
    this.lastSeq = state.seq;
    this.game.applySnapshot(state);
  }

  /** Local input — only your ball. Host applies immediately; guest also applies optimistically lightly by sending only. */
  handleLocalTap(): void {
    if (!this.active) return;
    if (this.youAreHost) {
      this.game.handleTap(this.yourSlot);
    } else {
      // Light local prediction: apply tap locally until next authoritative snap overwrites.
      this.game.handleTap(this.yourSlot);
      this.mp.send({ type: 'tap', slot: this.yourSlot });
    }
  }

  /** Host publishes end result after VersusGame callback. */
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
    this.stopSnapshotLoop();
  }

  dispose(): void {
    this.teardown();
  }
}
