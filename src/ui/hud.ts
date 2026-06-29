import type { RunStats } from '../game/types';

export class Hud {
  private root: HTMLElement;
  private scoreEl: HTMLElement;
  private scoreWrap: HTMLElement;
  private levelEl: HTMLElement;
  private streakEl: HTMLElement;
  private hintEl: HTMLElement;

  constructor(rootId = 'hud') {
    this.root = document.getElementById(rootId)!;
    this.root.innerHTML = `
      <div class="hud-bar">
        <div class="hud-score-wrap" id="score-wrap">
          <div class="hud-score-inner">
            <span class="hud-label">SCORE</span>
            <span class="hud-score" id="score-pill">0</span>
          </div>
        </div>
        <div class="level-badge" id="level-badge">
          <span class="hud-label">LEVEL</span>
          <span class="level-value" id="level-value">1</span>
        </div>
      </div>
      <div class="streak-badge" id="streak-badge">
        <span class="streak-icon">🔥</span>
        <span id="streak-text">HOT x2</span>
      </div>
      <div class="hint-pill" id="hint-pill">
        <span class="hint-icon">👆</span>
        <span class="hint-text" id="hint">TAP TO GO UP</span>
      </div>
    `;
    this.scoreWrap = this.root.querySelector('#score-wrap')!;
    this.scoreEl = this.root.querySelector('#score-pill')!;
    this.levelEl = this.root.querySelector('#level-value')!;
    this.streakEl = this.root.querySelector('#streak-badge')!;
    this.hintEl = this.root.querySelector('#hint-pill')!;
  }

  update(stats: RunStats, phase: string, ballLaunched: boolean): void {
    const inGame = phase !== 'menu';
    this.root.style.display = inGame ? 'block' : 'none';
    if (!inGame) return;

    this.scoreEl.textContent = String(stats.score);
    this.levelEl.textContent = String(stats.level + 1);

    const streakText = this.root.querySelector('#streak-text')!;
    if (stats.combo >= 2) {
      this.scoreWrap.classList.add('hot');
      streakText.textContent = `HOT x${stats.combo}`;
      this.streakEl.classList.add('visible');
    } else {
      this.scoreWrap.classList.remove('hot');
      this.streakEl.classList.remove('visible');
    }

    const showHint = phase === 'idle' || (phase === 'playing' && !ballLaunched);
    this.hintEl.style.display = showHint ? 'inline-flex' : 'none';
    if (showHint) {
      const hintText = this.hintEl.querySelector('#hint')!;
      hintText.textContent = stats.hasScoredOnce ? 'TAP TO CLIMB' : 'TAP TO GO UP';
    }
  }
}
