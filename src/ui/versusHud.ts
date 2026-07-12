export class VersusHud {
  private root: HTMLElement;
  private timerEl: HTMLElement;
  private p1El: HTMLElement;
  private p2El: HTMLElement;
  private hintEl: HTMLElement;
  private lastTimer = '';
  private lastP1 = -1;
  private lastP2 = -1;

  constructor(rootId = 'versus-hud') {
    this.root = document.getElementById(rootId)!;
    this.root.innerHTML = `
      <div class="versus-hud">
        <div class="versus-hud-scores">
          <div class="versus-hud-player versus-hud-player--p1">
            <span class="versus-hud-tag">P1</span>
            <span class="versus-hud-score" id="versus-score-p1">0</span>
          </div>
          <div class="versus-hud-timer" id="versus-timer">2:00</div>
          <div class="versus-hud-player versus-hud-player--p2">
            <span class="versus-hud-tag">P2</span>
            <span class="versus-hud-score" id="versus-score-p2">0</span>
          </div>
        </div>
        <div class="versus-hud-hint" id="versus-hint">Left tap = P1 · Right tap = P2</div>
      </div>
    `;
    this.timerEl = this.root.querySelector('#versus-timer')!;
    this.p1El = this.root.querySelector('#versus-score-p1')!;
    this.p2El = this.root.querySelector('#versus-score-p2')!;
    this.hintEl = this.root.querySelector('#versus-hint')!;
    this.hide();
  }

  show(): void {
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
  }

  update(scoreP1: number, scoreP2: number, timeLeft: number, phase: string, anyLaunched: boolean): void {
    const inGame = phase !== 'menu';
    if (!inGame) {
      this.hide();
      return;
    }
    this.show();

    if (scoreP1 !== this.lastP1) {
      this.p1El.textContent = String(scoreP1);
      this.lastP1 = scoreP1;
    }
    if (scoreP2 !== this.lastP2) {
      this.p2El.textContent = String(scoreP2);
      this.lastP2 = scoreP2;
    }

    const secs = Math.max(0, Math.ceil(timeLeft));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const label = `${m}:${s.toString().padStart(2, '0')}`;
    if (label !== this.lastTimer) {
      this.timerEl.textContent = label;
      this.timerEl.classList.toggle('is-low', secs <= 10);
      this.lastTimer = label;
    }

    this.hintEl.style.display = anyLaunched ? 'none' : 'block';
  }
}
