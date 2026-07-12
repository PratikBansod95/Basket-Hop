const COIN_ASSET = '/assets/coin.png';

let coinImage: HTMLImageElement | null = null;
let coinReady = false;
let preloadStarted = false;

export function preloadCoinAsset(): Promise<void> {
  if (typeof Image === 'undefined') return Promise.resolve();
  if (coinReady && coinImage) return Promise.resolve();
  if (preloadStarted && coinImage) {
    return new Promise((resolve) => {
      if (coinReady) {
        resolve();
        return;
      }
      coinImage!.addEventListener('load', () => resolve(), { once: true });
      coinImage!.addEventListener('error', () => resolve(), { once: true });
    });
  }

  preloadStarted = true;
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      coinImage = img;
      coinReady = true;
      resolve();
    };
    img.onerror = () => {
      console.warn('Failed to load coin asset');
      resolve();
    };
    img.src = COIN_ASSET;
    coinImage = img;
  });
}

export function getCoinImage(): HTMLImageElement | null {
  return coinReady && coinImage && coinImage.naturalWidth > 0 ? coinImage : null;
}

/** Mario-style Y-axis spin: face scales on X through a thin edge. */
export function drawCoin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  phase: number,
): void {
  const bob = Math.sin(time * 3.4 + phase) * 5;
  const spin = Math.cos(time * 7.2 + phase);
  const scaleX = Math.max(0.12, Math.abs(spin));
  const drawY = y + bob;

  ctx.save();
  ctx.translate(x, drawY);

  // Soft ground blob
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.85, radius * 0.7 * scaleX, radius * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.scale(scaleX, 1);

  const img = getCoinImage();
  if (img) {
    const size = radius * 2.15;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  } else {
    drawFallbackCoin(ctx, radius);
  }

  // Edge glint when nearly side-on
  if (scaleX < 0.35) {
    ctx.fillStyle = 'rgba(255, 236, 160, 0.55)';
    ctx.fillRect(-radius * 0.08, -radius * 0.9, radius * 0.16, radius * 1.8);
  }

  ctx.restore();
}

function drawFallbackCoin(ctx: CanvasRenderingContext2D, radius: number): void {
  const grad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  grad.addColorStop(0, '#fff2b5');
  grad.addColorStop(0.4, '#ffd166');
  grad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = Math.max(2, radius * 0.1);
  ctx.strokeStyle = 'rgba(135, 74, 5, 0.75)';
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.62, 0, Math.PI * 2);
  ctx.stroke();
}
