export function initMuteButton(
  onToggle: (muted: boolean) => void,
  getMuted: () => boolean,
): HTMLButtonElement {
  const btn = document.getElementById('mute-btn') as HTMLButtonElement;
  const update = () => {
    const muted = getMuted();
    btn.textContent = muted ? '🔇' : '🔊';
    btn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
    btn.setAttribute('title', muted ? 'Sound off' : 'Sound on');
  };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    onToggle(!getMuted());
    update();
  });
  update();
  return btn;
}
