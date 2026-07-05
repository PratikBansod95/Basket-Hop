import { DEFAULT_SAVE, parseSaveData, type Platform, type SaveData } from './types';

const STORAGE_KEY = 'basket-hop-save';
const LEGACY_STORAGE_KEY = 'basket-drop-save';
let sessionSave: SaveData | null = null;

export function createLocalPlatform(): Platform {
  const adsMode = import.meta.env.MODE === 'ads';

  return {
    async loadSave() {
      if (adsMode) return sessionSave ? { ...sessionSave } : { ...DEFAULT_SAVE };
      const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
      const data = parseSaveData(saved);
      if (!localStorage.getItem(STORAGE_KEY) && saved) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    },
    async saveSave(data) {
      if (adsMode) {
        sessionSave = { ...data };
        return;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
    async sendScore() {},
    isAudioEnabled() {
      return true;
    },
    onAudioEnabledChange(cb) {
      return () => cb(true);
    },
    onPause() {
      return () => {};
    },
    onResume() {
      return () => {};
    },
    firstFrameReady() {},
    gameReady() {},
    async getLanguage() {
      return navigator.language || 'en-US';
    },
    isAdsMode() {
      return import.meta.env.MODE === 'ads';
    },
    exitAd() {
      window.ExitApi?.exit();
    },
  };
}
