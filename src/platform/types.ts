import type { RunStats } from '../game/types';

export interface SaveData {
  best: number;
  coins: number;
  totalGames: number;
  totalShots: number;
  cleanShots: number;
  tutorialSeen: boolean;
}

export const DEFAULT_SAVE: SaveData = {
  best: 0,
  coins: 0,
  totalGames: 0,
  totalShots: 0,
  cleanShots: 0,
  tutorialSeen: false,
};

export function parseSaveData(raw: string | null): SaveData {
  if (!raw) return { ...DEFAULT_SAVE };
  try {
    const data = JSON.parse(raw) as Partial<SaveData>;
    return {
      best: data.best ?? 0,
      coins: data.coins ?? 0,
      totalGames: data.totalGames ?? 0,
      totalShots: data.totalShots ?? 0,
      cleanShots: data.cleanShots ?? 0,
      tutorialSeen: data.tutorialSeen ?? false,
    };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function mergeRunIntoSave(save: SaveData, stats: RunStats, runCoins: number): SaveData {
  return {
    ...save,
    best: Math.max(save.best, stats.score),
    coins: save.coins + runCoins,
    totalGames: save.totalGames + 1,
    totalShots: save.totalShots + stats.totalShots,
    cleanShots: save.cleanShots + stats.cleanShots,
  };
}

export interface Platform {
  loadSave(): Promise<SaveData>;
  saveSave(data: SaveData): Promise<void>;
  sendScore(score: number): Promise<void>;
  isAudioEnabled(): boolean;
  onAudioEnabledChange(cb: (enabled: boolean) => void): () => void;
  onPause(cb: () => void): () => void;
  onResume(cb: () => void): () => void;
  firstFrameReady(): void;
  gameReady(): void;
  getLanguage(): Promise<string>;
  isAdsMode(): boolean;
  exitAd(): void;
}

declare global {
  interface Window {
    ytgame?: {
      IN_PLAYABLES_ENV?: boolean;
      game: {
        firstFrameReady(): void;
        gameReady(): void;
        loadData(): Promise<string | null>;
        saveData(data: string): Promise<void>;
      };
      engagement: {
        sendScore(score: { value: number }): Promise<void>;
      };
      system: {
        isAudioEnabled(): boolean;
        onAudioEnabledChange(cb: (enabled: boolean) => void): () => void;
        onPause(cb: () => void): () => void;
        onResume(cb: () => void): () => void;
        getLanguage(): Promise<string>;
      };
    };
    ExitApi?: { exit(): void };
  }
}

export {};
