import { describe, expect, it, afterEach } from 'vitest';
import { DEFAULT_SAVE, parseSaveData } from '../platform/types';
import {
  equipSkin,
  normalizeSkinSave,
  ownsSkin,
  purchaseSkin,
} from './skinEconomy';
import {
  SKIN_CATALOG,
  setSkinsTestUnlockAll,
  getSkinsTestUnlockAll,
} from './skins';

afterEach(() => {
  setSkinsTestUnlockAll(true);
});

describe('skin catalog', () => {
  it('has exactly 14 skins with image assets', () => {
    expect(SKIN_CATALOG).toHaveLength(14);
    expect(SKIN_CATALOG.every((s) => s.asset.startsWith('/assets/skins/') && s.asset.endsWith('.png'))).toBe(true);
    expect(SKIN_CATALOG[0].id).toBe('classic');
    expect(SKIN_CATALOG[0].price).toBe(0);
  });
});

describe('skin save defaults', () => {
  it('defaults owned classic and equipped classic on older saves', () => {
    const save = parseSaveData(JSON.stringify({ best: 2, coins: 9 }));
    expect(save.ownedSkins).toContain('classic');
    expect(save.equippedSkin).toBe('classic');
  });

  it('normalize expands ownership when test unlock is on', () => {
    setSkinsTestUnlockAll(true);
    const save = normalizeSkinSave({
      ...DEFAULT_SAVE,
      ownedSkins: ['classic'],
      equippedSkin: 'classic',
    });
    expect(save.ownedSkins).toHaveLength(14);
  });
});

describe('skin economy', () => {
  it('purchases a skin and deducts coins', () => {
    setSkinsTestUnlockAll(false);
    const result = purchaseSkin(
      { ...DEFAULT_SAVE, coins: 80, ownedSkins: ['classic'], equippedSkin: 'classic' },
      'neon',
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.save.coins).toBe(30);
    expect(result.save.ownedSkins).toContain('neon');
  });

  it('rejects purchase when broke', () => {
    setSkinsTestUnlockAll(false);
    const result = purchaseSkin(
      { ...DEFAULT_SAVE, coins: 10, ownedSkins: ['classic'], equippedSkin: 'classic' },
      'neon',
    );
    expect(result).toEqual({ ok: false, reason: 'broke' });
  });

  it('rejects purchase when already owned', () => {
    setSkinsTestUnlockAll(false);
    const result = purchaseSkin(
      { ...DEFAULT_SAVE, coins: 200, ownedSkins: ['classic', 'neon'], equippedSkin: 'classic' },
      'neon',
    );
    expect(result).toEqual({ ok: false, reason: 'owned' });
  });

  it('equips an owned skin when test unlock is off', () => {
    setSkinsTestUnlockAll(false);
    const save = {
      ...DEFAULT_SAVE,
      ownedSkins: ['classic', 'gold'],
      equippedSkin: 'classic',
    };
    expect(ownsSkin(save, 'gold')).toBe(true);
    expect(equipSkin(save, 'gold')?.equippedSkin).toBe('gold');
    expect(equipSkin(save, 'dragon')).toBeNull();
  });

  it('allows equipping any catalog skin when test unlock is on', () => {
    setSkinsTestUnlockAll(true);
    expect(getSkinsTestUnlockAll()).toBe(true);
    const save = { ...DEFAULT_SAVE, ownedSkins: ['classic'], equippedSkin: 'classic' };
    expect(equipSkin(save, 'dragon')?.equippedSkin).toBe('dragon');
  });
});
