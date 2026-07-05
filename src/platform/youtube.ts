import { createLocalPlatform } from './local';
import { DEFAULT_SAVE, parseSaveData, type Platform } from './types';

function isYouTubeEnv(): boolean {
  return typeof window.ytgame !== 'undefined' && !!window.ytgame?.IN_PLAYABLES_ENV;
}

export function createYouTubePlatform(): Platform {
  const local = createLocalPlatform();

  if (!isYouTubeEnv()) {
    return local;
  }

  const yt = window.ytgame!;

  return {
    async loadSave() {
      try {
        const raw = await yt.game.loadData();
        return parseSaveData(raw);
      } catch {
        return { ...DEFAULT_SAVE };
      }
    },
    async saveSave(data) {
      try {
        await yt.game.saveData(JSON.stringify(data));
      } catch {
        /* best effort */
      }
    },
    async sendScore(score) {
      try {
        await yt.engagement.sendScore({ value: Math.floor(score) });
      } catch {
        /* best effort */
      }
    },
    isAudioEnabled() {
      try {
        return yt.system.isAudioEnabled();
      } catch {
        return true;
      }
    },
    onAudioEnabledChange(cb) {
      try {
        return yt.system.onAudioEnabledChange(cb);
      } catch {
        return () => {};
      }
    },
    onPause(cb) {
      try {
        return yt.system.onPause(cb);
      } catch {
        return () => {};
      }
    },
    onResume(cb) {
      try {
        return yt.system.onResume(cb);
      } catch {
        return () => {};
      }
    },
    firstFrameReady() {
      try {
        yt.game.firstFrameReady();
      } catch {
        /* noop outside YT */
      }
    },
    gameReady() {
      try {
        yt.game.gameReady();
      } catch {
        /* noop outside YT */
      }
    },
    async getLanguage() {
      try {
        return await yt.system.getLanguage();
      } catch {
        return navigator.language || 'en-US';
      }
    },
    isAdsMode() {
      return import.meta.env.MODE === 'ads';
    },
    exitAd() {
      window.ExitApi?.exit();
    },
  };
}

export function createPlatform(): Platform {
  return createYouTubePlatform();
}
