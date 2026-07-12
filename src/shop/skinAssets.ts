import { SKIN_CATALOG, DEFAULT_SKIN_ID } from './skins';

const images = new Map<string, HTMLImageElement>();
let preloadPromise: Promise<void> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load skin: ${src}`));
    img.src = src;
  });
}

export function preloadSkinAssets(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  if (typeof Image === 'undefined') {
    preloadPromise = Promise.resolve();
    return preloadPromise;
  }

  preloadPromise = Promise.all(
    SKIN_CATALOG.map(async (skin) => {
      try {
        const img = await loadImage(skin.asset);
        images.set(skin.id, img);
      } catch (err) {
        console.warn(err);
      }
    }),
  ).then(() => undefined);

  return preloadPromise;
}

export function getSkinImage(skinId: string): HTMLImageElement | null {
  return images.get(skinId) ?? images.get(DEFAULT_SKIN_ID) ?? null;
}
