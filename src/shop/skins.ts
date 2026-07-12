export type SkinRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface BallSkin {
  id: string;
  name: string;
  rarity: SkinRarity;
  price: number;
  index: number;
  /** Path under public/ */
  asset: string;
}

let skinsTestUnlockAll = true;

export function getSkinsTestUnlockAll(): boolean {
  return skinsTestUnlockAll;
}

export function setSkinsTestUnlockAll(value: boolean): void {
  skinsTestUnlockAll = value;
}

export const DEFAULT_SKIN_ID = 'classic';

export const SKIN_CATALOG: readonly BallSkin[] = [
  { id: 'classic', name: 'Classic', rarity: 'common', price: 0, index: 1, asset: '/assets/skins/classic.png' },
  { id: 'neon', name: 'Neon', rarity: 'rare', price: 50, index: 2, asset: '/assets/skins/neon.png' },
  { id: 'galaxy', name: 'Galaxy', rarity: 'rare', price: 50, index: 3, asset: '/assets/skins/galaxy.png' },
  { id: 'flame', name: 'Flame', rarity: 'epic', price: 120, index: 4, asset: '/assets/skins/flame.png' },
  { id: 'ice', name: 'Ice', rarity: 'epic', price: 120, index: 5, asset: '/assets/skins/ice.png' },
  { id: 'zombie', name: 'Zombie', rarity: 'legendary', price: 250, index: 6, asset: '/assets/skins/zombie.png' },
  { id: 'electro', name: 'Electro', rarity: 'legendary', price: 250, index: 7, asset: '/assets/skins/electro.png' },
  { id: 'tech', name: 'Tech', rarity: 'rare', price: 50, index: 8, asset: '/assets/skins/tech.png' },
  { id: 'camo', name: 'Camo', rarity: 'rare', price: 50, index: 9, asset: '/assets/skins/camo.png' },
  { id: 'holographic', name: 'Holographic', rarity: 'epic', price: 120, index: 10, asset: '/assets/skins/holographic.png' },
  { id: 'lava', name: 'Lava', rarity: 'legendary', price: 250, index: 11, asset: '/assets/skins/lava.png' },
  { id: 'shadow', name: 'Shadow', rarity: 'legendary', price: 250, index: 12, asset: '/assets/skins/shadow.png' },
  { id: 'dragon', name: 'Dragon', rarity: 'mythic', price: 500, index: 13, asset: '/assets/skins/dragon.png' },
  { id: 'disco', name: 'Disco', rarity: 'mythic', price: 500, index: 14, asset: '/assets/skins/disco.png' },
] as const;

export const RARITY_LABELS: Record<SkinRarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

export function getSkinById(id: string): BallSkin | undefined {
  return SKIN_CATALOG.find((skin) => skin.id === id);
}

export function isValidSkinId(id: string): boolean {
  return SKIN_CATALOG.some((skin) => skin.id === id);
}

export function allSkinIds(): string[] {
  return SKIN_CATALOG.map((skin) => skin.id);
}
