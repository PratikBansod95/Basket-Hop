export const COLORS = {
  bg: '#1a1410',
  courtGreen: '#7e9a82',
  backboard: '#f5f3eb',
  backboardEdge: '#bcb9ad',
  backboardRed: '#c4321c',
  bracket: '#2c2a28',
  rim: '#e0641a',
  rimHi: '#f3a361',
  rimLo: '#6b2a08',
  netFar: 'rgba(245,243,234,0.55)',
  netNear: 'rgba(245,243,234,0.92)',
  accent: '#f3c14d',
  accentHot: '#c8341e',
  accentSwish: '#f5f3eb',
  ball: '#e0641a',
} as const;

export const HOOP_GEOMETRY = {
  backboard: { offsetX: 12, offsetTop: 80, width: 24, height: 200 },
  rimLeft: { offsetY: 60, thickness: 8, width: 15, offsetFromBackboard: 12 },
  rimRight: { offsetY: 60, thickness: 8, width: 15, gap: 95 },
} as const;

export const DIFFICULTY_TIERS = [
  { minScore: 0, minY: 380, maxY: 760 },
  { minScore: 5, minY: 320, maxY: 800 },
  { minScore: 15, minY: 280, maxY: 840 },
  { minScore: 30, minY: 240, maxY: 880 },
  { minScore: 60, minY: 220, maxY: 900 },
] as const;

export function tierForScore(score: number): { minScore: number; minY: number; maxY: number } {
  let tier: { minScore: number; minY: number; maxY: number } = DIFFICULTY_TIERS[0];
  for (const t of DIFFICULTY_TIERS) {
    if (score >= t.minScore) tier = t;
    else break;
  }
  return tier;
}
