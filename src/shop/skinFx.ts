export type SkinFxKind =
  | 'none'
  | 'flame'
  | 'ice'
  | 'electro'
  | 'lava'
  | 'dragon'
  | 'disco'
  | 'zombie'
  | 'neon'
  | 'galaxy'
  | 'holographic'
  | 'shadow';

export interface SkinFxProfile {
  kind: SkinFxKind;
  auraColor: string;
  /** 0..1 pulse amplitude */
  auraPulse: number;
  particleCount: number;
  /** Shop card CSS glow accent */
  shopGlow: string;
}

const NONE: SkinFxProfile = {
  kind: 'none',
  auraColor: 'rgba(255,255,255,0)',
  auraPulse: 0,
  particleCount: 0,
  shopGlow: 'transparent',
};

export const ELEMENTAL_SKIN_IDS = [
  'flame',
  'ice',
  'electro',
  'lava',
  'dragon',
  'disco',
  'zombie',
  'neon',
  'galaxy',
  'holographic',
  'shadow',
] as const;

const PROFILES: Record<string, SkinFxProfile> = {
  flame: {
    kind: 'flame',
    auraColor: 'rgba(255, 120, 40, 0.65)',
    auraPulse: 0.4,
    particleCount: 16,
    shopGlow: 'rgba(255, 100, 20, 0.6)',
  },
  ice: {
    kind: 'ice',
    auraColor: 'rgba(140, 220, 255, 0.55)',
    auraPulse: 0.3,
    particleCount: 14,
    shopGlow: 'rgba(120, 210, 255, 0.55)',
  },
  electro: {
    kind: 'electro',
    auraColor: 'rgba(100, 170, 255, 0.6)',
    auraPulse: 0.45,
    particleCount: 10,
    shopGlow: 'rgba(80, 150, 255, 0.6)',
  },
  lava: {
    kind: 'lava',
    auraColor: 'rgba(255, 80, 20, 0.6)',
    auraPulse: 0.45,
    particleCount: 16,
    shopGlow: 'rgba(255, 60, 10, 0.6)',
  },
  dragon: {
    kind: 'dragon',
    auraColor: 'rgba(230, 50, 30, 0.55)',
    auraPulse: 0.42,
    particleCount: 18,
    shopGlow: 'rgba(220, 40, 30, 0.6)',
  },
  disco: {
    kind: 'disco',
    auraColor: 'rgba(220, 220, 255, 0.5)',
    auraPulse: 0.4,
    particleCount: 12,
    shopGlow: 'rgba(200, 180, 255, 0.55)',
  },
  zombie: {
    kind: 'zombie',
    auraColor: 'rgba(100, 180, 40, 0.45)',
    auraPulse: 0.28,
    particleCount: 10,
    shopGlow: 'rgba(120, 200, 50, 0.45)',
  },
  neon: {
    kind: 'neon',
    auraColor: 'rgba(60, 255, 150, 0.55)',
    auraPulse: 0.48,
    particleCount: 8,
    shopGlow: 'rgba(50, 255, 120, 0.6)',
  },
  galaxy: {
    kind: 'galaxy',
    auraColor: 'rgba(150, 100, 255, 0.5)',
    auraPulse: 0.34,
    particleCount: 12,
    shopGlow: 'rgba(140, 90, 255, 0.55)',
  },
  holographic: {
    kind: 'holographic',
    auraColor: 'rgba(255, 140, 220, 0.45)',
    auraPulse: 0.38,
    particleCount: 8,
    shopGlow: 'rgba(180, 140, 255, 0.55)',
  },
  shadow: {
    kind: 'shadow',
    auraColor: 'rgba(30, 30, 50, 0.5)',
    auraPulse: 0.28,
    particleCount: 10,
    shopGlow: 'rgba(60, 60, 90, 0.5)',
  },
};

export function getSkinFx(skinId: string): SkinFxProfile {
  return PROFILES[skinId] ?? NONE;
}

export function isElementalSkin(skinId: string): boolean {
  return getSkinFx(skinId).kind !== 'none';
}
