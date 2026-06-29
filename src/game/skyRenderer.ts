import { CANVAS_HEIGHT, CANVAS_WIDTH, altitudeClimbed } from './constants';
import { backgroundAssets } from './assetLoader';

const W = CANVAS_WIDTH;
const H = CANVAS_HEIGHT;

export interface SkyParams {
  viewTop: number;
  viewBottom: number;
  climbOffset: number;
  climbed: number;
  time: number;
}

/** Full-screen sky in screen space — one sky-day.png, never tiled. */
export function drawSkyScreen(ctx: CanvasRenderingContext2D, climbOffset: number, time: number): void {
  const climbed = altitudeClimbed(climbOffset);
  const duskMix = Math.min(1, Math.max(0, (climbed - 1400) / 900));
  const spaceMix = Math.min(1, Math.max(0, (climbed - 2200) / 1000));

  if (backgroundAssets.skyDay) {
    drawSingleSkyImage(ctx, backgroundAssets.skyDay, climbed, time, duskMix, spaceMix);
  } else {
    drawSkyFallback(ctx, duskMix, spaceMix);
  }
}

/** @deprecated */
export function drawSkyAtmosphere(ctx: CanvasRenderingContext2D, p: SkyParams): void {
  drawSkyScreen(ctx, p.climbOffset, p.time);
}

/** One drawImage — cover-fit, slow parallax pan as you climb (clamped, no repeat). */
function drawSingleSkyImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  climbed: number,
  time: number,
  duskMix: number,
  spaceMix: number,
): void {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (iw <= 0 || ih <= 0) return;

  const scale = Math.max(W / iw, H / ih);
  const drawW = iw * scale;
  const drawH = ih * scale;
  const x = (W - drawW) / 2;

  const maxPan = Math.max(0, drawH - H);
  const panY = Math.min(maxPan, climbed * 0.14 + time * 4);
  const y = -panY;

  ctx.drawImage(img, 0, 0, iw, ih, x, y, drawW, drawH);

  if (duskMix > 0.05) {
    ctx.fillStyle = `rgba(26,35,126,${duskMix * 0.4})`;
    ctx.fillRect(0, 0, W, H);
  }
  if (spaceMix > 0.05) {
    ctx.fillStyle = `rgba(5,8,20,${spaceMix * 0.5})`;
    ctx.fillRect(0, 0, W, H);
  }
}

function drawSkyFallback(
  ctx: CanvasRenderingContext2D,
  duskMix: number,
  spaceMix: number,
): void {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#1565C0');
  grad.addColorStop(0.5, '#42A5F5');
  grad.addColorStop(1, '#B3E5FC');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (duskMix > 0.05) {
    ctx.fillStyle = `rgba(26,35,126,${duskMix * 0.4})`;
    ctx.fillRect(0, 0, W, H);
  }
  if (spaceMix > 0.05) {
    ctx.fillStyle = `rgba(5,8,20,${spaceMix * 0.5})`;
    ctx.fillRect(0, 0, W, H);
  }
}
