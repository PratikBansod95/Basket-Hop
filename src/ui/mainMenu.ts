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
  private bestEl: HTMLElement;
  private coinsEl: HTMLElement;
  private topCoinsEl: HTMLElement;
  private settingsBtn: HTMLButtonElement;
  private statsBestEl: HTMLElement;
  private statsCoinsEl: HTMLElement;
  private statsGamesEl: HTMLElement;
  private statsCleanEl: HTMLElement;
  private infoTitleEl: HTMLElement;
  private infoTextEl: HTMLElement;
  private onStart: () => void;
  private onOpenSkinsShop: (() => void) | null = null;

  constructor(onStart: () => void, onMuteToggle?: () => void, onOpenSkinsShop?: () => void) {
    this.onStart = onStart;
    this.onOpenSkinsShop = onOpenSkinsShop ?? null;
    this.root = document.getElementById('main-menu')!;
    this.howToRoot = document.getElementById('how-to-play')!;
    this.statsRoot = document.getElementById('menu-stats')!;
    this.infoRoot = document.getElementById('menu-info')!;
    this.bestEl = this.root.querySelector('#menu-best-score')!;
    this.coinsEl = this.root.querySelector('#menu-coins')!;
    this.topCoinsEl = this.root.querySelector('#menu-top-coins')!;
    this.settingsBtn = this.root.querySelector('#menu-settings-btn') as HTMLButtonElement;
    this.statsBestEl = document.getElementById('stats-best')!;
    this.statsCoinsEl = document.getElementById('stats-coins')!;
    this.statsGamesEl = document.getElementById('stats-games')!;
    this.statsCleanEl = document.getElementById('stats-clean')!;
    this.infoTitleEl = document.getElementById('menu-info-title')!;
    this.infoTextEl = document.getElementById('menu-info-text')!;

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

    this.settingsBtn.addEventListener('click', () => {
      onMuteToggle?.();
    });

    this.root.querySelector('#menu-coin-shop-btn')!.addEventListener('click', () => {
      this.closeAllModals();
      this.onOpenSkinsShop?.();
    });

    this.root.querySelector('#dock-howto')!.addEventListener('click', () => {
      this.showHowTo();
    });

    this.root.querySelector('#dock-stats')!.addEventListener('click', () => {
      this.showStats();
    });

    this.root.querySelector('#dock-achievements')!.addEventListener('click', () => {
      this.showInfo('Achievements', 'Daily challenges and milestone badges are on the way. Keep climbing!');
    });

    this.root.querySelector('#dock-rate')!.addEventListener('click', () => {
      this.showInfo('Rate Basket Hop', 'Thanks for playing! A store link will appear here when the game ships.');
    });
  }

  setMuted(muted: boolean): void {
    this.settingsBtn.classList.toggle('is-muted', muted);
    this.settingsBtn.setAttribute(
      'aria-label',
      muted ? 'Sound off — tap to unmute' : 'Sound on — tap to mute',
    );
    this.settingsBtn.setAttribute('title', muted ? 'Sound off' : 'Sound on');
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
    this.howToRoot.classList.remove('hidden');
  }

  hideHowTo(): void {
    this.howToRoot.classList.add('hidden');
  }

  private showStats(): void {
    this.hideHowTo();
    this.hideInfo();
    this.statsRoot.classList.remove('hidden');
  }

  private hideStats(): void {
    this.statsRoot.classList.add('hidden');
  }

  private showInfo(title: string, message: string): void {
    this.hideHowTo();
    this.hideStats();
    this.infoTitleEl.textContent = title;
    this.infoTextEl.textContent = message;
    this.infoRoot.classList.remove('hidden');
  }

  private hideInfo(): void {
    this.infoRoot.classList.add('hidden');
  }

  private closeAllModals(): void {
    this.hideHowTo();
    this.hideStats();
    this.hideInfo();
  }

  refreshWallet(save: SaveData): void {
    const wallet = String(save.coins);
    this.coinsEl.textContent = wallet;
    this.topCoinsEl.textContent = wallet;
    this.statsCoinsEl.textContent = wallet;
  }
}
