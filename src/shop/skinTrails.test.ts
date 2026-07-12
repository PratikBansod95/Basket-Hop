import { describe, expect, it } from 'vitest';
import { SKIN_CATALOG } from './skins';
import { SKIN_TRAILS, getSkinTrail } from './skinTrails';

describe('skin trails', () => {
  it('defines a trail for every catalog skin', () => {
    for (const skin of SKIN_CATALOG) {
      expect(SKIN_TRAILS[skin.id], skin.id).toBeDefined();
      expect(getSkinTrail(skin.id).colors.length).toBeGreaterThan(0);
    }
  });

  it('falls back for unknown skins', () => {
    expect(getSkinTrail('missing-skin').mode).toBe('orb');
  });
});
