import { ApiClientError } from '../services/api/client';
import { registerPlayer } from '../services/api/players';
import type { SaveData } from '../platform/types';

export type NicknameGateCallbacks = {
  getSave: () => SaveData;
  onRegistered: (playerId: string, nickname: string) => void;
};

export class NicknameGate {
  private root: HTMLElement;
  private input: HTMLInputElement;
  private errorEl: HTMLElement;
  private countEl: HTMLElement;
  private submitBtn: HTMLButtonElement;
  private callbacks: NicknameGateCallbacks;
  private open = false;

  constructor(callbacks: NicknameGateCallbacks) {
    this.callbacks = callbacks;
    this.root = document.getElementById('nickname-screen')!;
    this.input = document.getElementById('nicknameInput') as HTMLInputElement;
    this.errorEl = document.getElementById('nicknameError')!;
    this.countEl = document.getElementById('nicknameCount')!;
    this.submitBtn = document.getElementById('nicknameSubmit') as HTMLButtonElement;

    this.submitBtn.addEventListener('click', () => {
      void this.submit();
    });
    this.input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      void this.submit();
    });
    this.input.addEventListener('input', () => {
      this.setError('');
      this.updateCount();
    });
  }

  needsNickname(save: SaveData): boolean {
    return save.nickname.trim().length === 0;
  }

  isOpen(): boolean {
    return this.open;
  }

  show(initialNickname = ''): void {
    this.open = true;
    this.input.value = initialNickname;
    this.updateCount();
    this.setError('');
    this.setPending(false);
    this.root.classList.remove('hidden');
    window.setTimeout(() => {
      this.input.focus();
      this.input.select();
    }, 0);
  }

  hide(): void {
    this.open = false;
    this.root.classList.add('hidden');
    this.setPending(false);
  }

  private setError(message: string): void {
    this.errorEl.textContent = message;
    this.errorEl.classList.toggle('hidden', message.length === 0);
  }

  private updateCount(): void {
    this.countEl.textContent = `${this.input.value.length} / ${this.input.maxLength}`;
  }

  private setPending(pending: boolean): void {
    this.input.disabled = pending;
    this.submitBtn.disabled = pending;
    this.submitBtn.textContent = pending ? 'Saving...' : 'Save and play';
  }

  private async submit(): Promise<void> {
    const save = this.callbacks.getSave();
    this.setPending(true);
    this.setError('');

    try {
      const response = await registerPlayer({
        playerId: save.playerId,
        nickname: this.input.value,
        localBestScore: save.best,
        localBestLogs: save.best,
      });
      this.callbacks.onRegistered(response.player.playerId, response.player.nickname);
      this.hide();
    } catch (error) {
      let message = 'Could not save your nickname right now.';
      if (error instanceof ApiClientError && error.statusCode === 409 && error.field === 'nickname') {
        message = 'That nickname is already taken. Try a different one.';
        this.input.focus();
        this.input.select();
      } else if (error instanceof Error) {
        message = error.message;
      }
      this.setError(message);
    } finally {
      this.setPending(false);
    }
  }
}
