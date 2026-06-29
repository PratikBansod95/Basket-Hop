/** Background-only HD assets (ball & hoop stay procedural). */
export const BACKGROUND_ASSET_PATHS = {
  skyDay: '/assets/sky-day.png',
  openCourt: '/assets/court-open-transparent.png',
  cloud: '/assets/cloud.png',
  courtTile: '/assets/court-tile.png',
  stadiumInterior: '/assets/stadium-interior.png',
} as const;

export type BackgroundAssetKey = keyof typeof BACKGROUND_ASSET_PATHS;

export interface BackgroundAssets {
  skyDay: HTMLImageElement | null;
  openCourt: HTMLCanvasElement | null;
  cloud: HTMLCanvasElement | null;
  courtTile: HTMLImageElement | null;
  stadiumInterior: HTMLImageElement | null;
  loaded: boolean;
}

export const backgroundAssets: BackgroundAssets = {
  skyDay: null,
  openCourt: null,
  cloud: null,
  courtTile: null,
  stadiumInterior: null,
  loaded: false,
};

/** @deprecated use backgroundAssets */
export const hdAssets = backgroundAssets;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

/** Remove bright green chroma-key (transparent sky slot in court asset). */
export function chromaKeyGreen(img: HTMLImageElement, tolerance = 95): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const isGreen = g > 140 && g > r + 35 && g > b + 35 && r < tolerance + 60 && b < tolerance + 60;
    if (isGreen) {
      data[i + 3] = 0;
    } else if (g > 100 && g > r + 20 && g > b + 20 && r < 140) {
      const edge = Math.min(1, (Math.max(r, b) - g * 0.3) / 80);
      data[i + 3] = Math.round(data[i + 3] * Math.max(0, edge));
    }
  }
  ctx.putImageData(new ImageData(data, width, height), 0, 0);
  return canvas;
}

export async function preloadBackgroundAssets(): Promise<void> {
  const entries = await Promise.allSettled(
    (Object.entries(BACKGROUND_ASSET_PATHS) as [BackgroundAssetKey, string][]).map(
      async ([key, path]) => {
        const img = await loadImage(path);
        return { key, img };
      },
    ),
  );

  for (const result of entries) {
    if (result.status !== 'fulfilled') continue;
    const { key, img } = result.value;
    if (key === 'cloud' || key === 'openCourt') {
      backgroundAssets[key] = chromaKeyGreen(img);
    } else {
      backgroundAssets[key] = img;
    }
  }

  backgroundAssets.loaded = !!(
    backgroundAssets.skyDay ||
    backgroundAssets.openCourt ||
    backgroundAssets.stadiumInterior ||
    backgroundAssets.courtTile
  );
}

/** @deprecated use preloadBackgroundAssets */
export const preloadHdAssets = preloadBackgroundAssets;
