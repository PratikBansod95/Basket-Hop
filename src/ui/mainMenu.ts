export class MainMenu {
  private root: HTMLElement;
  private howToRoot: HTMLElement;
  private bestEl: HTMLElement;
  private onStart: () => void;

  constructor(onStart: () => void) {
    this.onStart = onStart;
    this.root = document.getElementById('main-menu')!;
    this.howToRoot = document.getElementById('how-to-play')!;
    this.bestEl = this.root.querySelector('#menu-best')!;

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
