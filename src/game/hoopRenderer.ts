import { COLORS, HOOP_GEOMETRY } from './palette';
import { buildNetLayout, type NetLayout, type NetPoint } from './netLayout';
import { getSimRingPoints, getSimulatedLayout } from './netPhysics';
import type { Hoop } from './types';

const le = HOOP_GEOMETRY;

function drawBackboard(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const o = le.backboard.offsetX * 2;
  const h = le.backboard.height;
  const left = x - o / 2;
  const top = y - le.backboard.offsetTop;
  const edgeH = 6;

  ctx.fillStyle = COLORS.backboardEdge;
  ctx.fillRect(left, top - edgeH, o, edgeH);

  const grad = ctx.createLinearGradient(left, top, left, top + h);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.18, COLORS.backboard);
  grad.addColorStop(1, '#d3d0c6');
  ctx.fillStyle = grad;
  ctx.fillRect(left, top, o, h);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(left, top, 2, h);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(left + o - 2, top, 2, h);
  ctx.strokeStyle = 'rgba(20,18,16,0.85)';
  ctx.lineWidth = 2;
  ctx.strokeRect(left + 1, top + 1, o - 2, h - 2);

  const sqW = o * 0.34;
  const sqH = h * 0.36;
  const sqX = x - sqW / 2 + 6;
  const sqY = top + h * 0.5;
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = COLORS.backboardRed;
  ctx.strokeRect(sqX, sqY, sqW, sqH);

  ctx.fillStyle = COLORS.bracket;
  ctx.fillRect(x + 6, y + 36, 16, 30);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(x + 6, y + 36, 2, 30);
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(x + 14, y + 42, 1.8, 0, Math.PI * 2);
  ctx.arc(x + 14, y + 60, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

function withSideFlip(ctx: CanvasRenderingContext2D, hoop: Hoop, draw: () => void): void {
  ctx.save();
  if (hoop.side === 'left') {
    ctx.translate(hoop.x, 0);
    ctx.scale(-1, 1);
    ctx.translate(-hoop.x, 0);
  }
  draw();
  ctx.restore();
}

/** Rim loops + clip strands where the net meets the hoop. */
function drawTopNet(ctx: CanvasRenderingContext2D, layout: NetLayout): void {
  const { topPts, hangPts, strands, cy, ry } = layout;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = COLORS.netNear;
  ctx.lineWidth = 1.35;
  for (let i = 0; i <= strands; i++) {
    const rim = topPts[i];
    const hang = hangPts[i];
    ctx.beginPath();
    ctx.moveTo(rim.x, rim.y);
    ctx.lineTo(hang.x, hang.y + 3);
    ctx.stroke();
  }

  ctx.lineWidth = 1.15;
  for (let i = 0; i < strands; i++) {
    const a = topPts[i];
    const b = topPts[i + 1];
    const mx = (a.x + b.x) / 2;
    const my = cy - ry * 0.55;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.stroke();
  }
}

/** Scalloped bottom edge + strand tips. */
function drawBottomNet(ctx: CanvasRenderingContext2D, layout: NetLayout): void {
  const { bottomPts, strands } = layout;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = COLORS.netNear;
  ctx.lineWidth = 1.2;

  for (let i = 0; i < strands; i++) {
    const a = bottomPts[i];
    const b = bottomPts[i + 1];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2 + 5.5;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.stroke();
  }

  ctx.fillStyle = COLORS.netNear;
  for (let i = 0; i <= strands; i++) {
    const p = bottomPts[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y + 1.5, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawNetBody(ctx: CanvasRenderingContext2D, layout: NetLayout, ringRows: NetPoint[][]): void {
  const { hangPts, bottomPts, strands } = layout;

  ctx.strokeStyle = COLORS.netNear;
  ctx.lineWidth = 1.2;
  ctx.lineCap = 'round';
  for (let i = 0; i <= strands; i++) {
    ctx.beginPath();
    ctx.moveTo(hangPts[i].x, hangPts[i].y + 3);
    ctx.lineTo(bottomPts[i].x, bottomPts[i].y);
    ctx.stroke();
  }

  ctx.strokeStyle = COLORS.netFar;
  ctx.lineWidth = 1;
  for (const row of ringRows) {
    ctx.beginPath();
    ctx.moveTo(row[0].x, row[0].y);
    for (let i = 1; i < row.length; i++) {
      ctx.lineTo(row[i].x, row[i].y);
    }
    ctx.stroke();
  }
}

export function drawHoopShadow(ctx: CanvasRenderingContext2D, hoop: Hoop, floorY: number): void {
  const dist = floorY - (hoop.y + 120);
  const fade = Math.max(0, Math.min(1, dist / 600));
  const scale = 1 - fade * 0.3;
  const alpha = 0.3 * (1 - fade * 0.4);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(hoop.x, floorY - 8, 88 * scale, 7 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawHoopNet(ctx: CanvasRenderingContext2D, hoop: Hoop): void {
  withSideFlip(ctx, hoop, () => {
    const { rimLeft: rl, rimRight: rr } = le;
    const rimY = hoop.y + rl.offsetY;
    const offset = rl.offsetFromBackboard;
    const rimRightX = hoop.x - offset;
    const rimLeftX = hoop.x - rr.gap - offset - rr.width;
    const cx = (rimLeftX + rimRightX) / 2;
    const cy = rimY + rl.thickness / 2;
    const rx = (rimRightX - rimLeftX) / 2;
    const ry = 7;
    const thick = rl.thickness + 1;

    ctx.save();
    ctx.translate(rimRightX, rimY);
    ctx.rotate(-hoop.tilt);
    ctx.translate(-rimRightX, -rimY);
    ctx.lineCap = 'butt';
    ctx.lineWidth = thick;
    ctx.strokeStyle = COLORS.rimLo;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, Math.PI, Math.PI * 2);
    ctx.stroke();

    const rest = buildNetLayout(cx, cy, rx, ry, rimLeftX, rimRightX);
    const net = getSimulatedLayout(hoop);
    const ringRows = getSimRingPoints(hoop);
    const drawLayout: NetLayout = { ...rest, hangPts: net.hangPts, bottomPts: net.bottomPts };

    drawTopNet(ctx, drawLayout);
    drawNetBody(ctx, drawLayout, ringRows);
    drawBottomNet(ctx, drawLayout);
    ctx.restore();
    drawBackboard(ctx, hoop.x, hoop.y);
  });
}

export function drawHoopRim(ctx: CanvasRenderingContext2D, hoop: Hoop): void {
  withSideFlip(ctx, hoop, () => {
    const { rimLeft: rl, rimRight: rr } = le;
    const rimY = hoop.y + rl.offsetY;
    const offset = rl.offsetFromBackboard;
    const rimRightX = hoop.x - offset;
    const rimLeftX = hoop.x - rr.gap - offset - rr.width;
    const cx = (rimLeftX + rimRightX) / 2;
    const cy = rimY + rl.thickness / 2;
    const rx = (rimRightX - rimLeftX) / 2;
    const ry = 7;
    const thick = rl.thickness + 1;

    ctx.save();
    ctx.translate(rimRightX, rimY);
    ctx.rotate(-hoop.tilt);
    ctx.translate(-rimRightX, -rimY);
    ctx.lineWidth = thick;
    const grad = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
    grad.addColorStop(0, COLORS.rimHi);
    grad.addColorStop(0.5, COLORS.rim);
    grad.addColorStop(1, COLORS.rimLo);
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,225,180,0.75)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 1.5, rx - 1, ry - 1, 0, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.restore();
  });
}
