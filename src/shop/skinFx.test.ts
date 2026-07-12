import { describe, expect, it } from 'vitest';
import { SKIN_CATALOG } from './skins';
import { ELEMENTAL_SKIN_IDS, getSkinFx, isElementalSkin } from './skinFx';

describe('skinFx', () => {
  it('resolves a profile for every catalog skin', () => {
    for (const skin of SKIN_CATALOG) {
      const fx = getSkinFx(skin.id);
      expect(fx).toBeDefined();
      expect(fx.kind).toBeTruthy();
    }
  });

  it('marks elemental skins as non-none', () => {
    for (const id of ELEMENTAL_SKIN_IDS) {
      expect(getSkinFx(id).kind).not.toBe('none');
      expect(isElementalSkin(id)).toBe(true);
    }
  });

  it('keeps classic / camo / tech as light polish only', () => {
    for (const id of ['classic', 'camo', 'tech']) {
      expect(getSkinFx(id).kind).toBe('none');
      expect(isElementalSkin(id)).toBe(false);
    }
  });

  it('falls back for unknown skins', () => {
    expect(getSkinFx('missing').kind).toBe('none');
  });
});
