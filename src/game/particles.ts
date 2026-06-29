export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
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
    }
  );
}

export function spawnBurst(x: number, y: number, color: string, count = 12): void {
  for (let i = 0; i < count; i++) {
    const p = acquire();
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 80 + Math.random() * 120;
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 60;
    p.life = 0.6 + Math.random() * 0.4;
    p.maxLife = p.life;
    p.color = color;
    p.size = 3 + Math.random() * 4;
    ACTIVE.push(p);
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
    p.vy += 400 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D): void {
  for (const p of ACTIVE) {
    const alpha = p.life / p.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function clearParticles(): void {
  while (ACTIVE.length > 0) {
    POOL.push(ACTIVE.pop()!);
  }
}
