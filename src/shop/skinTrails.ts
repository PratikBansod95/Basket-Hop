export type TrailMode = 'orb' | 'neon' | 'ember' | 'ice' | 'spark' | 'ripple' | 'smoke' | 'star';

export interface SkinTrailStyle {
  colors: readonly string[];
  mode: TrailMode;
  /** Base opacity multiplier */
  alpha: number;
  /** Relative ghost size */
  scale: number;
  glow?: boolean;
}

const DEFAULT_TRAIL: SkinTrailStyle = {
  colors: ['rgba(255, 170, 90, 0.95)'],
  mode: 'orb',
  alpha: 1,
  scale: 1,
};

/** Per-skin flight trails — colors/modes match ball identity. */
export const SKIN_TRAILS: Record<string, SkinTrailStyle> = {
  classic: {
    colors: ['rgba(255, 170, 90, 0.95)', 'rgba(232, 120, 48, 0.85)'],
    mode: 'orb',
    alpha: 1,
    scale: 1,
  },
  neon: {
    colors: ['#39ff14', '#00fff0', '#b8ff66'],
    mode: 'neon',
    alpha: 1.15,
    scale: 1.05,
    glow: true,
  },
  galaxy: {
    colors: ['#c4b5fd', '#60a5fa', '#f0abfc', '#ffffff'],
    mode: 'star',
    alpha: 1.1,
    scale: 0.95,
    glow: true,
  },
  flame: {
    colors: ['#ffcc33', '#ff6b00', '#ff3300'],
    mode: 'ember',
    alpha: 1.2,
    scale: 1.08,
    glow: true,
  },
  ice: {
    colors: ['#e0f7ff', '#7dd3fc', '#ffffff'],
    mode: 'ice',
    alpha: 1.1,
    scale: 1,
    glow: true,
  },
  zombie: {
    colors: ['#a3e635', '#65a30d', '#84cc16', 'rgba(40, 60, 20, 0.7)'],
    mode: 'smoke',
    alpha: 1.05,
    scale: 1.15,
  },
  electro: {
    colors: ['#93c5fd', '#3b82f6', '#e0f2fe'],
    mode: 'neon',
    alpha: 1.2,
    scale: 1,
    glow: true,
  },
  tech: {
    colors: ['#22d3ee', '#67e8f9', '#a5f3fc'],
    mode: 'ripple',
    alpha: 1.05,
    scale: 1.1,
  },
  camo: {
    colors: ['#a3e635', '#65a30d', '#4d7c0f'],
    mode: 'orb',
    alpha: 0.95,
    scale: 1,
  },
  holographic: {
    colors: ['#f0abfc', '#67e8f9', '#a5b4fc', '#fda4af'],
    mode: 'ripple',
    alpha: 1.15,
    scale: 1.05,
    glow: true,
  },
  lava: {
    colors: ['#fbbf24', '#f97316', '#ef4444', '#7f1d1d'],
    mode: 'ember',
    alpha: 1.25,
    scale: 1.1,
    glow: true,
  },
  shadow: {
    colors: ['rgba(30, 30, 40, 0.85)', 'rgba(90, 90, 110, 0.55)', 'rgba(15, 15, 20, 0.7)'],
    mode: 'smoke',
    alpha: 1,
    scale: 1.25,
  },
  dragon: {
    colors: ['#fbbf24', '#dc2626', '#7f1d1d', '#ea580c'],
    mode: 'ember',
    alpha: 1.25,
    scale: 1.12,
    glow: true,
  },
  disco: {
    colors: ['#fef9c3', '#e0e7ff', '#f0abfc', '#ffffff'],
    mode: 'spark',
    alpha: 1.25,
    scale: 1,
    glow: true,
  },
};

export function getSkinTrail(skinId: string): SkinTrailStyle {
  return SKIN_TRAILS[skinId] ?? DEFAULT_TRAIL;
}
