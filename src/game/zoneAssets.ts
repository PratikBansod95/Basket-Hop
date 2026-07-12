import { CLIMB_ZONES } from './zones';

const images = new Map<string, HTMLImageElement>();
let preloadPromise: Promise<void> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load zone: ${src}`));
    img.src = src;
  });
}

export function preloadZoneAssets(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  if (typeof Image === 'undefined') {
    preloadPromise = Promise.resolve();
    return preloadPromise;
  }

  preloadPromise = Promise.all(
    CLIMB_ZONES.map(async (zone) => {
      try {
        const img = await loadImage(zone.asset);
        images.set(zone.id, img);
      } catch (err) {
        console.warn(err);
      }
    }),
  ).then(() => undefined);

  return preloadPromise;
}

export function getZoneImage(zoneId: string): HTMLImageElement | null {
  return images.get(zoneId) ?? null;
}
