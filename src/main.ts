import { SfxEngine } from './audio/sfx';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './game/constants';
import { Game } from './game/Game';
import { GamePhase } from './game/types';
import { DefaultTapLaunch } from './game/mechanics/defaultTapLaunch';
import { render, renderLoading } from './game/renderer';
import { renderMenuBall, renderMenuScene } from './game/menuRenderer';
import { preloadBackgroundAssets } from './game/assetLoader';
import { createPlatform } from './platform/youtube';
import type { SaveData } from './platform/types';
import { GameOverModal } from './ui/gameOver';
import { MainMenu } from './ui/mainMenu';
import { Hud } from './ui/hud';

const launchMechanic = new DefaultTapLaunch();

async function main(): Promise<void> {
  const platform = createPlatform();
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;
  const menuBallCanvas = document.getElementById('menu-ball-canvas') as HTMLCanvasElement;
  const menuBallCtx = menuBallCanvas.getContext('2d')!;
  const canvasStage = document.querySelector('.canvas-stage') as HTMLElement;
  const appRoot = document.getElementById('app')!;

  let saveData: SaveData = await platform.loadSave();
  let userMuted = false;
  let platformAudio = platform.isAudioEnabled();

  const sfx = new SfxEngine();
  const hud = new Hud();

  function isMuted(): boolean {
    return userMuted || !platformAudio;
  }

  function syncAudio(): void {
    sfx.setEnabled(!isMuted());
    if (mainMenu.isVisible()) {
      mainMenu.setMuted(isMuted());
    }
  }

  const gameOverModal = new GameOverModal(
    () => startRun(),
    () => goToMainMenu(),
    () => platform.exitAd(),
  );
  gameOverModal.setAdsMode(platform.isAdsMode());

  const mainMenu = new MainMenu(
    () => {
      sfx.unlock();
      startRun();
    },
    () => {
      userMuted = !userMuted;
      syncAudio();
    },
  );

  syncAudio();

  platform.onAudioEnabledChange((enabled) => {
    platformAudio = enabled;
    syncAudio();
  });

  let paused = false;

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const containScale = Math.min(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT);
    const coverScale = Math.max(vw / CANVAS_WIDTH, vh / CANVAS_HEIGHT);
    const isPhone = Math.min(vw, vh) < 520;
    const scale = isPhone ? coverScale : containScale;
    const styleW = `${CANVAS_WIDTH * scale}px`;
    const styleH = `${CANVAS_HEIGHT * scale}px`;

    canvasStage.style.width = styleW;
    canvasStage.style.height = styleH;

    for (const c of [canvas, menuBallCanvas]) {
      c.width = CANVAS_WIDTH * dpr;
      c.height = CANVAS_HEIGHT * dpr;
      c.style.width = '100%';
      c.style.height = '100%';
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    menuBallCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function setMenuBallVisible(visible: boolean): void {
    menuBallCanvas.classList.toggle('hidden', !visible);
  }

  window.addEventListener('resize', resize);
  resize();
  renderLoading(ctx);
  void preloadBackgroundAssets();

  const game = new Game(launchMechanic, {
    onTap: () => {
      sfx.unlock();
      sfx.tap();
    },
    onBounce: () => sfx.bounce(),
    onSwoosh: () => sfx.swoosh(),
    onScore: () => {},
    onGameOver: (stats) => {
      sfx.gameOver();
      saveData.totalGames += 1;
      saveData.totalShots += stats.totalShots;
      saveData.cleanShots += stats.cleanShots;
      if (stats.score > saveData.best) {
        saveData.best = stats.score;
        void platform.sendScore(stats.score);
      }
      void platform.saveSave(saveData);
      gameOverModal.show(stats, saveData);
    },
  });

  platform.onPause(() => {
    paused = true;
    game.paused = true;
    void platform.saveSave(saveData);
  });
  platform.onResume(() => {
    paused = false;
    game.paused = false;
  });

  function startRun(): void {
    game.reset();
    gameOverModal.hide();
    mainMenu.hide();
    mainMenu.hideHowTo();
    setMenuBallVisible(false);
  }

  function goToMainMenu(): void {
    game.returnToMenu();
    gameOverModal.hide();
    mainMenu.hideHowTo();
    mainMenu.show(saveData.best);
    mainMenu.setMuted(isMuted());
    setMenuBallVisible(true);
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (game.phase === GamePhase.GameOver || game.phase === GamePhase.Menu) return;
    if (mainMenu.isVisible()) return;
    sfx.unlock();
    game.handleTap();
  });

  mainMenu.show(saveData.best);
  mainMenu.setMuted(isMuted());
  setMenuBallVisible(true);
  renderMenuScene(ctx, 0);
  renderMenuBall(menuBallCtx, 0);
  platform.firstFrameReady();

  await platform.getLanguage();
  sfx.setEnabled(!isMuted());
  platform.gameReady();

  let lastTime = performance.now();
  function loop(now: number): void {
    requestAnimationFrame(loop);
    if (paused) {
      lastTime = now;
      return;
    }
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    game.update(dt);
    const inGame = game.phase !== GamePhase.Menu;
    appRoot.classList.toggle('in-game', inGame);
    hud.update(game.stats, game.phase, game.ball.hasLaunched);
    if (game.phase === GamePhase.Menu) {
      renderMenuScene(ctx, game.time);
      renderMenuBall(menuBallCtx, game.time);
      setMenuBallVisible(true);
    } else {
      setMenuBallVisible(false);
      render(ctx, game.ball, game.hoop, game.floatingTexts, {
        shake: game.shake,
        climbOffset: game.climbOffset,
        time: game.time,
      });
    }
  }
  requestAnimationFrame(loop);
}

main().catch(console.error);
