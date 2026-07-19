import { CANVAS_HEIGHT, CANVAS_WIDTH, altitudeClimbed } from './constants';
import { backgroundAssets } from './assetLoader';
import { ensureZoneAssetsForLevel, getZoneImage } from './zoneAssets';
import { getZoneAtLevel, getZoneBlend, type ClimbZone } from './zones';
import { allowSkyAccents, allowSkyCrossfade, getRenderQuality } from './renderQuality';

const W = CANVAS_WIDTH;
const H = CANVAS_HEIGHT;

export interface SkyParams {
  viewTop: number;
  viewBottom: number;
  climbOffset: number;
  climbed: number;
  time: number;
}

/** Backdrop tracks camera climb after baskets (not the ball). */
const SKY_PARALLAX = 0.42;
/** Mild overscan so climb can pan without blowing up pixels. */
const SKY_COVER_SCALE_HIGH = 1.22;
const SKY_COVER_SCALE_LOW = 1.08;

function skyPanY(climbed: number, maxPan: number): number {
  if (maxPan <= 0) return 0;
  return Math.min(maxPan, climbed * SKY_PARALLAX);
}

/** Full-screen zone backdrops with smooth crossfade by basket level. */
export function drawSkyScreen(
  ctx: CanvasRenderingContext2D,
  climbOffset: number,
  time: number,
  level = 0,
): void {
  const climbed = altitudeClimbed(climbOffset);
  const blend = getZoneBlend(level);
  const quality = getRenderQuality();
  ensureZoneAssetsForLevel(level);

  const fromImg = getZoneImage(blend.from.id);
  const toImg = getZoneImage(blend.to.id);

  if (fromImg || toImg) {
    const useTo = blend.t >= 0.5 && blend.to.id !== blend.from.id;
    const activeZone = useTo ? blend.to : blend.from;
    const activeImg = useTo ? toImg : fromImg;

    if (allowSkyCrossfade(quality) && blend.t > 0.01 && blend.t < 0.99 && blend.to.id !== blend.from.id) {
      if (fromImg) drawCoverImage(ctx, fromImg, climbed, 1);
      else drawZoneFallback(ctx, blend.from, 1);
      if (toImg) {
        ctx.save();
        ctx.globalAlpha = blend.t;
        drawCoverImage(ctx, toImg, climbed, 1);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = blend.t;
        drawZoneFallback(ctx, blend.to, 1);
        ctx.restore();
      }
    } else if (activeImg) {
      drawCoverImage(ctx, activeImg, climbed, 1);
    } else {
      drawZoneFallback(ctx, activeZone, 1);
    }

    applyTint(ctx, blend.remixTint ?? activeZone.tint);
    if (
      !allowSkyCrossfade(quality) &&
      blend.to.id !== blend.from.id &&
      blend.t > 0 &&
      blend.t < 1
    ) {
      const veil = 1 - Math.abs(blend.t - 0.5) * 2;
      ctx.fillStyle = `rgba(225, 239, 255, ${Math.max(0, veil) * 0.13})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (quality === 'high') drawVignette(ctx);
    if (allowSkyAccents(quality)) {
      drawZoneAccents(ctx, activeZone, time, climbed, 1);
    }
    return;
  }

  const duskMix = Math.min(1, Math.max(0, (climbed - 1400) / 900));
  const spaceMix = Math.min(1, Math.max(0, (climbed - 2200) / 1000));
  if (backgroundAssets.skyDay) {
    drawCoverImage(ctx, backgroundAssets.skyDay, climbed, 1);
    if (duskMix > 0.05) {
      ctx.fillStyle = `rgba(26,35,126,${duskMix * 0.25})`;
      ctx.fillRect(0, 0, W, H);
    }
    if (spaceMix > 0.05) {
      ctx.fillStyle = `rgba(5,8,20,${spaceMix * 0.3})`;
      ctx.fillRect(0, 0, W, H);
    }
  } else {
    drawZoneFallback(ctx, getZoneAtLevel(level), 1);
  }
}

/** @deprecated */
export function drawSkyAtmosphere(ctx: CanvasRenderingContext2D, p: SkyParams): void {
  drawSkyScreen(ctx, p.climbOffset, p.time);
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  climbed: number,
  alpha: number,
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (iw <= 0 || ih <= 0) return;

  const quality = getRenderQuality();
  const cover = quality === 'high' ? SKY_COVER_SCALE_HIGH : SKY_COVER_SCALE_LOW;
  const scale = Math.max(W / iw, H / ih) * cover;
  const drawW = iw * scale;
  const drawH = ih * scale;
  const x = (W - drawW) / 2;
  const maxPan = Math.max(0, drawH - H);
  const y = -skyPanY(climbed, maxPan);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = quality === 'low' ? 'medium' : 'high';
  ctx.drawImage(img, 0, 0, iw, ih, x, y, drawW, drawH);
  ctx.restore();
}

function applyTint(ctx: CanvasRenderingContext2D, tint: string | undefined): void {
  if (!tint) return;
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawVignette(ctx: CanvasRenderingContext2D): void {
  const g = ctx.createRadialGradient(W * 0.5, H * 0.42, H * 0.2, W * 0.5, H * 0.5, H * 0.78);
  g.addColorStop(0, 'rgba(255,252,245,0.04)');
  g.addColorStop(0.55, 'rgba(255,252,245,0)');
  g.addColorStop(1, 'rgba(20, 28, 48, 0.22)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function drawZoneFallback(ctx: CanvasRenderingContext2D, zone: ClimbZone, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  switch (zone.id) {
    case 'everest':
      grad.addColorStop(0, '#cfe8ff');
      grad.addColorStop(1, '#f7fbff');
      break;
    case 'heaven':
      grad.addColorStop(0, '#ffe9b0');
      grad.addColorStop(1, '#fff8e8');
      break;
    case 'space':
    case 'deepspace':
      grad.addColorStop(0, '#d8e7ff');
      grad.addColorStop(1, '#eef4ff');
      break;
    case 'nebula':
      grad.addColorStop(0, '#f0d8ff');
      grad.addColorStop(1, '#e8f0ff');
      break;
    case 'void':
      grad.addColorStop(0, '#e6e9f5');
      grad.addColorStop(1, '#f4f6fb');
      break;
    default:
      grad.addColorStop(0, '#7ec8ff');
      grad.addColorStop(0.55, '#b8e4ff');
      grad.addColorStop(1, '#e8f6ff');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

function drawZoneAccents(
  ctx: CanvasRenderingContext2D,
  zone: ClimbZone,
  time: number,
  climbed: number,
  strength: number,
): void {
  if (strength < 0.05 || zone.accent === 'none') return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, strength);
  const drift = climbed * SKY_PARALLAX * 0.35;

  if (zone.accent === 'snow') {
    for (let i = 0; i < 28; i += 1) {
      const x = ((i * 97 + time * 40) % (W + 40)) - 20;
      const y = ((i * 53 + time * 55 + drift) % (H + 40)) - 20;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 1.4 + (i % 3) * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (zone.accent === 'stars' || zone.accent === 'nebula') {
    for (let i = 0; i < 36; i += 1) {
      const twinkle = 0.2 + 0.55 * (0.5 + 0.5 * Math.sin(time * 3 + i));
      const x = (i * 173) % W;
      const y = ((i * 97 + drift * 0.5) % H + H) % H;
      ctx.fillStyle = `rgba(255,255,255,${twinkle * (zone.accent === 'nebula' ? 0.45 : 0.7)})`;
      ctx.fillRect(x, y, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
    }
  }

  if (zone.accent === 'rain') {
    const count = getRenderQuality() === 'high' ? 24 : 8;
    ctx.strokeStyle = 'rgba(205, 225, 255, 0.38)';
    ctx.lineWidth = 1.4;
    for (let i = 0; i < count; i += 1) {
      const x = ((i * 113 + time * 95) % (W + 80)) - 40;
      const y = ((i * 71 + time * 210 + drift) % (H + 60)) - 30;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 10, y + 26);
      ctx.stroke();
    }
  }

  if (zone.accent === 'aurora') {
    const ribbons = getRenderQuality() === 'high' ? 3 : 2;
    ctx.lineCap = 'round';
    for (let i = 0; i < ribbons; i += 1) {
      const wave = Math.sin(time * 0.45 + i * 1.7) * 24;
      const y = H * (0.18 + i * 0.13) + wave;
      ctx.strokeStyle =
        i % 2 === 0 ? 'rgba(86, 255, 196, 0.2)' : 'rgba(125, 154, 255, 0.18)';
      ctx.lineWidth = getRenderQuality() === 'high' ? 28 : 18;
      ctx.beginPath();
      ctx.moveTo(-40, y);
      ctx.bezierCurveTo(W * 0.25, y - 70, W * 0.7, y + 80, W + 40, y - 20);
      ctx.stroke();
    }
  }

  ctx.restore();
}
