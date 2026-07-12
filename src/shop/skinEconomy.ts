import type { SaveData } from '../platform/types';
import {
  DEFAULT_SKIN_ID,
  getSkinsTestUnlockAll,
  getSkinById,
  isValidSkinId,
  allSkinIds,
} from './skins';

export function ownsSkin(save: SaveData, skinId: string): boolean {
  if (getSkinsTestUnlockAll()) return isValidSkinId(skinId);
  return save.ownedSkins.includes(skinId);
}

export function canEquipSkin(save: SaveData, skinId: string): boolean {
  return ownsSkin(save, skinId);
}

export function equipSkin(save: SaveData, skinId: string): SaveData | null {
  if (!canEquipSkin(save, skinId)) return null;
  if (save.equippedSkin === skinId) return save;
  return { ...save, equippedSkin: skinId };
}

export type PurchaseResult =
  | { ok: true; save: SaveData }
  | { ok: false; reason: 'unknown' | 'owned' | 'broke' };

export function purchaseSkin(save: SaveData, skinId: string): PurchaseResult {
  const skin = getSkinById(skinId);
  if (!skin) return { ok: false, reason: 'unknown' };
  if (save.ownedSkins.includes(skinId)) return { ok: false, reason: 'owned' };
  if (skin.price > 0 && save.coins < skin.price) return { ok: false, reason: 'broke' };

  return {
    ok: true,
    save: {
      ...save,
      coins: Math.max(0, save.coins - skin.price),
      ownedSkins: [...save.ownedSkins, skinId],
    },
  };
}

export function normalizeSkinSave(save: SaveData): SaveData {
  const owned = new Set(
    (save.ownedSkins ?? []).filter(isValidSkinId).concat(DEFAULT_SKIN_ID),
  );
  if (getSkinsTestUnlockAll()) {
    for (const id of allSkinIds()) owned.add(id);
  }

  let equipped = isValidSkinId(save.equippedSkin) ? save.equippedSkin : DEFAULT_SKIN_ID;
  if (!owned.has(equipped) && !getSkinsTestUnlockAll()) {
    equipped = DEFAULT_SKIN_ID;
  }

  return {
    ...save,
    ownedSkins: [...owned],
    equippedSkin: equipped,
  };
}
