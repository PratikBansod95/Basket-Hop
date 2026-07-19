import { describe, expect, it } from 'vitest';
import { getZoneAssetSourcesForLevel } from './zoneAssets';

describe('zone asset selection', () => {
  it('loads only the active transition and next environment assets', () => {
    expect(getZoneAssetSourcesForLevel(0).length).toBeLessThanOrEqual(3);
    expect(getZoneAssetSourcesForLevel(0)).toContain('/assets/zones/rooftop.webp');
  });

  it('deduplicates environments that remix the same source artwork', () => {
    const sources = getZoneAssetSourcesForLevel(44);
    expect(new Set(sources).size).toBe(sources.length);
    expect(sources.filter((asset) => asset.endsWith('/troposphere.webp'))).toHaveLength(1);
  });
});
