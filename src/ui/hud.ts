import type { RunStats, StaminaState } from '../game/types';
import { CLIMB_PER_BASKET } from '../game/constants';
import { getZoneProgress } from '../game/zones';

export class Hud {
  private root: HTMLElement;
  private scoreEl: HTMLElement;
  private scoreWrap: HTMLElement;
  private zoneLabelEl: HTMLElement;
  private zoneTitleEl: HTMLElement;
  private zoneProgressFillEl: HTMLElement;
  private zoneNextEl: HTMLElement;
  private zoneUnlockEl: HTMLElement;
  private coinsEl: HTMLElement;
  private coinMeterEl: HTMLElement;
  private streakEl: HTMLElement;
  private hintEl: HTMLElement;
  private staminaEl: HTMLElement;
  private staminaFillEl: HTMLElement;
  private staminaValueEl: HTMLElement;
  private lastScore = -1;
  private lastCoins = -1;
  private lastZoneTitle = '';
  private lastStaminaPct = -1;

  constructor(rootId = 'hud') {
    this.root = document.getElementById(rootId)!;
    this.root.innerHTML = `
      <div class="hud-bar">
        <div class="hud-zone-label" id="zone-label" aria-hidden="true">
          <span class="hud-zone-title" id="zone-title"></span>
          <span class="hud-zone-progress"><span id="zone-progress-fill"></span></span>
          <span class="hud-zone-next" id="zone-next"></span>
        </div>
        <div class="hud-score-wrap" id="score-wrap">
          <span class="hud-score-label">Score</span>
          <span class="hud-score" id="score-pill">0</span>
        </div>
      </div>
      <div class="hud-zone-unlock" id="zone-unlock" aria-live="polite"></div>
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
        <span class="hint-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 19V6M7 11l5-5 5 5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="hint-text" id="hint">Tap anywhere to play</span>
      </div>
    `;
    this.scoreWrap = this.root.querySelector('#score-wrap')!;
    this.scoreEl = this.root.querySelector('#score-pill')!;
    this.zoneLabelEl = this.root.querySelector('#zone-label')!;
    this.zoneTitleEl = this.root.querySelector('#zone-title')!;
    this.zoneProgressFillEl = this.root.querySelector('#zone-progress-fill')!;
    this.zoneNextEl = this.root.querySelector('#zone-next')!;
    this.zoneUnlockEl = this.root.querySelector('#zone-unlock')!;
    this.coinsEl = this.root.querySelector('#coin-count')!;
    this.coinMeterEl = this.root.querySelector('#coin-meter')!;
    this.streakEl = this.root.querySelector('#streak-badge')!;
    this.hintEl = this.root.querySelector('#hint-pill')!;
    this.staminaEl = this.root.querySelector('#stamina-meter')!;
    this.staminaFillEl = this.root.querySelector('#stamina-fill')!;
    this.staminaValueEl = this.root.querySelector('#stamina-value')!;
    this.zoneUnlockEl.addEventListener('animationend', () => {
      this.zoneUnlockEl.classList.remove('visible');
    });
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

    if (runCoins !== this.lastCoins) {
      if (this.lastCoins >= 0 && runCoins > this.lastCoins) {
        this.coinMeterEl.classList.remove('bump');
        void this.coinMeterEl.offsetWidth;
        this.coinMeterEl.classList.add('bump');
      }
      this.lastCoins = runCoins;
      this.coinsEl.textContent = String(runCoins);
    }

    const zoneProgress = getZoneProgress(stats.level);
    const zoneTitle = zoneProgress.current.title;
    if (zoneTitle !== this.lastZoneTitle) {
      if (this.lastZoneTitle) {
        this.zoneUnlockEl.textContent = `New altitude · ${zoneTitle}`;
        this.zoneUnlockEl.classList.remove('visible');
        void this.zoneUnlockEl.offsetWidth;
        this.zoneUnlockEl.classList.add('visible');
      }
      this.lastZoneTitle = zoneTitle;
    }
    this.zoneTitleEl.textContent =
      `${zoneTitle} · ${Math.round(stats.level * CLIMB_PER_BASKET).toLocaleString()}m`;
    this.zoneProgressFillEl.style.width = `${Math.round(zoneProgress.progress * 100)}%`;
    this.zoneNextEl.textContent = zoneProgress.next
      ? `Next ${zoneProgress.next.title} · ${Math.max(0, Math.ceil(zoneProgress.next.startLevel - stats.level))}`
      : 'Endless altitude';
    this.zoneLabelEl.classList.add('visible');

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
      const pct = Math.round(ratio * 100);
      if (pct !== this.lastStaminaPct) {
        this.lastStaminaPct = pct;
        this.staminaFillEl.style.width = `${pct}%`;
        this.staminaValueEl.textContent = `${pct}%`;
      }
      this.staminaEl.classList.toggle('low', ratio <= 0.35);
      this.staminaEl.classList.toggle('blocked', stamina.blockedFeedback > 0);
    } else {
      this.staminaEl.classList.remove('low', 'blocked', 'intro');
      if (this.lastStaminaPct !== 100) {
        this.lastStaminaPct = 100;
        this.staminaFillEl.style.width = '100%';
        this.staminaValueEl.textContent = '100%';
      }
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
