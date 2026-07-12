import { buildNetLayout, ringPoint, type NetLayout, type NetPoint } from './netLayout';
import { HOOP_GEOMETRY } from './palette';
import { getRenderQuality } from './renderQuality';
import type { Ball, Hoop } from './types';

const le = HOOP_GEOMETRY;
const COLS = 10;
const ROWS = 5;
const GRAVITY = 420;
const DAMPING = 0.98;
const STIFF = 0.88;
const BALL_PUSH = 0.38;
const BALL_PAD = 6;

interface SimNode {
  x: number;
  y: number;
  px: number;
  py: number;
  pinned: boolean;
}

interface SimConstraint {
  a: number;
  b: number;
  rest: number;
}

interface NetSim {
  nodes: SimNode[];
  constraints: SimConstraint[];
  key: string;
  /** Hoop pose the cloth is currently anchored to (world space). */
  anchorX: number;
  anchorY: number;
}

let sim: NetSim | null = null;

function simKey(hoop: Hoop): string {
  // Rebuild only when side flips — climb/slide translates the existing cloth.
  return hoop.side;
}

function constraintIters(): number {
  const q = getRenderQuality();
  if (q === 'low') return 2;
  if (q === 'medium') return 2;
  return 3;
}

function idx(r: number, c: number): number {
  return r * COLS + c;
}

function dist(a: NetPoint, b: NetPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function restLayout(hoop: Hoop): NetLayout {
  const { rimLeft: rl, rimRight: rr } = le;
  const rimY = hoop.y + rl.offsetY;
  const offset = rl.offsetFromBackboard;
  const rimRightX = hoop.x - offset;
  const rimLeftX = hoop.x - rr.gap - offset - rr.width;
  const cx = (rimLeftX + rimRightX) / 2;
  const cy = rimY + rl.thickness / 2;
  const rx = (rimRightX - rimLeftX) / 2;
  const ry = 7;
  return buildNetLayout(cx, cy, rx, ry, rimLeftX, rimRightX);
}

function restNode(layout: NetLayout, row: number, col: number): NetPoint {
  if (row === 0) return { ...layout.hangPts[col] };
  if (row === ROWS - 1) return { ...layout.bottomPts[col] };
  return ringPoint(layout, row - 1, col);
}

function buildSim(hoop: Hoop): NetSim {
  const layout = restLayout(hoop);
  const nodes: SimNode[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const p = restNode(layout, row, col);
      nodes.push({ x: p.x, y: p.y, px: p.x, py: p.y, pinned: row === 0 });
    }
  }

  const constraints: SimConstraint[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = idx(row, col);
      if (col < COLS - 1) {
        constraints.push({ a: i, b: idx(row, col + 1), rest: dist(restNode(layout, row, col), restNode(layout, row, col + 1)) });
      }
      if (row < ROWS - 1) {
        constraints.push({ a: i, b: idx(row + 1, col), rest: dist(restNode(layout, row, col), restNode(layout, row + 1, col)) });
      }
      if (row < ROWS - 1 && col < COLS - 1) {
        constraints.push({ a: i, b: idx(row + 1, col + 1), rest: dist(restNode(layout, row, col), restNode(layout, row + 1, col + 1)) });
      }
      if (row < ROWS - 1 && col > 0) {
        constraints.push({ a: i, b: idx(row + 1, col - 1), rest: dist(restNode(layout, row, col), restNode(layout, row + 1, col - 1)) });
      }
    }
  }

  return {
    nodes,
    constraints,
    key: simKey(hoop),
    anchorX: hoop.x,
    anchorY: hoop.y,
  };
}

/** Move the whole cloth with the rim so free nodes don't stretch from an old world pose. */
function translateSimToHoop(s: NetSim, hoop: Hoop): void {
  const dx = hoop.x - s.anchorX;
  const dy = hoop.y - s.anchorY;
  if (dx === 0 && dy === 0) return;
  for (const n of s.nodes) {
    n.x += dx;
    n.y += dy;
    n.px += dx;
    n.py += dy;
  }
  s.anchorX = hoop.x;
  s.anchorY = hoop.y;
}

function pinTop(s: NetSim, hoop: Hoop): void {
  const layout = restLayout(hoop);
  for (let col = 0; col < COLS; col++) {
    const n = s.nodes[idx(0, col)];
    const p = layout.hangPts[col];
    n.x = p.x;
    n.y = p.y;
    n.px = p.x;
    n.py = p.y;
    n.pinned = true;
  }
}

function getSim(hoop: Hoop): NetSim {
  const key = simKey(hoop);
  if (!sim || sim.key !== key) sim = buildSim(hoop);
  return sim;
}

export function resetHoopNet(hoop: Hoop): void {
  sim = buildSim(hoop);
}

function ballInNetSpace(ball: Ball, hoop: Hoop): NetPoint {
  if (hoop.side === 'left') {
    return { x: hoop.x * 2 - ball.x, y: ball.y };
  }
  return { x: ball.x, y: ball.y };
}

/** Visual-only — does not change ball velocity or colliders. */
export function updateHoopNet(hoop: Hoop, ball: Ball, dt: number): void {
  const s = getSim(hoop);
  translateSimToHoop(s, hoop);
  pinTop(s, hoop);
  const step = Math.min(dt, 0.033);

  for (const n of s.nodes) {
    if (n.pinned) continue;
    const vx = (n.x - n.px) * DAMPING;
    const vy = (n.y - n.py) * DAMPING;
    n.px = n.x;
    n.py = n.y;
    n.x += vx;
    n.y += vy + GRAVITY * step * step;
  }

  const b = ballInNetSpace(ball, hoop);
  const r = ball.radius + BALL_PAD;
  const r2 = r * r;
  for (const n of s.nodes) {
    if (n.pinned) continue;
    const dx = n.x - b.x;
    const dy = n.y - b.y;
    const d2 = dx * dx + dy * dy;
    if (d2 >= r2 || d2 < 1) continue;
    const d = Math.sqrt(d2);
    const push = (r - d) * BALL_PUSH;
    n.x += (dx / d) * push;
    n.y += (dy / d) * push;
  }

  for (let iter = 0; iter < constraintIters(); iter++) {
    for (const c of s.constraints) {
      const a = s.nodes[c.a];
      const bn = s.nodes[c.b];
      const dx = bn.x - a.x;
      const dy = bn.y - a.y;
      const d = Math.hypot(dx, dy) || 0.001;
      const diff = ((c.rest - d) / d) * STIFF;
      const ox = dx * diff * 0.5;
      const oy = dy * diff * 0.5;
      if (!a.pinned) {
        a.x -= ox;
        a.y -= oy;
      }
      if (!bn.pinned) {
        bn.x += ox;
        bn.y += oy;
      }
    }
    pinTop(s, hoop);
  }
}

export function getSimulatedLayout(hoop: Hoop): NetLayout {
  const base = restLayout(hoop);
  const s = getSim(hoop);
  // Draw may use an interpolated hoop — offset from the physics anchor without mutating sim.
  const ox = hoop.x - s.anchorX;
  const oy = hoop.y - s.anchorY;
  const hangPts: NetPoint[] = [];
  const bottomPts: NetPoint[] = [];
  const ringYs = [...base.ringYs];

  for (let col = 0; col < COLS; col++) {
    const top = s.nodes[idx(0, col)];
    const bot = s.nodes[idx(ROWS - 1, col)];
    hangPts.push({ x: top.x + ox, y: top.y + oy });
    bottomPts.push({ x: bot.x + ox, y: bot.y + oy });
  }

  return { ...base, hangPts, bottomPts, ringYs };
}

export function getSimRingPoints(hoop: Hoop): NetPoint[][] {
  const s = getSim(hoop);
  const ox = hoop.x - s.anchorX;
  const oy = hoop.y - s.anchorY;
  const rings: NetPoint[][] = [];
  for (let row = 1; row < ROWS - 1; row++) {
    const rowPts: NetPoint[] = [];
    for (let col = 0; col < COLS; col++) {
      const n = s.nodes[idx(row, col)];
      rowPts.push({ x: n.x + ox, y: n.y + oy });
    }
    rings.push(rowPts);
  }
  return rings;
}
