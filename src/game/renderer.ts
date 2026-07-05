import { CANVAS_HEIGHT, CANVAS_WIDTH, FLOOR_Y, screenY } from './constants';
import type { HoopColliders } from './collision';
import { drawDebugColliders } from './debug';
import { drawDangerZones } from './dangerZoneRenderer';
import { drawWorld } from './worldRenderer';
import { drawSkyScreen } from './skyRenderer';
import { drawBall, drawBallShadow } from './ballRenderer';
import { drawHoopNet, drawHoopRim, drawHoopShadow } from './hoopRenderer';
import type { Ball, Coin, FloatingText, Hoop } from './types';
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

function drawCoins(ctx: CanvasRenderingContext2D, coins: Coin[], time: number): void {
  for (const coin of coins) {
    if (coin.collected) continue;

    const bob = Math.sin(time * 3.2 + coin.phase) * 4;
    const wobble = 0.88 + Math.sin(time * 5 + coin.phase) * 0.08;
    const y = coin.y + bob;

    ctx.save();
    ctx.translate(coin.x, y);
    ctx.scale(wobble, 1);

    ctx.beginPath();
    ctx.ellipse(0, coin.radius * 0.16, coin.radius * 0.96, coin.radius * 0.34, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 2, coin.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#d48b0c';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    const grad = ctx.createLinearGradient(-coin.radius, -coin.radius, coin.radius, coin.radius);
    grad.addColorStop(0, '#fff2b5');
    grad.addColorStop(0.4, '#ffd166');
    grad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(135, 74, 5, 0.65)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, coin.radius * 0.68, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(188, 108, 12, 0.8)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -coin.radius * 0.42);
    ctx.lineTo(0, coin.radius * 0.42);
    ctx.moveTo(-coin.radius * 0.2, -coin.radius * 0.24);
    ctx.lineTo(coin.radius * 0.18, -coin.radius * 0.24);
    ctx.moveTo(-coin.radius * 0.18, coin.radius * 0.24);
    ctx.lineTo(coin.radius * 0.2, coin.radius * 0.24);
    ctx.lineWidth = 2.8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(135, 74, 5, 0.8)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-coin.radius * 0.24, -coin.radius * 0.3, coin.radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.48)';
    ctx.fill();

    ctx.restore();
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  hoop: Hoop,
  coins: Coin[],
  floatingTexts: FloatingText[],
  state: RenderState,
  colliders?: HoopColliders,
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
  drawCoins(ctx, coins, state.time);
  drawHoopNet(ctx, hoop);
  drawParticles(ctx);
  drawFloatingTexts(ctx, floatingTexts);

  const idleBob = ball.hasLaunched ? 0 : Math.sin(state.time * 2.8) * 5;
  const ballDrawY = ball.y + idleBob;

  drawBallShadow(ctx, ball.x, ballDrawY, ball.radius, FLOOR_Y);
  drawBall(ctx, ball.x, ballDrawY, ball.radius, ball.rotation);
  drawHoopRim(ctx, hoop);
  if (colliders) drawDebugColliders(ctx, colliders);

  ctx.restore();

  if (ball.hasLaunched) {
    const ballScreenY = screenY(ball.y, state.climbOffset);
    drawDangerZones(ctx, state.time, ballScreenY, ball.radius);
  }
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
