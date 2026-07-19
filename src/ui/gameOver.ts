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
      <div class="modal result-sheet">
        <header class="result-header">
          <div class="result-emblem" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M8 4h8v3a4 4 0 01-8 0V4z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
              <path d="M6 4H4a2 2 0 002 2M18 4h2a2 2 0 01-2 2M12 11v4M8.5 20h7M10 15h4l1.5 5h-7l1.5-5z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="result-heading">
            <p class="result-kicker">Run complete</p>
            <h2 class="title">Game over</h2>
            <p class="result-subtitle">Every shot takes you higher</p>
          </div>
        </header>
        <div class="result-body">
          <section class="result-score">
            <div class="record-badge${isNewBest ? ' visible' : ''}">
              <span aria-hidden="true">★</span> New personal best
            </div>
            <div class="score-label">Final score</div>
            <div class="score-value">${stats.score}</div>
          </section>
          <div class="stats-grid">
            <div class="result-stat">
              <span class="label">Personal best</span>
              <span class="value">${best}</span>
            </div>
            <div class="result-stat">
              <span class="label">Clean shots</span>
              <span class="value">${cleanPct}%</span>
            </div>
            <div class="result-stat">
              <span class="label">Run coins</span>
              <span class="value">+${runCoins}</span>
            </div>
            <div class="result-stat">
              <span class="label">Coin balance</span>
              <span class="value">${save.coins}</span>
            </div>
          </div>
        </div>
        <footer class="modal-actions">
          <button class="retry-btn" id="retry-btn" type="button">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 8a8 8 0 10.5 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 3v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Play again
          </button>
          <button class="menu-home-btn" id="menu-btn" type="button">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 11l8-7 8 7v9h-6v-6h-4v6H4v-9z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
            </svg>
            Main menu
          </button>
          <button class="cta-btn" id="cta-btn" type="button">
            Play full game
          </button>
        </footer>
      </div>
    `;
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
  }
}
