import type { RunStats, StaminaState } from '../game/types';
import { getActiveZoneTitle, getZoneLabelOpacity } from '../game/zones';

export class Hud {
  private root: HTMLElement;
  private scoreEl: HTMLElement;
  private scoreWrap: HTMLElement;
  private zoneLabelEl: HTMLElement;
  private coinsEl: HTMLElement;
  private streakEl: HTMLElement;
  private hintEl: HTMLElement;
  private staminaEl: HTMLElement;
  private staminaFillEl: HTMLElement;
  private staminaValueEl: HTMLElement;
  private lastScore = -1;

  constructor(rootId = 'hud') {
    this.root = document.getElementById(rootId)!;
    this.root.innerHTML = `
      <div class="hud-bar">
        <div class="hud-score-wrap" id="score-wrap">
          <span class="hud-score" id="score-pill">0</span>
        </div>
        <div class="hud-zone-label" id="zone-label" aria-hidden="true"></div>
      </div>
      <div class="coin-meter" id="coin-meter">
        <span class="coin-meter-icon" aria-hidden="true"></span>
        <span class="coin-meter-value" id="coin-count">0</span>
      </div>
      <div class="streak-badge" id="streak-badge">
        <span class="streak-icon" aria-hidden="true"></span>
        <span id="streak-text">Hot x2</span>
      </div>
      <div class="stamina-meter" id="stamina-meter">
        <div class="stamina-meter-header">
          <span class="stamina-label">Stamina</span>
          <span class="stamina-value" id="stamina-value">100%</span>
        </div>
        <div class="stamina-track">
          <div class="stamina-fill" id="stamina-fill"></div>
        </div>
      </div>
      <div class="hint-pill" id="hint-pill">
        <span class="hint-text" id="hint">Tap anywhere to play</span>
      </div>
    `;
    this.scoreWrap = this.root.querySelector('#score-wrap')!;
    this.scoreEl = this.root.querySelector('#score-pill')!;
    this.zoneLabelEl = this.root.querySelector('#zone-label')!;
    this.coinsEl = this.root.querySelector('#coin-count')!;
    this.streakEl = this.root.querySelector('#streak-badge')!;
    this.hintEl = this.root.querySelector('#hint-pill')!;
    this.staminaEl = this.root.querySelector('#stamina-meter')!;
    this.staminaFillEl = this.root.querySelector('#stamina-fill')!;
    this.staminaValueEl = this.root.querySelector('#stamina-value')!;
  }

  update(
    stats: RunStats,
    phase: string,
    ballLaunched: boolean,
    tutorialPrompt: string | null = null,
    stamina: StaminaState | null = null,
    runCoins = 0,
    staminaIntroActive = false,
  ): void {
    const inGame = phase !== 'menu';
    this.root.style.display = inGame ? 'block' : 'none';
    if (!inGame) return;

    if (stats.score !== this.lastScore) {
      this.scoreEl.textContent = String(stats.score);
      if (this.lastScore >= 0 && stats.score > this.lastScore) {
        this.scoreWrap.classList.remove('bump');
        void this.scoreWrap.offsetWidth;
        this.scoreWrap.classList.add('bump');
      }
      this.lastScore = stats.score;
    }

    this.coinsEl.textContent = String(runCoins);

    const zoneOpacity = getZoneLabelOpacity(stats.level);
    if (zoneOpacity > 0.02) {
      this.zoneLabelEl.textContent = getActiveZoneTitle(stats.level);
      this.zoneLabelEl.style.opacity = String(zoneOpacity);
      this.zoneLabelEl.classList.add('visible');
    } else {
      this.zoneLabelEl.style.opacity = '0';
      this.zoneLabelEl.classList.remove('visible');
    }

    const streakText = this.root.querySelector('#streak-text')!;
    if (stats.combo >= 2) {
      this.scoreWrap.classList.add('hot');
      streakText.textContent = `Hot x${stats.combo}`;
      this.streakEl.classList.add('visible');
    } else {
      this.scoreWrap.classList.remove('hot');
      this.streakEl.classList.remove('visible');
    }

    const showStamina = !!stamina?.active;
    this.staminaEl.classList.toggle('visible', showStamina);
    this.staminaEl.classList.toggle('intro', showStamina && staminaIntroActive);
    if (stamina) {
      const ratio = Math.max(0, Math.min(1, stamina.current / stamina.max));
      this.staminaFillEl.style.width = `${ratio * 100}%`;
      this.staminaValueEl.textContent = `${Math.round(ratio * 100)}%`;
      this.staminaEl.classList.toggle('low', ratio <= 0.35);
      this.staminaEl.classList.toggle('blocked', stamina.blockedFeedback > 0);
    } else {
      this.staminaEl.classList.remove('low', 'blocked', 'intro');
      this.staminaFillEl.style.width = '100%';
      this.staminaValueEl.textContent = '100%';
    }

    const showHint = !!tutorialPrompt || phase === 'idle' || (phase === 'playing' && !ballLaunched);
    this.hintEl.style.display = showHint ? 'inline-flex' : 'none';
    this.hintEl.classList.toggle('tutorial-prompt', !!tutorialPrompt);
    if (showHint) {
      const hintText = this.hintEl.querySelector('#hint')!;
      hintText.textContent = tutorialPrompt ?? (stats.hasScoredOnce ? 'Tap to climb' : 'Tap anywhere to play');
    }
  }
}
