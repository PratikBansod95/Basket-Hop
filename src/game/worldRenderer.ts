import { CANVAS_HEIGHT, CANVAS_WIDTH, WORLD } from './constants';
import { backgroundAssets } from './assetLoader';

const W = CANVAS_WIDTH;
const H = CANVAS_HEIGHT;

const OPEN_COURT_TOP = WORLD.stadiumTop - 220;
const OPEN_COURT_BOTTOM = WORLD.courtFloorY + 60;

/** Court + open sky merge in world space (sky image is screen-space behind this). */
export function drawWorld(ctx: CanvasRenderingContext2D, climbOffset: number, _time: number): void {
  const viewTop = -climbOffset;
  const viewBottom = viewTop + H;

  if (backgroundAssets.openCourt) {
    drawOpenCourtGround(ctx, viewTop, viewBottom);
    drawBelowCourtVoid(ctx, viewTop, viewBottom);
    return;
  }

  if (backgroundAssets.stadiumInterior) {
    drawHdStadiumInterior(ctx, viewTop, viewBottom);
  } else {
    drawRooftopLayer(ctx, viewTop, viewBottom);
    drawStadiumShell(ctx, viewTop, viewBottom);
    drawStadiumInterior(ctx, viewTop, viewBottom);
  }

  drawCourtFloor(ctx, viewTop, viewBottom);
  drawBelowCourtVoid(ctx, viewTop, viewBottom);
}

/** Open court with transparent sky slot — sky-day.png shows through the top. */
function drawOpenCourtGround(ctx: CanvasRenderingContext2D, viewTop: number, viewBottom: number): void {
  const img = backgroundAssets.openCourt!;
  const y0 = OPEN_COURT_TOP;
  const y1 = OPEN_COURT_BOTTOM;
  if (y1 < viewTop || y0 > viewBottom) return;

  const top = Math.max(y0, viewTop);
  const bottom = Math.min(y1, viewBottom);
  const destH = bottom - top;
  const srcH = (destH / (y1 - y0)) * img.height;
  const srcY = ((top - y0) / (y1 - y0)) * img.height;

  ctx.drawImage(img, 0, srcY, img.width, srcH, 0, top, W, destH);
}

function drawHdStadiumInterior(ctx: CanvasRenderingContext2D, viewTop: number, viewBottom: number): void {
  const img = backgroundAssets.stadiumInterior!;
  const y0 = WORLD.rooftopEnd - 200;
  const y1 = WORLD.courtFloorY;
  if (y1 < viewTop || y0 > viewBottom) return;

  const top = Math.max(y0, viewTop);
  const bottom = Math.min(y1, viewBottom);
  const destH = bottom - top;
  const srcH = (destH / (y1 - y0)) * img.naturalHeight;
  const srcY = ((top - y0) / (y1 - y0)) * img.naturalHeight;

  ctx.drawImage(img, 0, srcY, img.naturalWidth, srcH, 0, top, W, destH);
}

function drawRooftopLayer(ctx: CanvasRenderingContext2D, viewTop: number, viewBottom: number): void {
  const y0 = WORLD.rooftopEnd - 350;
  const y1 = WORLD.stadiumTop;
  if (y1 < viewTop || y0 > viewBottom) return;

  ctx.fillStyle = '#4a5568';
  ctx.fillRect(0, y0, W, y1 - y0);

  ctx.fillStyle = '#5c7a52';
  ctx.fillRect(0, y0 + 100, W, 70);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(W * 0.15, y0 + 108, W * 0.7, 52);

  for (const tx of [80, W - 80]) {
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(tx - 8, y0 - 55, 16, 75);
    ctx.fillStyle = '#f6e05e';
    ctx.beginPath();
    ctx.arc(tx, y0 - 55, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawStadiumShell(ctx: CanvasRenderingContext2D, viewTop: number, viewBottom: number): void {
  const y0 = WORLD.stadiumTop;
  const y1 = WORLD.courtFloorY - 120;
  if (y1 < viewTop || y0 > viewBottom) return;

  ctx.fillStyle = '#6b5b4f';
  ctx.beginPath();
  ctx.moveTo(0, y1);
  ctx.lineTo(0, y0 + 70);
  ctx.quadraticCurveTo(W / 2, y0 - 35, W, y0 + 70);
  ctx.lineTo(W, y1);
  ctx.closePath();
  ctx.fill();
}

function drawStadiumInterior(ctx: CanvasRenderingContext2D, viewTop: number, viewBottom: number): void {
  const ceilY = WORLD.stadiumTop + 50;
  const wallEnd = WORLD.courtFloorY - 200;
  if (wallEnd < viewTop || ceilY > viewBottom) return;

  const ceilGrad = ctx.createLinearGradient(0, ceilY, 0, ceilY + 180);
  ceilGrad.addColorStop(0, '#9a8a6a');
  ceilGrad.addColorStop(1, '#c5b58e');
  ctx.fillStyle = ceilGrad;
  ctx.fillRect(0, ceilY, W, 180);

  drawCeilingLights(ctx, ceilY);
  drawBleachers(ctx, ceilY + 160, 260);

  const greenY = wallEnd - 110;
  ctx.fillStyle = '#7e9a82';
  ctx.fillRect(0, greenY, W, 95);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(0, greenY, W, 3);
}

function drawCeilingLights(ctx: CanvasRenderingContext2D, ceilY: number): void {
  for (let i = 0; i < 5; i++) {
    const lx = W * (0.12 + i * 0.19);
    const g = ctx.createRadialGradient(lx, ceilY + 28, 4, lx, ceilY + 28, 75);
    g.addColorStop(0, 'rgba(255,240,180,0.5)');
    g.addColorStop(1, 'rgba(255,240,180,0)');
    ctx.fillStyle = g;
    ctx.fillRect(lx - 75, ceilY, 150, 110);
    ctx.fillStyle = '#fff3c8';
    ctx.fillRect(lx - 16, ceilY + 8, 32, 20);
  }
}

function drawBleachers(ctx: CanvasRenderingContext2D, top: number, height: number): void {
  drawBench(ctx, W * 0.06, top, W * 0.36, height * 0.35, 3);
  drawBench(ctx, W * 0.55, top, W * 0.32, height * 0.35, 2);
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
  }
}

function drawCourtFloor(ctx: CanvasRenderingContext2D, viewTop: number, viewBottom: number): void {
  const floorTop = WORLD.courtFloorY - 170;
  const floorBottom = WORLD.courtFloorY + 40;
  if (floorBottom < viewTop || floorTop > viewBottom) return;

  const top = Math.max(floorTop, viewTop);
  const bottom = Math.min(floorBottom, viewBottom);

  if (backgroundAssets.courtTile) {
    drawTiledCourt(ctx, top, bottom);
  } else {
    drawProceduralCourt(ctx, top, bottom);
  }

  if (viewBottom > WORLD.courtFloorY - 25 && viewTop < WORLD.courtFloorY + 30) {
    ctx.strokeStyle = 'rgba(255,255,255,0.65)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, WORLD.courtFloorY - 5);
    ctx.lineTo(W, WORLD.courtFloorY - 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W / 2, WORLD.courtFloorY - 5);
    ctx.lineTo(W / 2, floorBottom);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(W / 2, WORLD.courtFloorY + 25, W * 0.28, 42, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawTiledCourt(ctx: CanvasRenderingContext2D, top: number, bottom: number): void {
  const img = backgroundAssets.courtTile!;
  const tileH = (img.naturalHeight / img.naturalWidth) * W;
  let y = top - ((top - WORLD.courtFloorY + 170) % tileH);
  while (y < bottom) {
    const clipTop = Math.max(y, top);
    const clipBottom = Math.min(y + tileH, bottom);
    if (clipBottom > clipTop) {
      const srcY = ((clipTop - y) / tileH) * img.naturalHeight;
      const srcH = ((clipBottom - clipTop) / tileH) * img.naturalHeight;
      ctx.drawImage(img, 0, srcY, img.naturalWidth, srcH, 0, clipTop, W, clipBottom - clipTop);
    }
    y += tileH;
  }
}

function drawProceduralCourt(ctx: CanvasRenderingContext2D, top: number, bottom: number): void {
  const grad = ctx.createLinearGradient(0, top, 0, bottom);
  grad.addColorStop(0, '#c98a47');
  grad.addColorStop(0.55, '#a86a2c');
  grad.addColorStop(1, '#8a5520');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, W, bottom - top);

  ctx.strokeStyle = 'rgba(40,20,8,0.35)';
  for (let y = top; y < bottom; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
}

function drawBelowCourtVoid(ctx: CanvasRenderingContext2D, viewTop: number, viewBottom: number): void {
  const voidTop = WORLD.courtFloorY + 40;
  if (viewBottom <= voidTop) return;

  const top = Math.max(voidTop, viewTop);
  const grad = ctx.createLinearGradient(0, top, 0, viewBottom);
  grad.addColorStop(0, '#8a5520');
  grad.addColorStop(0.45, '#5c3818');
  grad.addColorStop(1, '#3a2410');
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, W, viewBottom - top);
}
