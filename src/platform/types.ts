export interface SaveData {
  best: number;
  totalGames: number;
  totalShots: number;
  cleanShots: number;
}

export const DEFAULT_SAVE: SaveData = {
  best: 0,
  totalGames: 0,
  totalShots: 0,
  cleanShots: 0,
};

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
