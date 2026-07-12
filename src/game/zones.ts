export interface ClimbZone {
  id: string;
  title: string;
  /** Inclusive basket level when this zone becomes active. */
  startLevel: number;
  asset: string;
  /** Optional canvas multiply tint (rgba string). */
  tint?: string;
  accent: 'none' | 'snow' | 'stars' | 'nebula';
}

export const ZONE_BLEND_BASKETS = 3;
export const ENDLESS_CYCLE_LENGTH = 16;

/** Named journey — levels are inclusive start boundaries. */
export const CLIMB_ZONES: readonly ClimbZone[] = [
  {
    id: 'rooftop',
    title: 'City Edge',
    startLevel: 0,
    asset: '/assets/zones/rooftop.webp',
    accent: 'none',
  },
  {
    id: 'suburbs',
    title: 'Rooftop NYC',
    startLevel: 8,
    asset: '/assets/zones/suburbs.webp',
    accent: 'none',
  },
  {
    id: 'hills',
    title: 'Green Hills',
    startLevel: 16,
    asset: '/assets/zones/hills.webp',
    accent: 'none',
  },
  {
    id: 'mountains',
    title: 'High Peaks',
    startLevel: 26,
    asset: '/assets/zones/mountains.webp',
    accent: 'none',
  },
  {
    id: 'everest',
    title: 'Everest',
    startLevel: 38,
    asset: '/assets/zones/everest.webp',
    accent: 'snow',
  },
  {
    id: 'troposphere',
    title: 'Above the Clouds',
    startLevel: 50,
    asset: '/assets/zones/troposphere.webp',
    accent: 'none',
  },
  {
    id: 'stratosphere',
    title: 'Stratosphere',
    startLevel: 62,
    asset: '/assets/zones/stratosphere.webp',
    accent: 'none',
  },
  {
    id: 'heaven',
    title: 'Heaven',
    startLevel: 74,
    asset: '/assets/zones/heaven.webp',
    accent: 'none',
  },
  {
    id: 'space',
    title: 'Near Space',
    startLevel: 88,
    asset: '/assets/zones/space.webp',
    accent: 'stars',
  },
  {
    id: 'deepspace',
    title: 'Deep Space',
    startLevel: 102,
    asset: '/assets/zones/deepspace.webp',
    accent: 'stars',
  },
  {
    id: 'nebula',
    title: 'Nebula Drift',
    startLevel: 118,
    asset: '/assets/zones/nebula.webp',
    accent: 'nebula',
  },
  {
    id: 'void',
    title: 'The Void',
    startLevel: 136,
    asset: '/assets/zones/void.webp',
    accent: 'stars',
  },
] as const;

const ENDLESS_ZONE_IDS = ['deepspace', 'nebula', 'void'] as const;

const ENDLESS_TINTS = [
  undefined,
  'rgba(255, 230, 255, 0.14)',
  'rgba(210, 240, 255, 0.16)',
  'rgba(255, 236, 220, 0.14)',
  'rgba(220, 255, 236, 0.12)',
] as const;

export interface ZoneBlend {
  from: ClimbZone;
  to: ClimbZone;
  /** 0 = fully from, 1 = fully to */
  t: number;
  remixTint: string | undefined;
}

function zoneById(id: string): ClimbZone {
  const zone = CLIMB_ZONES.find((z) => z.id === id);
  if (!zone) return CLIMB_ZONES[0];
  return zone;
}

/** Primary zone for a basket level (before blend math). */
export function getZoneAtLevel(level: number): ClimbZone {
  const safe = Math.max(0, Math.floor(level));
  const voidStart = CLIMB_ZONES[CLIMB_ZONES.length - 1].startLevel;
  const endlessStart = voidStart + ENDLESS_CYCLE_LENGTH;

  if (safe >= endlessStart) {
    return getEndlessRemix(safe).zone;
  }

  let current = CLIMB_ZONES[0];
  for (const zone of CLIMB_ZONES) {
    if (safe >= zone.startLevel) current = zone;
    else break;
  }
  return current;
}

export function getEndlessRemix(level: number): { zone: ClimbZone; tint: string | undefined; cycleIndex: number } {
  const voidStart = CLIMB_ZONES[CLIMB_ZONES.length - 1].startLevel;
  const endlessStart = voidStart + ENDLESS_CYCLE_LENGTH;
  const intoEndless = Math.max(0, Math.floor(level) - endlessStart);
  const cycleIndex = Math.floor(intoEndless / ENDLESS_CYCLE_LENGTH);
  const slot = cycleIndex % ENDLESS_ZONE_IDS.length;
  const tint = ENDLESS_TINTS[cycleIndex % ENDLESS_TINTS.length];
  return {
    zone: zoneById(ENDLESS_ZONE_IDS[slot]),
    tint,
    cycleIndex,
  };
}

/**
 * Smooth crossfade across the last ZONE_BLEND_BASKETS before the next zone starts.
 * After a full Void dwell, crossfades through endless remix slots.
 */
export function getZoneBlend(level: number): ZoneBlend {
  const safe = Math.max(0, Math.floor(level));
  const voidZone = CLIMB_ZONES[CLIMB_ZONES.length - 1];
  const voidStart = voidZone.startLevel;
  const endlessStart = voidStart + ENDLESS_CYCLE_LENGTH;

  if (safe >= endlessStart - ZONE_BLEND_BASKETS) {
    if (safe < endlessStart) {
      const t = Math.min(1, Math.max(0, (safe - (endlessStart - ZONE_BLEND_BASKETS)) / ZONE_BLEND_BASKETS));
      const first = getEndlessRemix(endlessStart);
      return { from: voidZone, to: first.zone, t, remixTint: t < 0.5 ? undefined : first.tint };
    }
    return getEndlessBlend(safe);
  }

  let from = CLIMB_ZONES[0];
  let to: ClimbZone | null = null;

  for (let i = 0; i < CLIMB_ZONES.length; i += 1) {
    const zone = CLIMB_ZONES[i];
    if (safe >= zone.startLevel) {
      from = zone;
      to = CLIMB_ZONES[i + 1] ?? null;
    } else {
      break;
    }
  }

  if (!to) {
    return { from, to: from, t: 0, remixTint: undefined };
  }

  const blendStart = to.startLevel - ZONE_BLEND_BASKETS;
  if (safe < blendStart) {
    return { from, to: from, t: 0, remixTint: undefined };
  }

  const t = Math.min(1, Math.max(0, (safe - blendStart) / ZONE_BLEND_BASKETS));
  return { from, to, t, remixTint: undefined };
}

function getEndlessBlend(level: number): ZoneBlend {
  const voidStart = CLIMB_ZONES[CLIMB_ZONES.length - 1].startLevel;
  const endlessStart = voidStart + ENDLESS_CYCLE_LENGTH;
  const intoEndless = Math.max(0, level - endlessStart);
  const cycleIndex = Math.floor(intoEndless / ENDLESS_CYCLE_LENGTH);
  const progressInCycle = intoEndless % ENDLESS_CYCLE_LENGTH;

  const fromRemix = getEndlessRemix(endlessStart + cycleIndex * ENDLESS_CYCLE_LENGTH);
  const toRemix = getEndlessRemix(endlessStart + (cycleIndex + 1) * ENDLESS_CYCLE_LENGTH);

  const blendStart = ENDLESS_CYCLE_LENGTH - ZONE_BLEND_BASKETS;
  if (progressInCycle < blendStart) {
    return {
      from: fromRemix.zone,
      to: fromRemix.zone,
      t: 0,
      remixTint: fromRemix.tint,
    };
  }

  const t = Math.min(1, Math.max(0, (progressInCycle - blendStart) / ZONE_BLEND_BASKETS));
  return {
    from: fromRemix.zone,
    to: toRemix.zone,
    t,
    remixTint: t < 0.5 ? fromRemix.tint : toRemix.tint,
  };
}

/** How strongly the rooftop court world layer should still show (1 = full, 0 = gone). */
export function getCourtWorldOpacity(level: number): number {
  const suburbsStart = CLIMB_ZONES[1].startLevel;
  const blendStart = suburbsStart - ZONE_BLEND_BASKETS;
  if (level < blendStart) return 1;
  if (level >= suburbsStart) return 0;
  return 1 - (level - blendStart) / ZONE_BLEND_BASKETS;
}

/** Label fade during early part of a zone / blend (0..1). */
export function getZoneLabelOpacity(level: number): number {
  const blend = getZoneBlend(level);
  if (blend.t > 0.05 && blend.t < 0.85) {
    // Peak mid-transition toward the new zone name
    const mid = blend.t < 0.5 ? blend.t / 0.5 : (1 - blend.t) / 0.5;
    return Math.min(1, mid * 1.2);
  }

  const zone = getZoneAtLevel(level);
  const local = level - zone.startLevel;
  if (local >= 0 && local <= 4) {
    if (local < 2) return 1;
    return Math.max(0, 1 - (local - 2) / 2);
  }
  return 0;
}

export function getActiveZoneTitle(level: number): string {
  const blend = getZoneBlend(level);
  return blend.t >= 0.45 ? blend.to.title : blend.from.title;
}
