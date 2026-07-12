import type { SaveData } from '../platform/types';

function cleanPercent(save: SaveData): string {
  if (save.totalShots <= 0) return '—';
  return `${Math.round((save.cleanShots / save.totalShots) * 100)}%`;
}

export class MainMenu {
  private root: HTMLElement;
  private howToRoot: HTMLElement;
  private statsRoot: HTMLElement;
  private infoRoot: HTMLElement;
  private settingsRoot: HTMLElement;
  private bestEl: HTMLElement;
  private coinsEl: HTMLElement;
  private topCoinsEl: HTMLElement;
  private settingsBtn: HTMLButtonElement;
  private soundToggleBtn: HTMLButtonElement;
  private soundToggleText: HTMLElement;
  private statsBestEl: HTMLElement;
  private statsCoinsEl: HTMLElement;
  private statsGamesEl: HTMLElement;
  private statsCleanEl: HTMLElement;
  private onStart: () => void;
  private onMuteToggle: (() => void) | null = null;
  private onOpenSkinsShop: (() => void) | null = null;
  private muted = false;

  constructor(onStart: () => void, onMuteToggle?: () => void, onOpenSkinsShop?: () => void) {
    this.onStart = onStart;
    this.onMuteToggle = onMuteToggle ?? null;
    this.onOpenSkinsShop = onOpenSkinsShop ?? null;
    this.root = document.getElementById('main-menu')!;
    this.howToRoot = document.getElementById('how-to-play')!;
    this.statsRoot = document.getElementById('menu-stats')!;
    this.infoRoot = document.getElementById('menu-info')!;
    this.settingsRoot = document.getElementById('menu-settings')!;
    this.bestEl = this.root.querySelector('#menu-best-score')!;
    this.coinsEl = this.root.querySelector('#menu-coins')!;
    this.topCoinsEl = this.root.querySelector('#menu-top-coins')!;
    this.settingsBtn = this.root.querySelector('#menu-settings-btn') as HTMLButtonElement;
    this.soundToggleBtn = document.getElementById('menu-sound-toggle') as HTMLButtonElement;
    this.soundToggleText = document.getElementById('menu-sound-toggle-text')!;
    this.statsBestEl = document.getElementById('stats-best')!;
    this.statsCoinsEl = document.getElementById('stats-coins')!;
    this.statsGamesEl = document.getElementById('stats-games')!;
    this.statsCleanEl = document.getElementById('stats-clean')!;

    this.root.querySelector('#start-btn')!.addEventListener('click', () => {
      this.closeAllModals();
      this.hide();
      this.onStart();
    });

    this.howToRoot.querySelector('#howto-close-btn')!.addEventListener('click', () => {
      this.hideHowTo();
    });

    this.howToRoot.addEventListener('click', (e) => {
      if (e.target === this.howToRoot) this.hideHowTo();
    });

    this.statsRoot.querySelector('#stats-close-btn')!.addEventListener('click', () => {
      this.hideStats();
    });

    this.statsRoot.addEventListener('click', (e) => {
      if (e.target === this.statsRoot) this.hideStats();
    });

    this.infoRoot.querySelector('#menu-info-close-btn')!.addEventListener('click', () => {
      this.hideInfo();
    });

    this.infoRoot.addEventListener('click', (e) => {
      if (e.target === this.infoRoot) this.hideInfo();
    });

    this.settingsRoot.querySelector('#menu-settings-close-btn')!.addEventListener('click', () => {
      this.hideSettings();
    });

    this.settingsRoot.addEventListener('click', (e) => {
      if (e.target === this.settingsRoot) this.hideSettings();
    });

    this.settingsBtn.addEventListener('click', () => {
      this.showSettings();
    });

    this.soundToggleBtn.addEventListener('click', () => {
      this.onMuteToggle?.();
    });

    this.root.querySelector('#menu-shop-btn')!.addEventListener('click', () => {
      this.closeAllModals();
      this.onOpenSkinsShop?.();
    });

    this.root.querySelector('#dock-howto')!.addEventListener('click', () => {
      this.showHowTo();
    });

    this.root.querySelector('#dock-stats')!.addEventListener('click', () => {
      this.showStats();
    });
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.settingsBtn.classList.toggle('is-muted', muted);
    this.settingsBtn.setAttribute('aria-label', muted ? 'Settings — sound is off' : 'Settings');
    this.settingsBtn.setAttribute('title', 'Settings');

    this.soundToggleBtn.classList.toggle('is-off', muted);
    this.soundToggleBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
    this.soundToggleText.textContent = muted ? 'Off' : 'On';
  }

  show(save: SaveData): void {
    const wallet = String(save.coins);
    const best = String(save.best);
    this.bestEl.textContent = best;
    this.coinsEl.textContent = wallet;
    this.topCoinsEl.textContent = wallet;
    this.statsBestEl.textContent = best;
    this.statsCoinsEl.textContent = wallet;
    this.statsGamesEl.textContent = String(save.totalGames);
    this.statsCleanEl.textContent = cleanPercent(save);
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
    this.closeAllModals();
  }

  isVisible(): boolean {
    return !this.root.classList.contains('hidden');
  }

  showHowTo(): void {
    this.hideStats();
    this.hideInfo();
    this.hideSettings();
    this.howToRoot.classList.remove('hidden');
  }

  hideHowTo(): void {
    this.howToRoot.classList.add('hidden');
  }

  private showStats(): void {
    this.hideHowTo();
    this.hideInfo();
    this.hideSettings();
    this.statsRoot.classList.remove('hidden');
  }

  private hideStats(): void {
    this.statsRoot.classList.add('hidden');
  }

  private hideInfo(): void {
    this.infoRoot.classList.add('hidden');
  }

  private showSettings(): void {
    this.hideHowTo();
    this.hideStats();
    this.hideInfo();
    this.setMuted(this.muted);
    this.settingsRoot.classList.remove('hidden');
  }

  private hideSettings(): void {
    this.settingsRoot.classList.add('hidden');
  }

  private closeAllModals(): void {
    this.hideHowTo();
    this.hideStats();
    this.hideInfo();
    this.hideSettings();
  }

  refreshWallet(save: SaveData): void {
    const wallet = String(save.coins);
    this.coinsEl.textContent = wallet;
    this.topCoinsEl.textContent = wallet;
    this.statsCoinsEl.textContent = wallet;
  }
}
