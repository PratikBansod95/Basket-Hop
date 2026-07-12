import type { SaveData } from '../platform/types';
import { MpClient, getMpWsUrl } from '../services/mp/client';
import type { MpPlayerInfo, MpServerMessage } from '../../shared/contracts/mp';

export type VersusLobbyActions = {
  getSave: () => SaveData;
  onLocalVersus: () => void;
  /** Online match is starting — keep the MpClient alive and hide lobby. */
  onOnlineMatch: (mp: MpClient, initial?: MpServerMessage) => void;
  onClose: () => void;
};

export class VersusLobby {
  private root: HTMLElement;
  private statusEl: HTMLElement;
  private roomEl: HTMLElement;
  private codeInput: HTMLInputElement;
  private panelConnect: HTMLElement;
  private panelRoom: HTMLElement;
  private mp: MpClient | null = null;
  private nickname = '';
  private pendingAction: (() => void) | null = null;
  private handoff = false;

  constructor(private actions: VersusLobbyActions) {
    this.root = document.getElementById('versus-lobby')!;
    this.statusEl = document.getElementById('versus-lobby-status')!;
    this.roomEl = document.getElementById('versus-lobby-room')!;
    this.codeInput = document.getElementById('versus-join-code') as HTMLInputElement;
    this.panelConnect = document.getElementById('versus-lobby-actions')!;
    this.panelRoom = document.getElementById('versus-lobby-room-panel')!;

    document.getElementById('versus-lobby-close')!.addEventListener('click', () => this.close());
    this.root.addEventListener('click', (e) => {
      if (e.target === this.root) this.close();
    });

    document.getElementById('versus-local-btn')!.addEventListener('click', () => {
      this.close();
      this.actions.onLocalVersus();
    });

    document.getElementById('versus-quick-btn')!.addEventListener('click', () => {
      this.ensureConnected(() => this.mp?.send({ type: 'queue' }));
    });

    document.getElementById('versus-create-btn')!.addEventListener('click', () => {
      this.ensureConnected(() => this.mp?.send({ type: 'create_room' }));
    });

    document.getElementById('versus-join-btn')!.addEventListener('click', () => {
      const code = this.codeInput.value.trim();
      if (code.length < 3) {
        this.setStatus('Enter a 4-letter room code.');
        return;
      }
      this.ensureConnected(() => this.mp?.send({ type: 'join_room', code }));
    });

    document.getElementById('versus-leave-btn')!.addEventListener('click', () => {
      this.mp?.send({ type: 'leave_room' });
      this.mp?.send({ type: 'queue_cancel' });
      this.showActions();
      this.setStatus('Left the lobby.');
    });
  }

  show(): void {
    this.handoff = false;
    this.root.classList.remove('hidden');
    this.showActions();
    const url = getMpWsUrl();
    if (!url) {
      this.setStatus('Online matchmaking needs Railway. You can still play Versus (local).');
    } else {
      this.setStatus('Pick Quick Match, Create, or Join — or play local.');
    }
  }

  close(): void {
    this.pendingAction = null;
    if (!this.handoff) {
      this.mp?.disconnect();
      this.mp = null;
    }
    this.nickname = '';
    this.root.classList.add('hidden');
    this.actions.onClose();
  }

  isOpen(): boolean {
    return !this.root.classList.contains('hidden');
  }

  private ensureConnected(then: () => void): void {
    const save = this.actions.getSave();
    if (!save.nickname || !save.playerId) {
      this.setStatus('Set a nickname first.');
      return;
    }
    if (!getMpWsUrl()) {
      this.setStatus('Set VITE_MP_WS_URL to your Railway WebSocket URL.');
      return;
    }

    if (this.mp?.connected && this.nickname) {
      then();
      return;
    }

    this.pendingAction = then;
    this.setStatus('Connecting to match server…');
    this.mp?.disconnect();
    this.mp = new MpClient({
      onMessage: (message) => this.onMessage(message),
      onClose: () => {
        if (this.handoff) return;
        this.nickname = '';
        this.setStatus('Disconnected from match server.');
        this.showActions();
      },
      onError: (message) => this.setStatus(message),
    });
    this.mp.connect(save.playerId);
  }

  private handoffToMatch(message?: MpServerMessage): void {
    if (!this.mp || this.handoff) return;
    this.handoff = true;
    const client = this.mp;
    this.mp = null;
    this.root.classList.add('hidden');
    this.actions.onOnlineMatch(client, message);
  }

  private onMessage(message: MpServerMessage): void {
    switch (message.type) {
      case 'welcome':
        this.nickname = message.nickname;
        this.setStatus(`Online as ${message.nickname}`);
        if (this.pendingAction) {
          const action = this.pendingAction;
          this.pendingAction = null;
          action();
        }
        break;
      case 'queued':
        this.setStatus('In quick-match queue… waiting for an opponent.');
        break;
      case 'queue_left':
        this.setStatus('Left the queue.');
        break;
      case 'room':
        this.showRoom(message.players, message.code, message.youAreHost);
        break;
      case 'match_countdown':
        this.setStatus(`Match starting in ${message.seconds}…`);
        this.showRoom(message.players, null, false);
        if (message.seconds <= 1) {
          // Keep lobby visible through countdown; handoff on match_start.
        }
        break;
      case 'match_start':
        this.handoffToMatch(message);
        break;
      case 'room_left':
        this.showActions();
        this.setStatus('Left the room.');
        break;
      case 'peer_left':
        this.setStatus(`${message.nickname} left the room.`);
        break;
      case 'error':
        this.setStatus(message.message);
        break;
      case 'pong':
        break;
      default:
        break;
    }
  }

  private showRoom(players: MpPlayerInfo[], code: string | null, youAreHost: boolean): void {
    this.panelConnect.classList.add('hidden');
    this.panelRoom.classList.remove('hidden');
    const names = players.map((p) => `${p.slot === 0 ? 'P1' : 'P2'}: ${p.nickname}`).join(' · ');
    const codeLine = code ? `Code: ${code}` : 'Quick match';
    const hostLine = youAreHost ? 'You are host' : 'Opponent connected';
    this.roomEl.textContent = `${codeLine}\n${names}\n${hostLine}`;
    if (players.length < 2) {
      this.setStatus('Room ready — waiting for a second player.');
    } else {
      this.setStatus('Both players connected — match starting…');
    }
  }

  private showActions(): void {
    this.panelConnect.classList.remove('hidden');
    this.panelRoom.classList.add('hidden');
    this.roomEl.textContent = '';
  }

  private setStatus(text: string): void {
    this.statusEl.textContent = text;
  }
}
