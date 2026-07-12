import { DEFAULT_SKIN_ID } from '../shop/skins';
import { getSkinImage } from '../shop/skinAssets';

function drawFallbackBall(ctx: CanvasRenderingContext2D, radius: number): void {
  const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, radius * 0.1, 0, 0, radius);
  grad.addColorStop(0, '#f0a064');
  grad.addColorStop(0.55, '#d4682a');
  grad.addColorStop(1, '#6a2c0c');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1b0e07';
  ctx.lineWidth = Math.max(1.5, radius * 0.06);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-radius * 0.75, 0);
  ctx.lineTo(radius * 0.75, 0);
  ctx.stroke();
}

export function drawBallShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  floorY: number,
): void {
  const dist = floorY - y;
  const range = radius * 0.6;
  const t = Math.max(0, Math.min(1, dist / range));
  const scale = 1 - t * 0.5;
  const alpha = 0.45 * (1 - t * 0.7);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, floorY - 2, radius * 1.25 * scale, radius * 0.32 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  skinId: string = DEFAULT_SKIN_ID,
): void {
  const img = getSkinImage(skinId);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  if (img && img.complete && img.naturalWidth > 0) {
    const size = radius * 2.05;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  } else {
    drawFallbackBall(ctx, radius);
  }

  ctx.restore();
}
