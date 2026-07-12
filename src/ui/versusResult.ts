import type { VersusResult } from '../game/VersusGame';

export class VersusResultModal {
  private root: HTMLElement;
  private titleEl: HTMLElement;
  private scoreEl: HTMLElement;

  constructor(
    private onRematch: () => void,
    private onMenu: () => void,
  ) {
    this.root = document.getElementById('versus-result')!;
    this.titleEl = document.getElementById('versus-result-title')!;
    this.scoreEl = document.getElementById('versus-result-score')!;
    document.getElementById('versus-rematch-btn')!.addEventListener('click', () => this.onRematch());
    document.getElementById('versus-menu-btn')!.addEventListener('click', () => this.onMenu());
  }

  show(
    result: VersusResult,
    labels?: { p1: string; p2: string; forfeit?: boolean },
  ): void {
    const p1 = labels?.p1 ?? 'P1';
    const p2 = labels?.p2 ?? 'P2';
    let title =
      result.winner === 'draw' ? 'Draw!' : result.winner === 'p1' ? `${p1} wins!` : `${p2} wins!`;
    if (labels?.forfeit && result.winner !== 'draw') {
      title = `${result.winner === 'p1' ? p1 : p2} wins — opponent left`;
    }
    this.titleEl.textContent = title;
    this.scoreEl.textContent = `${result.scoreP1} – ${result.scoreP2}`;
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
  }
}
