export class MainMenu {
  private root: HTMLElement;
  private howToRoot: HTMLElement;
  private bestEl: HTMLElement;
  private coinsEl: HTMLElement;
  private muteBtn: HTMLButtonElement;
  private toastEl: HTMLElement;
  private toastTimer = 0;
  private onStart: () => void;

  constructor(onStart: () => void, onMuteToggle?: () => void) {
    this.onStart = onStart;
    this.root = document.getElementById('main-menu')!;
    this.howToRoot = document.getElementById('how-to-play')!;
    this.bestEl = this.root.querySelector('#menu-best-score')!;
    this.coinsEl = this.root.querySelector('#menu-coins')!;
    this.muteBtn = this.root.querySelector('#menu-mute-btn') as HTMLButtonElement;
    this.toastEl = this.root.querySelector('#menu-toast')!;

    this.root.querySelector('#start-btn')!.addEventListener('click', () => {
      this.hideHowTo();
      this.hide();
      this.onStart();
    });

    this.root.querySelector('#howto-btn')!.addEventListener('click', () => {
      this.showHowTo();
    });

    this.howToRoot.querySelector('#howto-close-btn')!.addEventListener('click', () => {
      this.hideHowTo();
    });

    this.howToRoot.addEventListener('click', (e) => {
      if (e.target === this.howToRoot) this.hideHowTo();
    });

    this.muteBtn.addEventListener('click', () => {
      onMuteToggle?.();
    });

    this.root.querySelector('#dock-leaderboard')!.addEventListener('click', () => {
      this.showToast('Leaderboards coming soon');
    });

    this.root.querySelector('#dock-achievements')!.addEventListener('click', () => {
      this.showToast('Achievements coming soon');
    });

    this.root.querySelector('#dock-settings')!.addEventListener('click', () => {
      this.showToast('Settings coming soon');
    });

    this.root.querySelector('#dock-rate')!.addEventListener('click', () => {
      this.showToast('Thanks for playing Basket Hop!');
    });
  }

  setMuted(muted: boolean): void {
    this.muteBtn.classList.toggle('is-muted', muted);
    this.muteBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
    this.muteBtn.setAttribute('title', muted ? 'Sound off' : 'Sound on');
  }

  show(bestScore: number, coins: number): void {
    this.bestEl.textContent = String(bestScore);
    this.coinsEl.textContent = String(coins);
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
    this.hideToast();
  }

  isVisible(): boolean {
    return !this.root.classList.contains('hidden');
  }

  showHowTo(): void {
    this.howToRoot.classList.remove('hidden');
  }

  hideHowTo(): void {
    this.howToRoot.classList.add('hidden');
  }

  private showToast(message: string): void {
    this.toastEl.textContent = message;
    this.toastEl.classList.remove('hidden');
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.hideToast(), 2200);
  }

  private hideToast(): void {
    this.toastEl.classList.add('hidden');
  }
}
