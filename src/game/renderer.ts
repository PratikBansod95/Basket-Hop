import { CANVAS_HEIGHT, CANVAS_WIDTH, DEATH_MARGIN, FLOOR_Y } from './constants';
import { drawWorld } from './worldRenderer';
import { drawSkyScreen } from './skyRenderer';
import { drawBall, drawBallShadow } from './ballRenderer';
import { drawHoopNet, drawHoopRim, drawHoopShadow } from './hoopRenderer';
import type { Ball, FloatingText, Hoop } from './types';
import { drawParticles } from './particles';

export interface RenderState {
  shake: number;
  climbOffset: number;
  time: number;
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]): void {
  for (const ft of texts) {
    const alpha = Math.min(1, ft.life);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = "700 48px 'Bebas Neue', system-ui, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.strokeText(ft.text, ft.x, ft.y);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  hoop: Hoop,
  floatingTexts: FloatingText[],
  state: RenderState,
): void {
  const shakeX = state.shake > 0 ? (Math.random() - 0.5) * state.shake : 0;
  const shakeY = state.shake > 0 ? (Math.random() - 0.5) * state.shake : 0;

  ctx.save();
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawSkyScreen(ctx, state.climbOffset, state.time);

  ctx.translate(shakeX, shakeY);
  ctx.translate(0, state.climbOffset);

  drawWorld(ctx, state.climbOffset, state.time);
  drawHoopShadow(ctx, hoop, FLOOR_Y);
  drawHoopNet(ctx, hoop);
  drawParticles(ctx);
  drawFloatingTexts(ctx, floatingTexts);
  drawBallShadow(ctx, ball.x, ball.y, ball.radius, FLOOR_Y);
  drawBall(ctx, ball.x, ball.y, ball.radius, ball.rotation);
  drawHoopRim(ctx, hoop);

  ctx.restore();

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 107, 44, 0.35)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 10]);
  ctx.beginPath();
  ctx.moveTo(0, DEATH_MARGIN);
  ctx.lineTo(CANVAS_WIDTH, DEATH_MARGIN);
  ctx.moveTo(0, CANVAS_HEIGHT - DEATH_MARGIN);
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT - DEATH_MARGIN);
  ctx.stroke();
  ctx.restore();
}

export function renderLoading(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, '#1E88E5');
  grad.addColorStop(0.5, '#64B5F6');
  grad.addColorStop(1, '#B3E5FC');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#f6e9c8';
  ctx.font = 'bold 24px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('Loading...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}
