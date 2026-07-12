import { getSkinFx, type SkinFxKind, type SkinFxProfile } from '../shop/skinFx';

/**
 * Industry-leaning 2D elemental FX (canvas):
 * - Soft additive radial blobs (not hard dots)
 * - Fire rises / ice falls / sparks have gravity
 * - Strong shell glow + surface wash; sparse secondary particles
 */

function withAlpha(color: string, alpha: number): string {
  const m = color.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  if (!m) return `rgba(255,255,255,${alpha})`;
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${Math.max(0, Math.min(1, alpha))})`;
}

function hash01(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Soft glowing disc — core of fireball/mist look. */
function drawSoftBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  alpha: number,
): void {
  if (alpha <= 0.01 || radius <= 0.2) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, withAlpha(color, alpha));
  g.addColorStop(0.35, withAlpha(color, alpha * 0.55));
  g.addColorStop(0.75, withAlpha(color, alpha * 0.12));
  g.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): string {
  const u = Math.max(0, Math.min(1, t));
  return `rgba(${Math.round(a[0] + (b[0] - a[0]) * u)}, ${Math.round(a[1] + (b[1] - a[1]) * u)}, ${Math.round(a[2] + (b[2] - a[2]) * u)}, 1)`;
}

/** Layered shell glow (hot inner rim + soft bloom). */
export function drawSkinAura(
  ctx: CanvasRenderingContext2D,
  radius: number,
  profile: SkinFxProfile,
  time: number,
  strength = 1,
): void {
  if (profile.kind === 'none') return;
  const pulse = 1 + Math.sin(time * 3.6) * profile.auraPulse * 0.22;
  const s = Math.min(1.25, strength);

  ctx.save();
  if (profile.kind !== 'shadow') {
    ctx.globalCompositeOperation = 'lighter';
  }

  // Outer bloom
  const outer = radius * (1.75 + profile.auraPulse * 0.2) * pulse;
  drawSoftBlob(ctx, 0, 0, outer, profile.auraColor, 0.28 * s);

  // Inner hot shell hugging the ball
  const inner = radius * 1.18 * pulse;
  drawSoftBlob(ctx, 0, 0, inner, profile.auraColor, 0.45 * s);

  // Tiny bright core wash (reads as “energy inside”)
  if (profile.kind !== 'shadow') {
    drawSoftBlob(ctx, -radius * 0.15, -radius * 0.2, radius * 0.55, '#ffffff', 0.12 * s);
  }

  ctx.restore();
}

export function drawSkinOverlay(
  ctx: CanvasRenderingContext2D,
  radius: number,
  kind: SkinFxKind,
  time: number,
  strength = 1,
): void {
  if (kind === 'none') return;
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalAlpha = Math.min(1, strength);

  switch (kind) {
    case 'flame':
    case 'dragon':
      drawFlameSurface(ctx, radius, time, kind === 'dragon');
      break;
    case 'ice':
      drawIceSurface(ctx, radius, time);
      break;
    case 'electro':
      drawElectroSurface(ctx, radius, time);
      break;
    case 'lava':
      drawLavaSurface(ctx, radius, time);
      break;
    case 'disco':
      drawCelestialSurface(ctx, radius, time);
      break;
    case 'neon':
      drawNeonSurface(ctx, radius, time);
      break;
    case 'galaxy':
      drawGalaxySurface(ctx, radius, time);
      break;
    case 'holographic':
      drawHoloSurface(ctx, radius, time);
      break;
    case 'shadow':
    case 'zombie':
      drawShadowSurface(ctx, radius, time, kind === 'zombie');
      break;
    default:
      break;
  }

  ctx.restore();
}

/**
 * Emission volume around the ball — physics-ish, not orbital atoms.
 * Fire rises, ice/mist falls, electro sparks fall with gravity, etc.
 */
export function drawSkinOrbit(
  ctx: CanvasRenderingContext2D,
  radius: number,
  profile: SkinFxProfile,
  time: number,
  strength = 1,
): void {
  if (profile.kind === 'none') return;
  const s = Math.min(1.3, strength);
  ctx.save();

  switch (profile.kind) {
    case 'flame':
    case 'lava':
    case 'dragon':
      emitFire(ctx, radius, time, s, profile.kind);
      break;
    case 'ice':
      emitIceMist(ctx, radius, time, s);
      break;
    case 'electro':
      emitElectroSparks(ctx, radius, time, s);
      break;
    case 'neon':
      emitNeonPulse(ctx, radius, time, s);
      break;
    case 'disco':
    case 'galaxy':
      emitStardust(ctx, radius, time, s, profile.kind === 'galaxy' || profile.kind === 'disco');
      break;
    case 'holographic':
      emitPrismFlecks(ctx, radius, time, s);
      break;
    case 'shadow':
      emitSmoke(ctx, radius, time, s);
      break;
    case 'zombie':
      emitZombieGoo(ctx, radius, time, s);
      break;
    default:
      break;
  }

  ctx.restore();
}

export function drawElementalBallFx(
  ctx: CanvasRenderingContext2D,
  radius: number,
  skinId: string,
  time: number,
  options?: {
    launched?: boolean;
    phase?: 'aura' | 'overlay' | 'orbit' | 'all';
    strength?: number;
  },
): void {
  const profile = getSkinFx(skinId);
  if (profile.kind === 'none') return;
  const qualityMul = options?.strength ?? 1;
  if (qualityMul <= 0.05) return;
  const strength = (options?.launched ? 1.2 : 0.95) * qualityMul;
  const phase = options?.phase ?? 'all';

  if (phase === 'aura' || phase === 'all') {
    drawSkinAura(ctx, radius, profile, time, strength);
  }
  if (phase === 'overlay' || phase === 'all') {
    drawSkinOverlay(ctx, radius, profile.kind, time, strength);
  }
  // Orbit particles are the heaviest layer — skip on low quality.
  if ((phase === 'orbit' || phase === 'all') && qualityMul >= 0.55) {
    drawSkinOrbit(ctx, radius, profile, time, strength);
  }
}

/* ---------- Surfaces (on-ball) ---------- */

function drawFlameSurface(ctx: CanvasRenderingContext2D, radius: number, time: number, dragon: boolean): void {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // Heat wash from bottom
  const heat = ctx.createLinearGradient(0, radius * 0.9, 0, -radius * 0.2);
  heat.addColorStop(0, dragon ? 'rgba(255, 80, 20, 0.55)' : 'rgba(255, 140, 40, 0.5)');
  heat.addColorStop(0.45, dragon ? 'rgba(255, 160, 40, 0.28)' : 'rgba(255, 200, 80, 0.28)');
  heat.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = heat;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

  // Soft flame tongues as additive blobs rising on the surface
  for (let i = 0; i < 7; i += 1) {
    const life = (time * (2.2 + i * 0.15) + hash01(i * 9.1)) % 1;
    const x = (hash01(i * 3.3) - 0.5) * radius * 1.4;
    const y = radius * 0.55 - life * radius * 1.35;
    const size = radius * (0.28 - life * 0.18) * (dragon ? 1.1 : 1);
    const col = lerpColor(
      dragon ? [255, 210, 90] : [255, 230, 120],
      dragon ? [200, 30, 10] : [255, 60, 10],
      life,
    );
    drawSoftBlob(ctx, x, y, size, col, (1 - life) * 0.55);
  }
  ctx.restore();
}

function drawIceSurface(ctx: CanvasRenderingContext2D, radius: number, time: number): void {
  const pulse = 0.5 + 0.5 * Math.sin(time * 2.8);
  const frost = ctx.createRadialGradient(-radius * 0.25, -radius * 0.3, 0, 0, 0, radius);
  frost.addColorStop(0, `rgba(240, 252, 255, ${0.35 + pulse * 0.12})`);
  frost.addColorStop(0.45, 'rgba(160, 220, 255, 0.16)');
  frost.addColorStop(1, 'rgba(80, 160, 220, 0)');
  ctx.fillStyle = frost;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

  // Crystal facets — short bright edges
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 + pulse * 0.25})`;
  ctx.lineWidth = Math.max(1, radius * 0.035);
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i += 1) {
    const a = time * 0.4 + i * 1.15;
    const x0 = Math.cos(a) * radius * 0.25;
    const y0 = Math.sin(a) * radius * 0.25;
    const x1 = Math.cos(a + 0.35) * radius * 0.85;
    const y1 = Math.sin(a + 0.2) * radius * 0.8;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(180, 235, 255, ${0.4 + pulse * 0.2})`;
  ctx.lineWidth = Math.max(1.2, radius * 0.05);
  ctx.beginPath();
  ctx.arc(0, 0, radius * (0.82 + 0.03 * Math.sin(time * 3)), 0, Math.PI * 2);
  ctx.stroke();
}

function drawElectroSurface(ctx: CanvasRenderingContext2D, radius: number, time: number): void {
  // Persistent charged rim
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  drawSoftBlob(ctx, 0, 0, radius * 0.95, 'rgba(120, 180, 255, 1)', 0.22 + 0.1 * Math.sin(time * 8));
  ctx.restore();

  const burst = Math.sin(time * 14) > 0.55;
  if (!burst) return;

  ctx.save();
  ctx.strokeStyle = 'rgba(230, 245, 255, 0.95)';
  ctx.lineWidth = Math.max(1.5, radius * 0.06);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.shadowColor = '#7eb6ff';
  ctx.shadowBlur = 10;

  for (let b = 0; b < 3; b += 1) {
    const seed = Math.floor(time * 6 + b * 17);
    const a0 = hash01(seed) * Math.PI * 2;
    const a1 = a0 + (0.8 + hash01(seed + 1) * 1.6) * (hash01(seed + 2) > 0.5 ? 1 : -1);
    ctx.beginPath();
    let x = Math.cos(a0) * radius * 0.2;
    let y = Math.sin(a0) * radius * 0.2;
    ctx.moveTo(x, y);
    const steps = 4;
    for (let s = 1; s <= steps; s += 1) {
      const t = s / steps;
      const ang = a0 + (a1 - a0) * t;
      const jag = (hash01(seed + s * 3) - 0.5) * radius * 0.35;
      x = Math.cos(ang) * radius * (0.25 + t * 0.7) + Math.cos(ang + 1.57) * jag;
      y = Math.sin(ang) * radius * (0.25 + t * 0.7) + Math.sin(ang + 1.57) * jag;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawLavaSurface(ctx: CanvasRenderingContext2D, radius: number, time: number): void {
  const heat = 0.5 + 0.5 * Math.sin(time * 2.6);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  drawSoftBlob(ctx, 0, radius * 0.1, radius * 0.9, 'rgba(255, 120, 30, 1)', 0.25 + heat * 0.2);
  ctx.restore();

  ctx.strokeStyle = `rgba(255, ${140 + heat * 80}, 40, ${0.45 + heat * 0.3})`;
  ctx.lineWidth = Math.max(1.4, radius * 0.05);
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i += 1) {
    const a0 = i * 1.25 + time * 0.25;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a0) * radius * 0.15, Math.sin(a0) * radius * 0.15);
    ctx.quadraticCurveTo(
      Math.cos(a0 + 0.4) * radius * 0.5,
      Math.sin(a0 + 0.35) * radius * 0.48,
      Math.cos(a0 + 0.95) * radius * 0.88,
      Math.sin(a0 + 0.85) * radius * 0.82,
    );
    ctx.stroke();
  }
}

function drawCelestialSurface(ctx: CanvasRenderingContext2D, radius: number, time: number): void {
  const veil = ctx.createRadialGradient(-radius * 0.2, -radius * 0.25, 0, 0, 0, radius);
  veil.addColorStop(0, 'rgba(255, 245, 210, 0.32)');
  veil.addColorStop(0.5, 'rgba(190, 160, 255, 0.14)');
  veil.addColorStop(1, 'rgba(100, 140, 255, 0)');
  ctx.fillStyle = veil;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

  for (let i = 0; i < 6; i += 1) {
    const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * 4.5 + i * 1.9));
    const a = i * 1.05 + time * 0.25;
    const d = radius * (0.2 + (i % 3) * 0.2);
    ctx.globalAlpha = tw;
    ctx.fillStyle = i % 2 === 0 ? '#fff8d8' : '#e0d0ff';
    const x = Math.cos(a) * d;
    const y = Math.sin(a) * d;
    ctx.beginPath();
    ctx.moveTo(x, y - 2.8);
    ctx.lineTo(x + 1.2, y);
    ctx.lineTo(x, y + 2.8);
    ctx.lineTo(x - 1.2, y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawNeonSurface(ctx: CanvasRenderingContext2D, radius: number, time: number): void {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const scan = ((time * 0.7) % 2) - 1;
  const y = scan * radius * 0.9;
  const band = ctx.createLinearGradient(0, y - radius * 0.18, 0, y + radius * 0.18);
  band.addColorStop(0, 'rgba(0, 255, 160, 0)');
  band.addColorStop(0.5, 'rgba(100, 255, 200, 0.55)');
  band.addColorStop(1, 'rgba(0, 255, 160, 0)');
  ctx.fillStyle = band;
  ctx.fillRect(-radius, y - radius * 0.18, radius * 2, radius * 0.36);

  ctx.shadowColor = '#39ff14';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = 'rgba(80, 255, 180, 0.7)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius * (0.78 + 0.05 * Math.sin(time * 4.5)), 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawGalaxySurface(ctx: CanvasRenderingContext2D, radius: number, time: number): void {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.rotate(time * 0.28);
  for (let i = 0; i < 3; i += 1) {
    const ox = Math.cos(i * 2.1) * radius * 0.2;
    const oy = Math.sin(i * 2.1) * radius * 0.2;
    const col = i === 0 ? 'rgba(180,120,255,1)' : i === 1 ? 'rgba(80,150,255,1)' : 'rgba(255,120,200,1)';
    drawSoftBlob(ctx, ox, oy, radius * 0.7, col, 0.22);
  }
  ctx.restore();
}

function drawHoloSurface(ctx: CanvasRenderingContext2D, radius: number, time: number): void {
  const hue = (time * 70) % 360;
  const sweep = ctx.createLinearGradient(-radius, -radius, radius, radius);
  sweep.addColorStop(0, `hsla(${hue}, 90%, 70%, 0)`);
  sweep.addColorStop(0.4, `hsla(${(hue + 50) % 360}, 95%, 72%, 0.4)`);
  sweep.addColorStop(0.55, `hsla(${(hue + 130) % 360}, 95%, 68%, 0.35)`);
  sweep.addColorStop(1, `hsla(${(hue + 220) % 360}, 90%, 70%, 0)`);
  ctx.fillStyle = sweep;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

  ctx.strokeStyle = `hsla(${(hue + 30) % 360}, 100%, 78%, 0.65)`;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.84, time * 1.8, time * 1.8 + Math.PI * 1.15);
  ctx.stroke();
}

function drawShadowSurface(
  ctx: CanvasRenderingContext2D,
  radius: number,
  time: number,
  zombie = false,
): void {
  for (let i = 0; i < 3; i += 1) {
    const phase = time * (0.9 + i * 0.2) + i;
    const x = Math.sin(phase) * radius * 0.22;
    const y = Math.cos(phase * 0.7) * radius * 0.18;
    const color = zombie ? 'rgba(60, 110, 30, 1)' : 'rgba(8, 8, 18, 1)';
    drawSoftBlob(ctx, x, y, radius * 0.55, color, zombie ? 0.28 : 0.4);
  }
  const edge = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius);
  edge.addColorStop(0, 'rgba(0,0,0,0)');
  edge.addColorStop(1, zombie ? 'rgba(40, 80, 20, 0.28)' : 'rgba(0,0,0,0.35)');
  ctx.fillStyle = edge;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
}

/* ---------- Emissions (around ball) ---------- */

function emitFire(
  ctx: CanvasRenderingContext2D,
  radius: number,
  time: number,
  strength: number,
  kind: 'flame' | 'lava' | 'dragon',
): void {
  ctx.globalCompositeOperation = 'lighter';
  const count = kind === 'dragon' ? 18 : 16;
  for (let i = 0; i < count; i += 1) {
    const seed = i * 12.9898;
    const life = (time * (1.6 + hash01(seed) * 1.2) + hash01(seed + 1)) % 1;
    const spread = (hash01(seed + 2) - 0.5) * radius * 1.6;
    const x = spread * (1 - life * 0.35);
    // Rise from bottom of ball
    const y = radius * 0.65 - life * radius * (1.8 + hash01(seed + 3) * 0.6);
    const size = radius * (0.42 - life * 0.32) * (0.7 + hash01(seed + 4) * 0.5);
    const hot = kind === 'dragon' ? ([255, 200, 80] as [number, number, number]) : ([255, 230, 120] as [number, number, number]);
    const cool = kind === 'lava' ? ([255, 40, 10] as [number, number, number]) : ([255, 50, 0] as [number, number, number]);
    const col = lerpColor(hot, cool, life * life);
    drawSoftBlob(ctx, x, y, size, col, (1 - life) * 0.65 * strength);
  }
}

function emitIceMist(ctx: CanvasRenderingContext2D, radius: number, time: number, strength: number): void {
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i += 1) {
    const seed = i * 7.7;
    const life = (time * (0.7 + hash01(seed) * 0.5) + hash01(seed + 1)) % 1;
    const x = (hash01(seed + 2) - 0.5) * radius * 1.8 + Math.sin(time + seed) * radius * 0.1;
    // Drift downward like cold mist
    const y = -radius * 0.5 + life * radius * 1.9;
    const size = radius * (0.28 - life * 0.16);
    drawSoftBlob(ctx, x, y, size, 'rgba(200, 240, 255, 1)', (1 - life) * 0.4 * strength);
  }
  // A few bright crystals falling slowly
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 5; i += 1) {
    const seed = i * 19.1;
    const life = (time * 0.55 + hash01(seed)) % 1;
    const x = (hash01(seed + 1) - 0.5) * radius * 1.5;
    const y = -radius * 0.2 + life * radius * 1.5;
    ctx.globalAlpha = (1 - life) * 0.85 * strength;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 1.2 + hash01(seed + 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function emitElectroSparks(ctx: CanvasRenderingContext2D, radius: number, time: number, strength: number): void {
  // Occasional outer arc outside the ball
  if (Math.sin(time * 11) > 0.7) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(180, 220, 255, 0.85)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#8ec5ff';
    ctx.shadowBlur = 8;
    const a0 = hash01(Math.floor(time * 5)) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.25, a0, a0 + 0.9);
    ctx.stroke();
    ctx.restore();
  }

  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 10; i += 1) {
    const seed = i * 5.3;
    const life = (time * (2.5 + hash01(seed)) + hash01(seed + 1)) % 1;
    const ang = hash01(seed + 2) * Math.PI * 2;
    // Spawn near rim, fall with gravity
    const x = Math.cos(ang) * radius * (1.05 + life * 0.4) + (hash01(seed + 3) - 0.5) * radius * 0.3;
    const y = Math.sin(ang) * radius * 0.4 + life * life * radius * 1.4;
    const size = radius * (0.12 - life * 0.08);
    drawSoftBlob(ctx, x, y, Math.max(1.5, size), 'rgba(200, 230, 255, 1)', (1 - life) * 0.75 * strength);
  }
}

function emitNeonPulse(ctx: CanvasRenderingContext2D, radius: number, time: number, strength: number): void {
  ctx.globalCompositeOperation = 'lighter';
  const ringLife = (time * 1.1) % 1;
  const ringR = radius * (1.05 + ringLife * 0.7);
  const alpha = (1 - ringLife) * 0.45 * strength;
  ctx.strokeStyle = withAlpha('rgba(60, 255, 160, 1)', alpha);
  ctx.lineWidth = 3 * (1 - ringLife * 0.6);
  ctx.shadowColor = '#39ff14';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, ringR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  for (let i = 0; i < 6; i += 1) {
    const seed = i * 4.4;
    const life = (time * 1.4 + hash01(seed)) % 1;
    const ang = hash01(seed + 1) * Math.PI * 2 + time * 0.5;
    const x = Math.cos(ang) * radius * (1.1 + life * 0.5);
    const y = Math.sin(ang) * radius * (1.1 + life * 0.5);
    drawSoftBlob(ctx, x, y, radius * 0.12, 'rgba(80, 255, 180, 1)', (1 - life) * 0.5 * strength);
  }
}

function emitStardust(
  ctx: CanvasRenderingContext2D,
  radius: number,
  time: number,
  strength: number,
  galaxy: boolean,
): void {
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 12; i += 1) {
    const seed = i * 8.2;
    const life = (time * (0.5 + hash01(seed) * 0.4) + hash01(seed + 1)) % 1;
    const ang = hash01(seed + 2) * Math.PI * 2 + time * (galaxy ? 0.35 : 0.2);
    const dist = radius * (1.05 + life * 0.55 + hash01(seed + 3) * 0.2);
    const x = Math.cos(ang) * dist;
    const y = Math.sin(ang) * dist * 0.9;
    const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 5 + i));
    const col = galaxy
      ? i % 2 === 0
        ? 'rgba(180,140,255,1)'
        : 'rgba(255,255,255,1)'
      : i % 2 === 0
        ? 'rgba(255,240,200,1)'
        : 'rgba(210,180,255,1)';
    drawSoftBlob(ctx, x, y, radius * (0.08 + (1 - life) * 0.06), col, tw * (1 - life * 0.5) * 0.7 * strength);
  }
}

function emitPrismFlecks(ctx: CanvasRenderingContext2D, radius: number, time: number, strength: number): void {
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 8; i += 1) {
    const seed = i * 6.6;
    const life = (time * 1.2 + hash01(seed)) % 1;
    const ang = hash01(seed + 1) * Math.PI * 2 + time * 0.8;
    const x = Math.cos(ang) * radius * (1.1 + life * 0.35);
    const y = Math.sin(ang) * radius * (1.1 + life * 0.35);
    const hue = (time * 90 + i * 45) % 360;
    drawSoftBlob(ctx, x, y, radius * 0.14, `hsla(${hue}, 95%, 70%, 1)`, (1 - life) * 0.55 * strength);
  }
}

function emitSmoke(ctx: CanvasRenderingContext2D, radius: number, time: number, strength: number): void {
  for (let i = 0; i < 10; i += 1) {
    const seed = i * 11.3;
    const life = (time * (0.45 + hash01(seed) * 0.3) + hash01(seed + 1)) % 1;
    const x = (hash01(seed + 2) - 0.5) * radius * 1.4;
    const y = radius * 0.2 - life * radius * 1.6;
    const size = radius * (0.35 + life * 0.45);
    drawSoftBlob(ctx, x, y, size, 'rgba(25, 25, 40, 1)', (1 - life) * 0.35 * strength);
  }
}

function emitZombieGoo(ctx: CanvasRenderingContext2D, radius: number, time: number, strength: number): void {
  for (let i = 0; i < 10; i += 1) {
    const seed = i * 9.4;
    const life = (time * (0.6 + hash01(seed) * 0.4) + hash01(seed + 1)) % 1;
    const x = (hash01(seed + 2) - 0.5) * radius * 1.3;
    // Goo drips downward
    const y = -radius * 0.1 + life * radius * 1.7;
    const size = radius * (0.22 - life * 0.1);
    drawSoftBlob(ctx, x, y, size, 'rgba(120, 200, 50, 1)', (1 - life) * 0.45 * strength);
  }
}
