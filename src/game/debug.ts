import type { HoopColliders, Rect } from './collision';

const search = typeof location === 'undefined' ? '' : location.search;

export const DEBUG = new URLSearchParams(search).has('debug');

export function debugLog(tag: string, ...args: unknown[]): void {
  if (!DEBUG) return;
  console.log(`[${tag}]`, ...args);
}

function drawRect(ctx: CanvasRenderingContext2D, rect: Rect, stroke: string): void {
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
}

export function drawDebugColliders(ctx: CanvasRenderingContext2D, colliders: HoopColliders): void {
  if (!DEBUG) return;
  ctx.save();
  drawRect(ctx, colliders.backboard, '#ff4444');
  drawRect(ctx, colliders.rimLeft, '#44ff44');
  drawRect(ctx, colliders.rimRight, '#44ff44');
  drawRect(ctx, colliders.corner, '#ffaa00');
  ctx.restore();
}
