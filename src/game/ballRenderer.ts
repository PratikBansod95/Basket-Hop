import { DEFAULT_SKIN_ID } from '../shop/skins';
import { getSkinImage } from '../shop/skinAssets';
import { getSkinFx } from '../shop/skinFx';
import { drawElementalBallFx } from './skinFxRenderer';
import { fxStrengthForQuality, getRenderQuality, allowAuraFx, allowOverlayFx, allowOrbitFx } from './renderQuality';

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
  time = 0,
  launched = false,
): void {
  const img = getSkinImage(skinId);
  const fx = getSkinFx(skinId);
  const fxStrength = fxStrengthForQuality();

  ctx.save();
  ctx.translate(x, y);

  if (fx.kind !== 'none' && fxStrength > 0.05 && allowAuraFx()) {
    drawElementalBallFx(ctx, radius, skinId, time, { launched, phase: 'aura', strength: fxStrength });
  }

  ctx.save();
  ctx.rotate(rotation);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(radius * 0.15, radius * 0.55, radius * 0.7, radius * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (img && img.complete && img.naturalWidth > 0) {
    const size = radius * 2.05;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  } else {
    drawFallbackBall(ctx, radius);
  }

  // Overlay/orbit are high-only (expensive radial blobs).
  if (fx.kind !== 'none' && fxStrength > 0.05 && allowOverlayFx()) {
    drawElementalBallFx(ctx, radius, skinId, time, {
      launched,
      phase: 'overlay',
      strength: fxStrength,
    });
  }

  if (getRenderQuality() !== 'low') {
    const shineTop =
      fx.kind === 'ice'
        ? 'rgba(200,240,255,0.45)'
        : fx.kind === 'neon'
          ? 'rgba(180,255,220,0.4)'
          : 'rgba(255,255,255,0.38)';
    const shine = ctx.createRadialGradient(-radius * 0.35, -radius * 0.4, 0, 0, 0, radius);
    shine.addColorStop(0, shineTop);
    shine.addColorStop(0.35, 'rgba(255,255,255,0.08)');
    shine.addColorStop(0.7, 'rgba(0,0,0,0)');
    shine.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
    ctx.fillStyle = shine;
    ctx.fill();
  }

  ctx.restore();

  if (fx.kind !== 'none' && fxStrength > 0.05 && allowOrbitFx()) {
    drawElementalBallFx(ctx, radius, skinId, time, { launched, phase: 'orbit', strength: fxStrength });
  }

  ctx.restore();
}
