import { describe, expect, it } from 'vitest';
import {
  CLIMB_ZONES,
  ENDLESS_CYCLE_LENGTH,
  ZONE_BLEND_BASKETS,
  getActiveZoneTitle,
  getCourtWorldOpacity,
  getEndlessRemix,
  getZoneAtLevel,
  getZoneBlend,
  getZoneLabelOpacity,
  getZoneProgress,
} from './zones';

describe('climb zones catalog', () => {
  it('defines 14 zones with increasing start levels', () => {
    expect(CLIMB_ZONES).toHaveLength(14);
    for (let i = 1; i < CLIMB_ZONES.length; i += 1) {
      expect(CLIMB_ZONES[i].startLevel).toBeGreaterThan(CLIMB_ZONES[i - 1].startLevel);
    }
    expect(CLIMB_ZONES[0].id).toBe('rooftop');
    expect(CLIMB_ZONES[CLIMB_ZONES.length - 1].id).toBe('void');
  });
});

describe('getZoneAtLevel', () => {
  it('returns rooftop at level 0 and suburbs after its start', () => {
    expect(getZoneAtLevel(0).id).toBe('rooftop');
    expect(getZoneAtLevel(4.9).id).toBe('rooftop');
    expect(getZoneAtLevel(5).id).toBe('suburbs');
  });

  it('returns everest and space at their starts', () => {
    expect(getZoneAtLevel(27).id).toBe('everest');
    expect(getZoneAtLevel(80).id).toBe('space');
  });
});

describe('getZoneBlend', () => {
  it('is fully in-zone before the blend window', () => {
    const blend = getZoneBlend(1);
    expect(blend.from.id).toBe('rooftop');
    expect(blend.to.id).toBe('rooftop');
    expect(blend.t).toBe(0);
  });

  it('crossfades into the next zone across ZONE_BLEND_BASKETS', () => {
    const suburbs = CLIMB_ZONES[1];
    const start = suburbs.startLevel - ZONE_BLEND_BASKETS;
    const mid = getZoneBlend(start + 1);
    expect(mid.from.id).toBe('rooftop');
    expect(mid.to.id).toBe('suburbs');
    expect(mid.t).toBeGreaterThan(0);
    expect(mid.t).toBeLessThan(1);

    const end = getZoneBlend(suburbs.startLevel);
    expect(end.from.id).toBe('suburbs');
    expect(end.t).toBe(0);
  });

  it('updates transitions continuously at fractional altitude levels', () => {
    const suburbs = CLIMB_ZONES[1];
    const start = suburbs.startLevel - ZONE_BLEND_BASKETS;
    expect(getZoneBlend(start + 0.5).t).toBeCloseTo(1 / 6);
    expect(getZoneBlend(start + 1.5).t).toBeCloseTo(0.5);
  });
});

describe('endless remix', () => {
  it('cycles late zones after void dwell', () => {
    const voidStart = CLIMB_ZONES[CLIMB_ZONES.length - 1].startLevel;
    const endlessStart = voidStart + ENDLESS_CYCLE_LENGTH;
    expect(getZoneAtLevel(voidStart).id).toBe('void');
    const a = getEndlessRemix(endlessStart);
    const b = getEndlessRemix(endlessStart + ENDLESS_CYCLE_LENGTH);
    const c = getEndlessRemix(endlessStart + ENDLESS_CYCLE_LENGTH * 2);
    expect(a.zone.id).toBe('deepspace');
    expect(b.zone.id).toBe('nebula');
    expect(c.zone.id).toBe('void');
  });

  it('blends between endless slots near cycle edges', () => {
    const voidStart = CLIMB_ZONES[CLIMB_ZONES.length - 1].startLevel;
    const endlessStart = voidStart + ENDLESS_CYCLE_LENGTH;
    const nearEnd = endlessStart + ENDLESS_CYCLE_LENGTH - 1;
    const blend = getZoneBlend(nearEnd);
    expect(blend.from.id).toBe('deepspace');
    expect(blend.to.id).toBe('nebula');
    expect(blend.t).toBeGreaterThan(0);
  });
});

describe('court fade and labels', () => {
  it('fades court world out leaving rooftop', () => {
    expect(getCourtWorldOpacity(0)).toBe(1);
    expect(getCourtWorldOpacity(5)).toBe(0);
    expect(getCourtWorldOpacity(3)).toBeGreaterThan(0);
    expect(getCourtWorldOpacity(3)).toBeLessThan(1);
  });

  it('exposes active titles during transitions', () => {
    expect(getActiveZoneTitle(0)).toBe('City Edge');
    const mid = getZoneBlend(3.5);
    expect(getActiveZoneTitle(3.5)).toBe(mid.t >= 0.45 ? mid.to.title : mid.from.title);
    expect(getZoneLabelOpacity(3.5)).toBeGreaterThan(0);
  });

  it('reports progress toward the next altitude environment', () => {
    const progress = getZoneProgress(2.5);
    expect(progress.current.id).toBe('rooftop');
    expect(progress.next?.id).toBe('suburbs');
    expect(progress.progress).toBeCloseTo(0.5);
  });
});
