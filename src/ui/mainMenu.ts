export class MainMenu {
  private root: HTMLElement;
  private howToRoot: HTMLElement;
  private bestEl: HTMLElement;
  private muteBtn: HTMLButtonElement;
  private onStart: () => void;

  constructor(onStart: () => void, onMuteToggle?: () => void) {
    this.onStart = onStart;
    this.root = document.getElementById('main-menu')!;
    this.howToRoot = document.getElementById('how-to-play')!;
    this.bestEl = this.root.querySelector('#menu-best')!;
    this.muteBtn = this.root.querySelector('#menu-mute-btn') as HTMLButtonElement;

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
  }

  setMuted(muted: boolean): void {
    this.muteBtn.textContent = muted ? '🔇' : '🔊';
    this.muteBtn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
    this.muteBtn.setAttribute('title', muted ? 'Sound off' : 'Sound on');
  }

  show(bestScore: number): void {
    this.bestEl.textContent = `BEST ${bestScore}`;
    this.root.classList.remove('hidden');
  }

  hide(): void {
    this.root.classList.add('hidden');
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
}
