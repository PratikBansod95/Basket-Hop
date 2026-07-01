import { HOOP_LEFT_X, HOOP_RIGHT_X } from './constants';
import { HOOP_GEOMETRY } from './palette';
import type { HoopSide } from './types';

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface HoopColliders {
  backboard: Rect;
  rimLeft: Rect;
  rimRight: Rect;
  corner: Rect;
  hoopSide: HoopSide;
}

export function createColliders(): HoopColliders {
  return {
    backboard: { left: 0, right: 0, top: 0, bottom: 0 },
    rimLeft: { left: 0, right: 0, top: 0, bottom: 0 },
    rimRight: { left: 0, right: 0, top: 0, bottom: 0 },
    corner: { left: 0, right: 0, top: 0, bottom: 0 },
    hoopSide: 'right',
  };
}

export function updateColliders(colliders: HoopColliders, x: number, y: number, side: HoopSide): void {
  const { backboard: bb, rimLeft: rl, rimRight: rr } = HOOP_GEOMETRY;
  colliders.hoopSide = side;
  colliders.backboard.left = x - bb.offsetX;
  colliders.backboard.right = x + bb.offsetX;
  colliders.backboard.top = y - bb.offsetTop;
  colliders.backboard.bottom = y + (bb.height - bb.offsetTop);

  // Slight padding on the court-facing face for bank shots.
  if (side === 'right') {
    colliders.backboard.left -= 10;
  } else {
    colliders.backboard.right += 10;
  }

  colliders.rimLeft.top = y + rl.offsetY;
  colliders.rimLeft.bottom = y + rl.offsetY + rl.thickness;
  if (side === 'right') {
    colliders.rimLeft.left = x - rl.width - rl.offsetFromBackboard;
    colliders.rimLeft.right = x - rl.offsetFromBackboard;
  } else {
    colliders.rimLeft.left = x + rl.offsetFromBackboard;
    colliders.rimLeft.right = x + rl.width + rl.offsetFromBackboard;
  }

  colliders.rimRight.top = y + rr.offsetY;
  colliders.rimRight.bottom = y + rr.offsetY + rr.thickness;
  if (side === 'right') {
    colliders.rimRight.left = x - rr.width - rr.gap - rl.offsetFromBackboard;
    colliders.rimRight.right = x - rr.gap - rl.offsetFromBackboard;
  } else {
    colliders.rimRight.left = x + rr.gap + rl.offsetFromBackboard;
    colliders.rimRight.right = x + rr.width + rr.gap + rl.offsetFromBackboard;
  }

  colliders.corner.top = colliders.rimLeft.top - 10;
  colliders.corner.bottom = colliders.rimLeft.bottom + 10;
  if (side === 'right') {
    colliders.corner.left = colliders.rimLeft.right - 5;
    colliders.corner.right = colliders.backboard.left + 5;
  } else {
    colliders.corner.left = colliders.backboard.right - 5;
    colliders.corner.right = colliders.rimLeft.left + 5;
  }
}

export function getRimPoints(hoopX: number, hoopY: number, side: HoopSide) {
  const { rimLeft: rl, rimRight: rr } = HOOP_GEOMETRY;
  const centerY = hoopY + rl.offsetY + rl.thickness / 2;
  let left: number;
  let right: number;
  if (side === 'right') {
    left = hoopX - rr.gap - rl.offsetFromBackboard;
    right = hoopX - rl.width - rl.offsetFromBackboard;
  } else {
    left = hoopX + rl.width + rl.offsetFromBackboard;
    right = hoopX + rr.gap + rl.offsetFromBackboard;
  }
  return { left, right, centerY };
}

interface HitResult {
  x: number;
  y: number;
  face: 'left' | 'right' | 'top' | 'bottom';
  normalX: number;
  normalY: number;
}

function resolveCircleRectOverlap(
  x: number,
  y: number,
  radius: number,
  rect: Rect,
): HitResult | null {
  if (!(x + radius > rect.left && x - radius < rect.right && y + radius > rect.top && y - radius < rect.bottom)) {
    return null;
  }

  const penLeft = x + radius - rect.left;
  const penRight = rect.right - (x - radius);
  const penTop = y + radius - rect.top;
  const penBottom = rect.bottom - (y - radius);
  const minX = Math.min(penLeft, penRight);
  const minY = Math.min(penTop, penBottom);

  let face: HitResult['face'];
  let nx = 0;
  let ny = 0;
  let outX = x;
  let outY = y;

  if (minX < minY) {
    if (penLeft < penRight) {
      face = 'left';
      nx = -1;
      outX = rect.left - radius - 0.1;
    } else {
      face = 'right';
      nx = 1;
      outX = rect.right + radius + 0.1;
    }
  } else if (penTop < penBottom) {
    face = 'top';
    ny = -1;
    outY = rect.top - radius - 0.1;
  } else {
    face = 'bottom';
    ny = 1;
    outY = rect.bottom + radius + 0.1;
  }

  return { x: outX, y: outY, face, normalX: nx, normalY: ny };
}

/** Swept circle vs AABB — catches fast shots that tunnel through thin colliders. */
function resolveSweptCircleRect(
  prevX: number,
  prevY: number,
  x: number,
  y: number,
  radius: number,
  rect: Rect,
): HitResult | null {
  const atEnd = resolveCircleRectOverlap(x, y, radius, rect);
  if (atEnd) return atEnd;

  const dx = x - prevX;
  const dy = y - prevY;
  if (dx === 0 && dy === 0) return null;

  const pad = radius;
  const minX = rect.left - pad;
  const maxX = rect.right + pad;
  const minY = rect.top - pad;
  const maxY = rect.bottom + pad;

  let t0 = 0;
  let t1 = 1;
  let enterFace: HitResult['face'] = 'left';

  const clip = (p: number, q: number, face: HitResult['face']): boolean => {
    if (p === 0) return q >= 0;
    const r = q / p;
    if (p < 0) {
      if (r > t0) {
        t0 = r;
        enterFace = face;
      }
    } else if (r < t1) {
      t1 = r;
    }
    return t0 <= t1;
  };

  if (!clip(-dx, prevX - minX, 'left')) return null;
  if (!clip(dx, maxX - prevX, 'right')) return null;
  if (!clip(-dy, prevY - minY, 'top')) return null;
  if (!clip(dy, maxY - prevY, 'bottom')) return null;

  if (t0 < 0 || t0 > 1) return null;

  let nx = 0;
  let ny = 0;
  let outX = prevX + dx * t0;
  let outY = prevY + dy * t0;

  if (enterFace === 'left') {
    nx = -1;
    outX = rect.left - radius - 0.1;
  } else if (enterFace === 'right') {
    nx = 1;
    outX = rect.right + radius + 0.1;
  } else if (enterFace === 'top') {
    ny = -1;
    outY = rect.top - radius - 0.1;
  } else {
    ny = 1;
    outY = rect.bottom + radius + 0.1;
  }

  return { x: outX, y: outY, face: enterFace, normalX: nx, normalY: ny };
}

function resolveRectHit(
  prevX: number,
  prevY: number,
  x: number,
  y: number,
  radius: number,
  rect: Rect,
): HitResult | null {
  return resolveSweptCircleRect(prevX, prevY, x, y, radius, rect);
}

export type ColliderKey = 'backboard' | 'rimLeft' | 'rimRight' | 'corner';

export function resolveColliderHit(
  prevX: number,
  prevY: number,
  x: number,
  y: number,
  radius: number,
  colliders: HoopColliders,
  key: ColliderKey,
): HitResult | null {
  return resolveRectHit(prevX, prevY, x, y, radius, colliders[key]);
}

export function hoopXForSide(side: HoopSide): number {
  return side === 'left' ? HOOP_LEFT_X : HOOP_RIGHT_X;
}

export function isBallBelowFloor(y: number, radius: number, floorY: number): boolean {
  return y - radius > floorY + 80;
}
