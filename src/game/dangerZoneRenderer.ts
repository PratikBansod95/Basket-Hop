import { CANVAS_HEIGHT, CANVAS_WIDTH, DEATH_MARGIN } from './constants';

const DANGER_ZONE_HEIGHT = 72;

export function drawDangerZones(
  ctx: CanvasRenderingContext2D,
  time: number,
  ballScreenY?: number,
  ballRadius = 0,
): void {
  const pulse = 0.72 + Math.sin(time * 3.2) * 0.14;
  let urgency = 1;

  if (ballScreenY !== undefined && ballRadius > 0) {
    const distTop = ballScreenY - ballRadius - DEATH_MARGIN;
    const distBottom = CANVAS_HEIGHT - DEATH_MARGIN - (ballScreenY + ballRadius);
    const nearest = Math.min(distTop, distBottom);
    if (nearest < 100) {
      urgency = 1 + (1 - Math.max(0, nearest) / 100) * 0.75;
    }
  }

  const alpha = Math.min(1, pulse * urgency);

  drawZoneBand(ctx, 'top', alpha);
  drawZoneBand(ctx, 'bottom', alpha);
  drawZoneStripes(ctx, 'top', alpha * 0.55);
  drawZoneStripes(ctx, 'bottom', alpha * 0.55);
  drawBoundaryLines(ctx, alpha);
  drawZoneLabels(ctx, alpha);
}

function drawZoneBand(ctx: CanvasRenderingContext2D, edge: 'top' | 'bottom', alpha: number): void {
  const h = DANGER_ZONE_HEIGHT;
  const grad =
    edge === 'top'
      ? ctx.createLinearGradient(0, 0, 0, h)
      : ctx.createLinearGradient(0, CANVAS_HEIGHT - h, 0, CANVAS_HEIGHT);

  grad.addColorStop(0, edge === 'top' ? `rgba(255, 35, 65, ${0.58 * alpha})` : 'rgba(255, 35, 65, 0)');
  grad.addColorStop(0.45, `rgba(255, 70, 90, ${0.28 * alpha})`);
  grad.addColorStop(1, edge === 'top' ? 'rgba(255, 35, 65, 0)' : `rgba(255, 35, 65, ${0.58 * alpha})`);

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
  const step = 22;
  for (let x = -h; x < CANVAS_WIDTH + h; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, y0);
    ctx.lineTo(x + h, y0 + h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBoundaryLines(ctx: CanvasRenderingContext2D, alpha: number): void {
  const yTop = DEATH_MARGIN;
  const yBottom = CANVAS_HEIGHT - DEATH_MARGIN;

  ctx.save();
  ctx.strokeStyle = `rgba(255, 95, 110, ${0.95 * alpha})`;
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 9]);
  ctx.shadowColor = 'rgba(255, 40, 60, 0.55)';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(0, yTop);
  ctx.lineTo(CANVAS_WIDTH, yTop);
  ctx.moveTo(0, yBottom);
  ctx.lineTo(CANVAS_WIDTH, yBottom);
  ctx.stroke();
  ctx.restore();
}

function drawZoneLabels(ctx: CanvasRenderingContext2D, alpha: number): void {
  ctx.save();
  ctx.font = "700 13px 'DM Sans', system-ui, sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = `rgba(255, 245, 240, ${0.92 * alpha})`;
  ctx.strokeStyle = `rgba(90, 10, 20, ${0.55 * alpha})`;
  ctx.lineWidth = 3;

  const label = 'OUT OF BOUNDS';
  ctx.strokeText(label, CANVAS_WIDTH / 2, 24);
  ctx.fillText(label, CANVAS_WIDTH / 2, 24);
  ctx.strokeText(label, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 24);
  ctx.fillText(label, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 24);
  ctx.restore();
}
