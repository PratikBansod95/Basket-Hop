import { CANVAS_HEIGHT, CANVAS_WIDTH, DEATH_MARGIN } from './constants';
import { allowDangerZoneExtras, getRenderQuality } from './renderQuality';

const DANGER_ZONE_HEIGHT = 100;

export function drawDangerZones(
  ctx: CanvasRenderingContext2D,
  time: number,
  ballScreenY?: number,
  ballRadius = 0,
): void {
  const quality = getRenderQuality();
  const pulse = quality === 'low' ? 0.92 : 0.88 + Math.sin(time * 3.2) * 0.08;
  let urgency = 0.82;

  if (ballScreenY !== undefined && ballRadius > 0) {
    const distTop = ballScreenY - ballRadius - DEATH_MARGIN;
    const distBottom = CANVAS_HEIGHT - DEATH_MARGIN - (ballScreenY + ballRadius);
    const nearest = Math.min(distTop, distBottom);
    const proximity = 1 - Math.min(1, Math.max(0, nearest) / 190);
    // Boundaries remain readable while safe and intensify near an edge.
    urgency = 0.82 + proximity * 0.95;
  }

  const alpha = Math.min(1, pulse * urgency);

  drawZoneBand(ctx, 'top', alpha);
  drawZoneBand(ctx, 'bottom', alpha);
  const stripeAlpha = alpha * (quality === 'low' ? 0.38 : 0.58);
  drawZoneStripes(ctx, 'top', stripeAlpha);
  drawZoneStripes(ctx, 'bottom', stripeAlpha);
  drawBoundaryLines(ctx, alpha, allowDangerZoneExtras(quality));
}

function drawZoneBand(ctx: CanvasRenderingContext2D, edge: 'top' | 'bottom', alpha: number): void {
  const h = DANGER_ZONE_HEIGHT;
  const grad =
    edge === 'top'
      ? ctx.createLinearGradient(0, 0, 0, h)
      : ctx.createLinearGradient(0, CANVAS_HEIGHT - h, 0, CANVAS_HEIGHT);

  grad.addColorStop(0, edge === 'top' ? `rgba(255, 42, 68, ${0.58 * alpha})` : 'rgba(255, 42, 68, 0)');
  grad.addColorStop(0.48, `rgba(255, 74, 96, ${0.24 * alpha})`);
  grad.addColorStop(1, edge === 'top' ? 'rgba(255, 42, 68, 0)' : `rgba(255, 42, 68, ${0.58 * alpha})`);

  ctx.save();
  ctx.fillStyle = grad;
  if (edge === 'top') {
    ctx.fillRect(0, 0, CANVAS_WIDTH, h);
  } else {
    ctx.fillRect(0, CANVAS_HEIGHT - h, CANVAS_WIDTH, h);
  }
  ctx.restore();
}

function drawZoneStripes(ctx: CanvasRenderingContext2D, edge: 'top' | 'bottom', alpha: number): void {
  const h = DANGER_ZONE_HEIGHT;
  const y0 = edge === 'top' ? 0 : CANVAS_HEIGHT - h;

  ctx.save();
  ctx.beginPath();
  if (edge === 'top') {
    ctx.rect(0, 0, CANVAS_WIDTH, h);
  } else {
    ctx.rect(0, CANVAS_HEIGHT - h, CANVAS_WIDTH, h);
  }
  ctx.clip();

  ctx.strokeStyle = `rgba(255, 220, 205, ${alpha})`;
  ctx.lineWidth = 2;
  const step = 28;
  for (let x = -h; x < CANVAS_WIDTH + h; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x + h, y0 + h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBoundaryLines(ctx: CanvasRenderingContext2D, alpha: number, withBlur: boolean): void {
  const yTop = DEATH_MARGIN;
  const yBottom = CANVAS_HEIGHT - DEATH_MARGIN;

  ctx.save();
  ctx.strokeStyle = `rgba(65, 5, 18, ${0.78 * alpha})`;
  ctx.lineWidth = 8;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(0, yTop);
  ctx.lineTo(CANVAS_WIDTH, yTop);
  ctx.moveTo(0, yBottom);
  ctx.lineTo(CANVAS_WIDTH, yBottom);
  ctx.stroke();

  ctx.strokeStyle = `rgba(255, 225, 218, ${Math.min(1, 1.08 * alpha)})`;
  ctx.lineWidth = 4;
  ctx.setLineDash([14, 9]);
  if (withBlur) {
    ctx.shadowColor = 'rgba(255, 26, 54, 0.8)';
    ctx.shadowBlur = 14;
  }

  ctx.beginPath();
  ctx.moveTo(0, yTop);
  ctx.lineTo(CANVAS_WIDTH, yTop);
  ctx.moveTo(0, yBottom);
  ctx.lineTo(CANVAS_WIDTH, yBottom);
  ctx.stroke();
  ctx.restore();
}
