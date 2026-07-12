import { DEFAULT_SKIN_ID } from '../shop/skins';
import { getSkinImage } from '../shop/skinAssets';
import { getSkinFx } from '../shop/skinFx';
import { getSkinTrail, type SkinTrailStyle, type TrailMode } from '../shop/skinTrails';
import { drawElementalBallFx } from './skinFxRenderer';

const TRAIL_MAX = 8;
const trail: Array<{ x: number; y: number; r: number }> = [];
let lastTrailSample = 0;

export function resetBallTrail(): void {
  trail.length = 0;
  lastTrailSample = 0;
}

export function sampleBallTrail(x: number, y: number, radius: number, launched: boolean, time: number): void {
  if (!launched) {
    trail.length = 0;
    return;
  }
  if (time - lastTrailSample < 0.026) return;
  lastTrailSample = time;
  trail.unshift({ x, y, r: radius });
  if (trail.length > TRAIL_MAX) trail.length = TRAIL_MAX;
}

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

function trailColor(style: SkinTrailStyle, index: number): string {
  return style.colors[index % style.colors.length];
}

function drawStar(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.beginPath();
  for (let i = 0; i < 4; i += 1) {
    const a = (i * Math.PI) / 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
  }
  ctx.lineWidth = Math.max(1.2, size * 0.35);
  ctx.lineCap = 'round';
  ctx.stroke();
}

function drawTrailGhost(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  fade: number,
  color: string,
  mode: TrailMode,
  style: SkinTrailStyle,
): void {
  const r = radius * (0.5 + fade * 0.4) * style.scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = Math.min(1, (0.1 + fade * 0.28) * style.alpha);

  if (style.glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 12 + fade * 10;
  }

  if (mode === 'ripple') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 + fade * 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, r * (1.05 + (1 - fade) * 0.35), 0, Math.PI * 2);
    ctx.stroke();
  } else if (mode === 'ember') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.15, r * 0.7, r * (0.95 + (1 - fade) * 0.35), 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (mode === 'ice') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha *= 0.85;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    drawStar(ctx, r * 0.55);
  } else if (mode === 'neon') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha *= 0.55;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
    ctx.stroke();
  } else if (mode === 'spark' || mode === 'star') {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    drawStar(ctx, r * (mode === 'star' ? 0.85 : 0.7));
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (mode === 'smoke') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, r * (1.1 + (1 - fade) * 0.4), 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawBallTrail(ctx: CanvasRenderingContext2D, skinId: string = DEFAULT_SKIN_ID): void {
  const style = getSkinTrail(skinId);
  for (let i = trail.length - 1; i >= 0; i -= 1) {
    const t = trail[i];
    const fade = (trail.length - i) / (trail.length + 1);
    drawTrailGhost(ctx, t.x, t.y, t.r, fade, trailColor(style, i), style.mode, style);
  }
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

  ctx.save();
  ctx.translate(x, y);

  if (fx.kind !== 'none') {
    drawElementalBallFx(ctx, radius, skinId, time, { launched, phase: 'aura' });
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
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
  } else {
    drawFallbackBall(ctx, radius);
  }

  if (fx.kind !== 'none') {
    drawElementalBallFx(ctx, radius, skinId, time, { launched, phase: 'overlay' });
  }

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

  ctx.restore();

  if (fx.kind !== 'none') {
    drawElementalBallFx(ctx, radius, skinId, time, { launched, phase: 'orbit' });
  }

  ctx.restore();
}
