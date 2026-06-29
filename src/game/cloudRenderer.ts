import { CANVAS_WIDTH, altitudeClimbed } from './constants';
import { backgroundAssets } from './assetLoader';

const W = CANVAS_WIDTH;

interface CloudSpec {
  baseX: number;
  baseY: number;
  scale: number;
  speed: number;
  bob: number;
  alpha: number;
}

const CLOUDS: CloudSpec[] = [
  { baseX: 60, baseY: 90, scale: 0.28, speed: 9, bob: 4, alpha: 0.7 },
  { baseX: 340, baseY: 140, scale: 0.34, speed: 7, bob: 5, alpha: 0.65 },
  { baseX: 560, baseY: 70, scale: 0.24, speed: 11, bob: 3, alpha: 0.6 },
  { baseX: 180, baseY: 240, scale: 0.3, speed: 8, bob: 4, alpha: 0.55 },
  { baseX: 480, baseY: 300, scale: 0.22, speed: 10, bob: 3, alpha: 0.5 },
];

/** Small decorative clouds drifting across the sky. */
export function drawFloatingClouds(
  ctx: CanvasRenderingContext2D,
  time: number,
  climbOffset = 0,
): void {
  const climbed = altitudeClimbed(climbOffset);
  const fade = 1 - Math.min(1, Math.max(0, (climbed - 1400) / 1200)) * 0.9;
  if (fade <= 0.02) return;

  const img = backgroundAssets.cloud;

  for (const cloud of CLOUDS) {
    const wrap = W + 160;
    const x =
      ((cloud.baseX + time * cloud.speed + climbed * 0.03) % wrap + wrap) % wrap - 80;
    const y = cloud.baseY + Math.sin(time * 0.4 + cloud.baseX) * cloud.bob;

    ctx.save();
    ctx.globalAlpha = cloud.alpha * fade;

    if (img) {
      const drawW = img.width * cloud.scale;
      const drawH = img.height * cloud.scale;
      ctx.drawImage(img, x, y, drawW, drawH);
    } else {
      drawSoftCloud(ctx, x, y, 50 * cloud.scale);
    }

    ctx.restore();
  }
}

function drawSoftCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const puffs = [
    { ox: 0, oy: 0, rx: size * 0.45, ry: size * 0.3 },
    { ox: size * 0.35, oy: size * 0.05, rx: size * 0.38, ry: size * 0.26 },
    { ox: -size * 0.28, oy: size * 0.06, rx: size * 0.32, ry: size * 0.22 },
  ];
  for (const puff of puffs) {
    ctx.beginPath();
    ctx.ellipse(x + puff.ox, y + puff.oy, puff.rx, puff.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}
