import { buildNetLayout, ringPoint, type NetLayout, type NetPoint } from './netLayout';
import { HOOP_GEOMETRY } from './palette';
import type { Ball, Hoop } from './types';

const le = HOOP_GEOMETRY;
const COLS = 10;
const ROWS = 5;
const GRAVITY = 420;
const DAMPING = 0.98;
const STIFF = 0.88;
const ITERS = 3;
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
}

let sim: NetSim | null = null;

function simKey(hoop: Hoop): string {
  return `${hoop.side}:${Math.round(hoop.x)}:${Math.round(hoop.y)}`;
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

  return { nodes, constraints, key: simKey(hoop) };
}

function pinTop(sim: NetSim, hoop: Hoop): void {
  const layout = restLayout(hoop);
  for (let col = 0; col < COLS; col++) {
    const n = sim.nodes[idx(0, col)];
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

  for (let iter = 0; iter < ITERS; iter++) {
    for (const c of s.constraints) {
      const a = s.nodes[c.a];
      const b = s.nodes[c.b];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.001;
      const diff = ((c.rest - d) / d) * STIFF;
      const ox = dx * diff * 0.5;
      const oy = dy * diff * 0.5;
      if (!a.pinned) {
        a.x -= ox;
        a.y -= oy;
      }
      if (!b.pinned) {
        b.x += ox;
        b.y += oy;
      }
    }
    pinTop(s, hoop);
  }
}

export function getSimulatedLayout(hoop: Hoop): NetLayout {
  const base = restLayout(hoop);
  const s = getSim(hoop);
  const hangPts: NetPoint[] = [];
  const bottomPts: NetPoint[] = [];
  const ringYs = [...base.ringYs];

  for (let col = 0; col < COLS; col++) {
    hangPts.push({ x: s.nodes[idx(0, col)].x, y: s.nodes[idx(0, col)].y });
    bottomPts.push({ x: s.nodes[idx(ROWS - 1, col)].x, y: s.nodes[idx(ROWS - 1, col)].y });
  }

  return { ...base, hangPts, bottomPts, ringYs };
}

export function getSimRingPoints(hoop: Hoop): NetPoint[][] {
  const s = getSim(hoop);
  const rings: NetPoint[][] = [];
  for (let row = 1; row < ROWS - 1; row++) {
    const rowPts: NetPoint[] = [];
    for (let col = 0; col < COLS; col++) {
      const n = s.nodes[idx(row, col)];
      rowPts.push({ x: n.x, y: n.y });
    }
    rings.push(rowPts);
  }
  return rings;
}
