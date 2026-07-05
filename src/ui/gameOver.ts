import { getCleanPercent } from '../game/scoring';
import type { RunStats } from '../game/types';
import type { SaveData } from '../platform/types';

export class GameOverModal {
  private root: HTMLElement;
  private onRetry: () => void;
  private onMainMenu: () => void;
  private onExit?: () => void;

  constructor(onRetry: () => void, onMainMenu: () => void, onExit?: () => void) {
    this.onRetry = onRetry;
    this.onMainMenu = onMainMenu;
    this.onExit = onExit;
    this.root = document.getElementById('game-over')!;
    this.root.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.id === 'retry-btn' || target.closest('#retry-btn')) {
        this.hide();
        this.onRetry();
      }
      if (target.id === 'menu-btn' || target.closest('#menu-btn')) {
        this.hide();
        this.onMainMenu();
      }
      if (target.id === 'cta-btn' || target.closest('#cta-btn')) {
        this.onExit?.();
      }
    });
  }

  setAdsMode(enabled: boolean): void {
    this.root.classList.toggle('ads-mode', enabled);
  }

  show(stats: RunStats, save: SaveData, runCoins: number): void {
    const cleanPct = getCleanPercent(stats);
    const best = Math.max(save.best, stats.score);
    const isNewBest = stats.score >= save.best && stats.score > 0;
    this.root.innerHTML = `
      <div class="modal ui-panel">
        <div class="title">Game over</div>
        <div class="record-badge${isNewBest ? ' visible' : ''}">New best</div>
        <div class="score-label">Final score</div>
        <div class="score-value">${stats.score}</div>
        <div class="stats-grid">
          <div class="ui-stat-chip">
            <span class="label">Best</span>
            <span class="value">${best}</span>
          </div>
          <div class="ui-stat-chip">
            <span class="label">Clean</span>
            <span class="value">${cleanPct}%</span>
          </div>
          <div class="ui-stat-chip">
            <span class="label">Run coins</span>
            <span class="value">${runCoins}</span>
          </div>
          <div class="ui-stat-chip">
            <span class="label">Wallet</span>
            <span class="value">${save.coins}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="retry-btn" id="retry-btn" type="button">Retry</button>
          <button class="menu-home-btn" id="menu-btn" type="button">Main menu</button>
          <button class="cta-btn" id="cta-btn" type="button">Play full game</button>
        </div>
      </div>
    `;
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
  }
}
