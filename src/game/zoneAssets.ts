import { CLIMB_ZONES, getZoneBlend, getZoneProgress } from './zones';

const MAX_DECODED_ZONE_ASSETS = 4;
const zoneById = new Map(CLIMB_ZONES.map((zone) => [zone.id, zone]));
const imagesByAsset = new Map<string, HTMLImageElement>();
const loadingByAsset = new Map<string, Promise<void>>();
const failedAssets = new Set<string>();
let wantedAssets = new Set<string>();

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load zone: ${src}`));
    img.src = src;
  });
}

function touchAsset(asset: string, image: HTMLImageElement): void {
  imagesByAsset.delete(asset);
  imagesByAsset.set(asset, image);
}

function evictUnusedAssets(): void {
  while (imagesByAsset.size > MAX_DECODED_ZONE_ASSETS) {
    let candidate: string | undefined;
    for (const asset of imagesByAsset.keys()) {
      if (!wantedAssets.has(asset)) {
        candidate = asset;
        break;
      }
    }
    if (!candidate) break;
    const image = imagesByAsset.get(candidate);
    imagesByAsset.delete(candidate);
    if (image) image.src = '';
  }
}

function ensureAsset(asset: string): Promise<void> {
  const cached = imagesByAsset.get(asset);
  if (cached) {
    touchAsset(asset, cached);
    return Promise.resolve();
  }
  if (failedAssets.has(asset) || typeof Image === 'undefined') return Promise.resolve();

  const existing = loadingByAsset.get(asset);
  if (existing) return existing;

  const promise = loadImage(asset)
    .then((image) => {
      touchAsset(asset, image);
      evictUnusedAssets();
    })
    .catch((error) => {
      failedAssets.add(asset);
      console.warn(error);
    })
    .finally(() => {
      loadingByAsset.delete(asset);
    });
  loadingByAsset.set(asset, promise);
  return promise;
}

export function getZoneAssetSourcesForLevel(level: number): string[] {
  const blend = getZoneBlend(level);
  const progress = getZoneProgress(level);
  return [
    blend.from.asset,
    blend.to.asset,
    progress.next?.asset,
  ].filter((asset): asset is string => Boolean(asset))
    .filter((asset, index, assets) => assets.indexOf(asset) === index);
}

export function ensureZoneAssetsForLevel(level: number): void {
  wantedAssets = new Set(getZoneAssetSourcesForLevel(level));
  for (const asset of wantedAssets) void ensureAsset(asset);
  evictUnusedAssets();
}

export function preloadZoneAssets(level = 0): Promise<void> {
  wantedAssets = new Set(getZoneAssetSourcesForLevel(level));
  return Promise.all([...wantedAssets].map(ensureAsset)).then(() => undefined);
}

export function getZoneImage(zoneId: string): HTMLImageElement | null {
  const asset = zoneById.get(zoneId)?.asset;
  if (!asset) return null;
  const image = imagesByAsset.get(asset);
  if (!image) {
    void ensureAsset(asset);
    return null;
  }
  touchAsset(asset, image);
  return image;
}

export function getDecodedZoneAssetCount(): number {
  return imagesByAsset.size;
}
