import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants';
import { drawBall } from '../game/ballRenderer';

function drawMotionTrails(
  ctx: CanvasRenderingContext2D,
  time: number,
  anchorX: number,
  anchorY: number,
): void {
  // Trails stay on the outer/right side so they never cut through the title.
  for (let i = 0; i < 3; i += 1) {
    const phase = time * 2 + i * 0.6;
    const x = anchorX + 18 + i * 22;
    const y = anchorY + 10 + i * 4 + Math.sin(phase) * 3;
    const alpha = 0.4 - i * 0.1;

    ctx.save();
    ctx.strokeStyle = `rgba(255, 122, 24, ${alpha})`;
    ctx.lineWidth = 3.5 - i * 0.45;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(x, y, 11 - i * 1.5, 4 - i * 0.4, 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

export function renderMenuHomeFx(
  ctx: CanvasRenderingContext2D,
  time: number,
  skinId = 'classic',
): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Sit beside HOP in the reserved right gutter — clear of title + tagline.
  const x = CANVAS_WIDTH * 0.78 + Math.sin(time * 1.6) * 5;
  const y = CANVAS_HEIGHT * 0.205 + Math.sin(time * 2.2) * 4;
  const radius = 30;

  drawMotionTrails(ctx, time, x, y);

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.85, radius * 0.7, radius * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawBall(ctx, x, y, radius, time * 2.8, skinId, time, true);
}
