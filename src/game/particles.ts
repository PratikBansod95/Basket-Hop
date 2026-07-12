export type ParticleKind = 'dot' | 'spark' | 'streak';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  kind: ParticleKind;
  rot: number;
  spin: number;
}

const POOL: Particle[] = [];
const ACTIVE: Particle[] = [];

function acquire(): Particle {
  return (
    POOL.pop() ?? {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      maxLife: 0,
      color: '#fff',
      size: 4,
      kind: 'dot',
      rot: 0,
      spin: 0,
    }
  );
}

function pushParticle(
  x: number,
  y: number,
  vx: number,
  vy: number,
  color: string,
  size: number,
  life: number,
  kind: ParticleKind,
): void {
  const p = acquire();
  p.x = x;
  p.y = y;
  p.vx = vx;
  p.vy = vy;
  p.life = life;
  p.maxLife = life;
  p.color = color;
  p.size = size;
  p.kind = kind;
  p.rot = Math.random() * Math.PI * 2;
  p.spin = (Math.random() - 0.5) * 10;
  ACTIVE.push(p);
}

export function spawnBurst(x: number, y: number, color: string, count = 12): void {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.45;
    const speed = 90 + Math.random() * 160;
    const kind: ParticleKind = i % 3 === 0 ? 'spark' : i % 3 === 1 ? 'streak' : 'dot';
    pushParticle(
      x,
      y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed - 70,
      color,
      kind === 'streak' ? 2 + Math.random() * 2 : 3 + Math.random() * 5,
      0.55 + Math.random() * 0.45,
      kind,
    );
  }
}

/** Extra white flash + sparks for a clean swish. */
export function spawnSwishFlash(x: number, y: number): void {
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10;
    pushParticle(x, y, Math.cos(angle) * 40, Math.sin(angle) * 40 - 20, '#ffffff', 5 + Math.random() * 4, 0.35, 'spark');
  }
  for (let i = 0; i < 8; i++) {
    pushParticle(
      x + (Math.random() - 0.5) * 30,
      y + (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 60,
      -80 - Math.random() * 120,
      '#fff8e0',
      2 + Math.random() * 2,
      0.5 + Math.random() * 0.3,
      'streak',
    );
  }
}

export function updateParticles(dt: number): void {
  for (let i = ACTIVE.length - 1; i >= 0; i--) {
    const p = ACTIVE[i];
    p.life -= dt;
    if (p.life <= 0) {
      ACTIVE.splice(i, 1);
      POOL.push(p);
      continue;
    }
    p.vy += (p.kind === 'streak' ? 180 : 380) * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += p.spin * dt;
    p.vx *= 1 - 1.2 * dt;
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D): void {
  for (const p of ACTIVE) {
    const t = p.life / p.maxLife;
    ctx.save();
    ctx.globalAlpha = Math.min(1, t * 1.15);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;

    if (p.kind === 'spark') {
      const s = p.size * t;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.35, -s * 0.35);
      ctx.lineTo(s, 0);
      ctx.lineTo(s * 0.35, s * 0.35);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.35, s * 0.35);
      ctx.lineTo(-s, 0);
      ctx.lineTo(-s * 0.35, -s * 0.35);
      ctx.closePath();
      ctx.fill();
    } else if (p.kind === 'streak') {
      ctx.fillRect(-p.size * 0.4, -p.size * 2.2 * t, p.size * 0.8, p.size * 4.4 * t);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, p.size * t, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

export function clearParticles(): void {
  while (ACTIVE.length > 0) {
    POOL.push(ACTIVE.pop()!);
  }
}
