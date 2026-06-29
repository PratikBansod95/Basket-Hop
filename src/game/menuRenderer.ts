import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants';
import { drawBall } from './ballRenderer';
import { drawHoopNet, drawHoopRim } from './hoopRenderer';
import { drawSkyScreen } from './skyRenderer';
import { drawWorld } from './worldRenderer';
import type { Hoop } from './types';

const MENU_HOOP: Hoop = {
  side: 'right',
  x: CANVAS_WIDTH - 12,
  y: 420,
  targetX: CANVAS_WIDTH - 12,
  targetY: 420,
  slideFromX: CANVAS_WIDTH - 12,
  slideFromY: 420,
  slideT: 1,
  tilt: 0,
  tiltVel: 0,
  animating: false,
};

export function renderMenuScene(ctx: CanvasRenderingContext2D, time: number): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawSkyScreen(ctx, 0, time);
  drawWorld(ctx, 0, time);

  drawHoopNet(ctx, MENU_HOOP);
  drawHoopRim(ctx, MENU_HOOP);

  const glow = ctx.createRadialGradient(
    CANVAS_WIDTH * 0.5,
    CANVAS_HEIGHT * 0.32,
    30,
    CANVAS_WIDTH * 0.5,
    CANVAS_HEIGHT * 0.32,
    CANVAS_WIDTH * 0.65,
  );
  glow.addColorStop(0, 'rgba(255, 140, 60, 0.16)');
  glow.addColorStop(0.5, 'rgba(255, 193, 77, 0.06)');
  glow.addColorStop(1, 'rgba(255, 193, 77, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const shade = ctx.createLinearGradient(0, CANVAS_HEIGHT * 0.28, 0, CANVAS_HEIGHT);
  shade.addColorStop(0, 'rgba(8, 10, 16, 0)');
  shade.addColorStop(0.5, 'rgba(8, 10, 16, 0.5)');
  shade.addColorStop(1, 'rgba(8, 10, 16, 0.88)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = 'rgba(255, 193, 77, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 18]);
  ctx.beginPath();
  ctx.moveTo(40, CANVAS_HEIGHT * 0.22);
  ctx.lineTo(CANVAS_WIDTH - 40, CANVAS_HEIGHT * 0.18);
  ctx.stroke();
  ctx.restore();
}

export function getMenuBallPose(time: number): { x: number; y: number; r: number; rot: number } {
  return {
    x: CANVAS_WIDTH * 0.5 + Math.sin(time * 1.4) * 28,
    y: 720 + Math.sin(time * 2.1) * 18,
    r: 44,
    rot: time * 2.5,
  };
}

/** Drawn on overlay canvas above the menu card. */
export function renderMenuBall(ctx: CanvasRenderingContext2D, time: number): void {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const { x, y, r, rot } = getMenuBallPose(time);

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath();
  ctx.ellipse(x, y + r * 0.9, r * 0.85, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  drawBall(ctx, x, y, r, rot);
}
