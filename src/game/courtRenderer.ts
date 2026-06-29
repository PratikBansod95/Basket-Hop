import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants';
import { COLORS } from './palette';

const W = CANVAS_WIDTH;
const H = CANVAS_HEIGHT;
const CEIL = H * 0.18;
const WALL_END = H * 0.52;
const GREEN_TOP = H * 0.44;
const GREEN_END = H * 0.48;
const FLOOR_START = H * 0.52;

let planks: { y: number; height: number; shade: number }[] | null = null;

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getPlanks() {
  if (planks) return planks;
  const rand = rng(2594659345);
  const list: { y: number; height: number; shade: number }[] = [];
  let y = H * 0.52;
  while (y < H) {
    const height = Math.min(22 + rand() * 18, H - y);
    list.push({ y, height, shade: -0.06 + rand() * 0.12 });
    y += height;
  }
  planks = list;
  return list;
}

function drawCeiling(ctx: CanvasRenderingContext2D): void {
  const grad = ctx.createLinearGradient(0, 0, 0, CEIL);
  grad.addColorStop(0, '#9a8a6a');
  grad.addColorStop(0.6, '#c5b58e');
  grad.addColorStop(1, '#dccba2');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, CEIL);

  ctx.strokeStyle = 'rgba(80,60,30,0.35)';
  ctx.lineWidth = 1;
  const cols = 6;
  const rows = 3;
  for (let c = 1; c < cols; c++) {
    ctx.beginPath();
    ctx.moveTo((c / cols) * W, 0);
    ctx.lineTo((c / cols) * W, CEIL);
    ctx.stroke();
  }
  for (let r = 1; r < rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, (r / rows) * CEIL);
    ctx.lineTo(W, (r / rows) * CEIL);
    ctx.stroke();
  }

  const cellW = W / cols;
  const cellH = CEIL / rows;
  const windows = [
    [0, 1], [2, 1], [4, 1], [1, 0], [3, 0], [5, 0], [1, 2], [3, 2], [5, 2],
  ];
  for (const [cx, cy] of windows) {
    const wx = cx * cellW + cellW * 0.18;
    const wy = cy * cellH + cellH * 0.28;
    const ww = cellW * 0.64;
    const wh = cellH * 0.44;
    ctx.fillStyle = '#fff3c8';
    ctx.fillRect(wx, wy, ww, wh);
    const glow = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, ww * 0.1, wx + ww / 2, wy + wh / 2, ww * 1.4);
    glow.addColorStop(0, 'rgba(255,240,180,0.45)');
    glow.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(wx - ww, wy - wh * 0.6, ww * 3, wh * 2.2);
    ctx.strokeStyle = 'rgba(40,30,15,0.4)';
    ctx.strokeRect(wx, wy, ww, wh);
  }
}

function drawBleachers(ctx: CanvasRenderingContext2D, top: number, height: number): void {
  drawBench(ctx, W * 0.06, top + height * 0.12, W * 0.36, height * 0.22, 3);
  drawBench(ctx, W * 0.52, top + height * 0.12, W * 0.3, height * 0.22, 2);
}

function drawBench(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  rows: number,
): void {
  ctx.fillStyle = '#8a7858';
  ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
  const seatW = (w - (rows + 1) * 3) / rows;
  for (let i = 0; i < rows; i++) {
    const sx = x + 3 + i * (seatW + 3);
    const grad = ctx.createLinearGradient(sx, y, sx, y + h);
    grad.addColorStop(0, '#aab3a4');
    grad.addColorStop(1, '#909a8e');
    ctx.fillStyle = grad;
    ctx.fillRect(sx, y, seatW, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx, y, seatW, h);
    ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(sx - h, y);
    ctx.lineTo(sx - h + h * 1.4, y);
    ctx.lineTo(sx + h * 1.4, y + h);
    ctx.lineTo(sx, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#7a6a4a';
    ctx.fillRect(sx, y + h * 0.5 - 1, seatW, 2);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - 2, y - 2, w + 4, 2);
  ctx.fillRect(x - 2, y + h, w + 4, 2);
}

function drawWall(ctx: CanvasRenderingContext2D): void {
  const top = CEIL;
  const end = WALL_END;
  const grad = ctx.createLinearGradient(0, top, 0, end);
  grad.addColorStop(0, '#c5b58e');
  grad.addColorStop(0.5, '#d8c89f');
  grad.addColorStop(1, '#cdbb91');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, W, end - top);

  ctx.strokeStyle = 'rgba(80,60,30,0.18)';
  for (let y = top + 28; y < end; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  const plankH = 28;
  const stagger = 60;
  for (let row = 0; row < Math.ceil((end - top) / plankH); row++) {
    const py = top + row * plankH;
    const off = row % 2 ? stagger / 2 : 0;
    for (let x = off; x < W; x += stagger) {
      ctx.beginPath();
      ctx.moveTo(x, py);
      ctx.lineTo(x, py + plankH);
      ctx.stroke();
    }
  }

  drawBleachers(ctx, top, end - top);

  const greenH = GREEN_END - GREEN_TOP;
  ctx.fillStyle = COLORS.courtGreen;
  ctx.fillRect(0, GREEN_TOP, W, greenH);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(0, GREEN_TOP, W, 2);
  ctx.fillStyle = '#1a1612';
  ctx.fillRect(0, GREEN_END, W, 2);
}

function drawWoodFloor(ctx: CanvasRenderingContext2D): void {
  const top = FLOOR_START;
  const grad = ctx.createLinearGradient(0, top, 0, H);
  grad.addColorStop(0, '#c98a47');
  grad.addColorStop(0.5, '#a86a2c');
  grad.addColorStop(1, '#7a4818');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, W, H - top);

  const shadow = ctx.createLinearGradient(0, top, 0, top + 60);
  shadow.addColorStop(0, 'rgba(20,10,4,0.55)');
  shadow.addColorStop(1, 'rgba(20,10,4,0)');
  ctx.fillStyle = shadow;
  ctx.fillRect(0, top, W, 60);

  const spot = ctx.createRadialGradient(W * 0.5, top - H * 0.05, 20, W * 0.5, top - H * 0.05, H * 0.9);
  spot.addColorStop(0, 'rgba(255,220,160,0.18)');
  spot.addColorStop(1, 'rgba(255,220,160,0)');
  ctx.fillStyle = spot;
  ctx.fillRect(0, top, W, H - top);

  const boardList = getPlanks();
  for (let i = 0; i < boardList.length; i++) {
    const p = boardList[i];
    if (p.shade > 0) {
      ctx.fillStyle = `rgba(40,20,8,${p.shade * 0.7})`;
      ctx.fillRect(0, p.y, W, p.height);
    }
    ctx.strokeStyle = 'rgba(40,20,8,0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, p.y + 0.5);
    ctx.lineTo(W, p.y + 0.5);
    ctx.stroke();

    const stagger = i % 2 ? 120 : 0;
    ctx.strokeStyle = 'rgba(40,20,8,0.4)';
    for (let x = stagger; x < W; x += 240) {
      ctx.beginPath();
      ctx.moveTo(x, p.y);
      ctx.lineTo(x, p.y + p.height);
      ctx.stroke();
    }
  }

  drawCourtLines(ctx, top);
}

function drawCourtLines(ctx: CanvasRenderingContext2D, floorTop: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, floorTop + 5);
  ctx.lineTo(W, floorTop + 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W * 0.5, floorTop + 5);
  ctx.lineTo(W * 0.5, H);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(W * 0.5, H * 0.75, W * 0.35, H * 0.12, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

export function drawCourt(ctx: CanvasRenderingContext2D, scrollY = 0): void {
  drawCeiling(ctx);
  drawWall(ctx);
  drawWoodFloor(ctx);
  drawClimbExtension(ctx, scrollY);
}

/** Extra wood floor tiles above as the player climbs */
function drawClimbExtension(ctx: CanvasRenderingContext2D, scrollY: number): void {
  if (scrollY <= 0) return;

  const top = FLOOR_START - scrollY;
  const grad = ctx.createLinearGradient(0, top - 400, 0, top);
  grad.addColorStop(0, '#a86a2c');
  grad.addColorStop(1, '#c98a47');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top - 400, W, 400 + scrollY);

  ctx.strokeStyle = 'rgba(40,20,8,0.35)';
  ctx.lineWidth = 1.2;
  for (let y = top; y > top - 400; y -= 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}
