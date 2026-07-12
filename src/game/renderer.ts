import { CANVAS_HEIGHT, CANVAS_WIDTH, FLOOR_Y, screenY } from './constants';
import type { HoopColliders } from './collision';
import { drawDebugColliders } from './debug';
import { drawDangerZones } from './dangerZoneRenderer';
import { drawWorld } from './worldRenderer';
import { drawSkyScreen } from './skyRenderer';
import { drawBall, drawBallShadow } from './ballRenderer';
import { drawCoin } from './coinRenderer';
import { drawHoopNet, drawHoopRim, drawHoopShadow } from './hoopRenderer';
import type { Coin, FloatingText, Hoop } from './types';
import { drawParticles } from './particles';

export interface RenderBall {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  hasLaunched: boolean;
}

export interface RenderState {
  shake: number;
  climbOffset: number;
  time: number;
  level: number;
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]): void {
  for (const ft of texts) {
    const alpha = Math.min(1, ft.life);
    const pop = 1 + (1 - Math.min(1, ft.life)) * 0.12;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(ft.x, ft.y);
    ctx.scale(pop, pop);
    ctx.font = "700 52px 'Bebas Neue', system-ui, sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.strokeText(ft.text, 0, 0);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, 0, 0);
    ctx.restore();
  }
}

function drawCoins(ctx: CanvasRenderingContext2D, coins: Coin[], time: number): void {
  for (const coin of coins) {
    if (coin.collected) continue;
    drawCoin(ctx, coin.x, coin.y, coin.radius, time, coin.phase);
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  ball: RenderBall,
  hoop: Hoop,
  coins: Coin[],
  floatingTexts: FloatingText[],
  state: RenderState,
  colliders?: HoopColliders,
  skinId = 'classic',
): void {
  renderWorldScene(ctx, hoop, coins, floatingTexts, state, colliders, true);
  drawBalls(ctx, [ball], state.time, skinId, FLOOR_Y);
  drawHoopRim(ctx, hoop);
  if (colliders) drawDebugColliders(ctx, colliders);
  ctx.restore();

  if (ball.hasLaunched) {
    const ballScreenY = screenY(ball.y, state.climbOffset);
    drawDangerZones(ctx, state.time, ballScreenY, ball.radius);
  }
}

/** Versus: two balls, no coins, no danger zones. */
export function renderVersus(
  ctx: CanvasRenderingContext2D,
  balls: RenderBall[],
  hoop: Hoop,
  floatingTexts: FloatingText[],
  state: RenderState,
  colliders?: HoopColliders,
  skinIds: [string, string] = ['classic', 'classic'],
): void {
  renderWorldScene(ctx, hoop, [], floatingTexts, state, colliders, false);
  for (let i = 0; i < balls.length; i += 1) {
    drawBalls(ctx, [balls[i]], state.time, skinIds[i] ?? skinIds[0], FLOOR_Y);
  }
  drawHoopRim(ctx, hoop);
  if (colliders) drawDebugColliders(ctx, colliders);
  ctx.restore();
}

function renderWorldScene(
  ctx: CanvasRenderingContext2D,
  hoop: Hoop,
  coins: Coin[],
  floatingTexts: FloatingText[],
  state: RenderState,
  _colliders: HoopColliders | undefined,
  _drawDangerPlaceholder: boolean,
): void {
  const shakeAmt = state.shake;
  const shakeX =
    shakeAmt > 0 ? Math.sin(state.time * 57.3) * shakeAmt * 0.55 + Math.sin(state.time * 91.1) * shakeAmt * 0.35 : 0;
  const shakeY =
    shakeAmt > 0 ? Math.cos(state.time * 63.7) * shakeAmt * 0.55 + Math.cos(state.time * 84.2) * shakeAmt * 0.3 : 0;

  ctx.save();
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawSkyScreen(ctx, state.climbOffset, state.time, state.level);

  ctx.translate(shakeX, shakeY);
  ctx.translate(0, state.climbOffset);

  drawWorld(ctx, state.climbOffset, state.time, state.level);
  drawHoopShadow(ctx, hoop, FLOOR_Y);
  drawCoins(ctx, coins, state.time);
  drawHoopNet(ctx, hoop);
  drawParticles(ctx);
  drawFloatingTexts(ctx, floatingTexts);
}

function drawBalls(
  ctx: CanvasRenderingContext2D,
  balls: RenderBall[],
  time: number,
  skinId: string,
  floorY: number,
): void {
  for (const ball of balls) {
    const idleBob = ball.hasLaunched ? 0 : Math.sin(time * 2.8) * 5;
    const ballDrawY = ball.y + idleBob;
    drawBallShadow(ctx, ball.x, ballDrawY, ball.radius, floorY);
    drawBall(ctx, ball.x, ballDrawY, ball.radius, ball.rotation, skinId, time, ball.hasLaunched);
  }
}

export function renderLoading(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  grad.addColorStop(0, '#1a2b48');
  grad.addColorStop(0.45, '#2a4068');
  grad.addColorStop(1, '#ff8a2a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = 'rgba(255,248,236,0.92)';
  ctx.font = "700 42px 'Bebas Neue', system-ui, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText('BASKET HOP', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 8);
  ctx.font = '600 16px system-ui';
  ctx.fillStyle = 'rgba(255,248,236,0.65)';
  ctx.fillText('Loading…', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 28);
}