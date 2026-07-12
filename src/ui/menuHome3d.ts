import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game/constants';
import { drawBall } from '../game/ballRenderer';

function drawMotionTrails(
  ctx: CanvasRenderingContext2D,
  time: number,
  anchorX: number,
  anchorY: number,
): void {
  for (let i = 0; i < 3; i += 1) {
    const phase = time * 2 + i * 0.6;
    const x = anchorX - 70 - i * 32;
    const y = anchorY + 6 + i * 5 + Math.sin(phase) * 4;
    const alpha = 0.45 - i * 0.12;

    ctx.save();
    ctx.strokeStyle = `rgba(255, 122, 24, ${alpha})`;
    ctx.lineWidth = 4 - i * 0.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.ellipse(x, y, 14 - i * 2, 5 - i, -0.3, 0, Math.PI * 2);
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

  const x = CANVAS_WIDTH * 0.76 + Math.sin(time * 1.6) * 8;
  const y = CANVAS_HEIGHT * 0.195 + Math.sin(time * 2.2) * 6;
  const radius = 32;

  drawMotionTrails(ctx, time, x, y);

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.85, radius * 0.7, radius * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawBall(ctx, x, y, radius, time * 2.8, skinId);
}
