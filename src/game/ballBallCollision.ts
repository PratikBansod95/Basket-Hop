import type { Ball } from './types';

/** Elastic circle–circle resolve for versus ball–ball contact. */
export function resolveBallBallCollision(a: Ball, b: Ball): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distSq = dx * dx + dy * dy;
  const minDist = a.radius + b.radius;
  if (distSq <= 0 || distSq >= minDist * minDist) return false;

  const dist = Math.sqrt(distSq);
  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = minDist - dist;

  const sep = overlap * 0.5 + 0.05;
  a.x -= nx * sep;
  a.y -= ny * sep;
  b.x += nx * sep;
  b.y += ny * sep;

  const rvx = b.vx - a.vx;
  const rvy = b.vy - a.vy;
  const velAlongNormal = rvx * nx + rvy * ny;
  if (velAlongNormal > 0) return true;

  const restitution = 0.82;
  const impulse = (-(1 + restitution) * velAlongNormal) / 2;
  const ix = impulse * nx;
  const iy = impulse * ny;
  a.vx -= ix;
  a.vy -= iy;
  b.vx += ix;
  b.vy += iy;
  return true;
}
