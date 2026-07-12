import { SfxEngine } from './audio/sfx';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './game/constants';
import { DEBUG } from './game/debug';
import { Game } from './game/Game';
import { createStaminaIntroState, createTutorialState, shouldRunStaminaTutorial, shouldRunTutorial } from './game/tutorial';
import { GamePhase } from './game/types';
import { DefaultTapLaunch } from './game/mechanics/defaultTapLaunch';
import { render, renderLoading } from './game/renderer';
import { preloadBackgroundAssets } from './game/assetLoader';
import { preloadCoinAsset } from './game/coinRenderer';
import { preloadZoneAssets } from './game/zoneAssets';
import { createPlatform } from './platform/youtube';
import { mergeRunIntoSave, type SaveData } from './platform/types';
import { normalizeSkinSave } from './shop/skinEconomy';
import { preloadSkinAssets } from './shop/skinAssets';
import { GameOverModal } from './ui/gameOver';
import { MainMenu } from './ui/mainMenu';
import { Hud } from './ui/hud';
import { renderMenuHomeFx } from './ui/menuHome3d';
import { SkinsShop } from './ui/skinsShop';
import { NicknameGate } from './ui/nicknameGate';
import { LeaderboardOverlay } from './ui/leaderboardOverlay';
import { bindStageResize, computeStageLayout, layoutsEqual, applyResponsiveCssVars, syncSafeAreaCssVars, type StageLayout } from './ui/stageLayout';
import { FIXED_DT, stepFixed } from './game/physics';
import {
  getRenderQuality,
  maxPhysicsStepsForQuality,
  noteFrameTime,
  onRenderQualityChange,
  shakeScaleForQuality,
} from './game/renderQuality';
import { newClientRunId, submitSoloRunScore } from './services/api/submitRun';

const launchMechanic = new DefaultTapLaunch();

async function main(): Promise<void> {
  const platform = createPlatform();
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const ctx =
    canvas.getContext('2d', { alpha: false, desynchronized: true }) ?? canvas.getContext('2d')!;
  const menuFxCanvas = document.getElementById('menu-fx-canvas') as HTMLCanvasElement;
  const menuFxCtx = menuFxCanvas.getContext('2d')!;
  const canvasStage = document.querySelector('.canvas-stage') as HTMLElement;
  const appRoot = document.getElementById('app')!;
  let lastLayout: StageLayout | null = null;
  let physicsAcc = 0;
  let currentRunId = newClientRunId();

  let saveData: SaveData = normalizeSkinSave(await platform.loadSave());
  // Persist migrated identity fields (playerId) for older local saves.
  void platform.saveSave(saveData);
  let userMuted = false;
  let platformAudio = platform.isAudioEnabled();
  const tutorialEnabled = shouldRunTutorial(saveData);
  if (tutorialEnabled) {
    saveData = { ...saveData, tutorialSeen: true };
    void platform.saveSave(saveData);
  }
  const staminaTutorialEnabled = shouldRunStaminaTutorial(saveData);

  const sfx = new SfxEngine();
  const hud = new Hud();
  const skinsShop = new SkinsShop();

  function isMuted(): boolean {
    return userMuted || !platformAudio;
  }

  function syncAudio(): void {
    sfx.setEnabled(!isMuted());
    if (mainMenu.isVisible()) {
      mainMenu.setMuted(isMuted());
    }
  }

  const nicknameGate = new NicknameGate({
    getSave: () => saveData,
    onRegistered: (playerId, nickname) => {
      saveData = { ...saveData, playerId, nickname };
      void platform.saveSave(saveData);
    },
  });

  const leaderboard = new LeaderboardOverlay(() => saveData);

  function requireNicknameThen(action: () => void): void {
    if (nicknameGate.needsNickname(saveData)) {
      nicknameGate.show(saveData.nickname);
      return;
    }
    action();
  }

  const gameOverModal = new GameOverModal(
    () => requireNicknameThen(() => startRun()),
    () => goToMainMenu(),
    () => platform.exitAd(),
  );
  gameOverModal.setAdsMode(platform.isAdsMode());

  const mainMenu = new MainMenu(
    () => {
      sfx.unlock();
      requireNicknameThen(() => startRun());
    },
    () => {
      userMuted = !userMuted;
      syncAudio();
    },
    () => {
      skinsShop.show(saveData, (next) => {
        saveData = next;
        void platform.saveSave(saveData);
        mainMenu.refreshWallet(saveData);
      });
    },
    () => {
      void leaderboard.show();
    },
  );

  syncAudio();

  platform.onAudioEnabledChange((enabled) => {
    platformAudio = enabled;
    syncAudio();
  });

  let paused = false;

  function resize(): void {
    syncSafeAreaCssVars();
    // Measure #app content box (safe-area padding already applied) so we don't double-inset.
    const layout = computeStageLayout(appRoot.clientWidth, appRoot.clientHeight);
    applyResponsiveCssVars(canvasStage, layout, appRoot);

    if (layoutsEqual(lastLayout, layout)) return;
    lastLayout = layout;

    canvasStage.style.width = `${layout.width}px`;
    canvasStage.style.height = `${layout.height}px`;

    for (const c of [canvas, menuFxCanvas]) {
      c.width = Math.round(CANVAS_WIDTH * layout.dpr);
      c.height = Math.round(CANVAS_HEIGHT * layout.dpr);
      c.style.width = '100%';
      c.style.height = '100%';
    }
    ctx.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);
    menuFxCtx.setTransform(layout.dpr, 0, 0, layout.dpr, 0, 0);
  }

  function setMenuFxVisible(visible: boolean): void {
    menuFxCanvas.classList.toggle('hidden', !visible);
  }

  bindStageResize(resize);
  onRenderQualityChange(() => {
    // Force DPR retarget when quality adapts mid-run.
    lastLayout = null;
    resize();
  });
  resize();
  renderLoading(ctx);
  void preloadBackgroundAssets();
  void preloadCoinAsset();
  void preloadSkinAssets();
  void preloadZoneAssets();

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
      const previousBest = saveData.best;
      saveData = mergeRunIntoSave(saveData, stats, game.runCoins);
      if (stats.score > previousBest) {
        void platform.sendScore(stats.score);
      }
      void platform.saveSave(saveData);
      submitSoloRunScore(
        saveData,
        stats,
        platform.isAdsMode() ? 'playables' : 'web',
        currentRunId,
      );
      gameOverModal.show(stats, saveData, game.runCoins);
    },
    onStaminaTutorialComplete: () => {
      saveData = { ...saveData, staminaTutorialSeen: true };
      void platform.saveSave(saveData);
    },
  }, createTutorialState(tutorialEnabled), createStaminaIntroState(staminaTutorialEnabled));

  if (DEBUG) {
    (window as unknown as { __game: Game }).__game = game;
    console.log('[debug] enabled — logs + collider overlay. Inspect: window.__game');
  }

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
    skinsShop.hide();
    leaderboard.hide();
    nicknameGate.hide();
    currentRunId = newClientRunId();
    game.reset();
    gameOverModal.hide();
    mainMenu.hide();
    setMenuFxVisible(false);
  }

  function goToMainMenu(): void {
    game.returnToMenu();
    gameOverModal.hide();
    mainMenu.show(saveData);
    mainMenu.setMuted(isMuted());
    setMenuFxVisible(true);
    if (nicknameGate.needsNickname(saveData)) {
      nicknameGate.show();
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (game.phase === GamePhase.GameOver || game.phase === GamePhase.Menu) return;
    if (mainMenu.isVisible()) return;
    if (nicknameGate.isOpen() || leaderboard.isOpen()) return;
    sfx.unlock();
    game.handleTap();
  });

  mainMenu.show(saveData);
  mainMenu.setMuted(isMuted());
  setMenuFxVisible(true);
  renderMenuHomeFx(menuFxCtx, 0, saveData.equippedSkin);
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  platform.firstFrameReady();

  if (nicknameGate.needsNickname(saveData)) {
    nicknameGate.show();
  }

  await platform.getLanguage();
  sfx.setEnabled(!isMuted());
  platform.gameReady();

  let lastTime = performance.now();
  let inGameClass = false;
  function loop(now: number): void {
    requestAnimationFrame(loop);
    if (paused) {
      lastTime = now;
      physicsAcc = 0;
      game.syncRenderPrev();
      return;
    }
    const dtMs = now - lastTime;
    const dt = dtMs / 1000;
    lastTime = now;
    noteFrameTime(dtMs);

    const quality = getRenderQuality();
    // Capture once per display frame — capturing inside each physics step
    // made multi-step catch-up frames teleport the ball.
    game.captureRenderPrev();
    physicsAcc = stepFixed(
      physicsAcc,
      dt,
      (fixedDt) => game.update(fixedDt),
      maxPhysicsStepsForQuality(quality),
    );

    const alpha = Math.max(0, Math.min(1, physicsAcc / FIXED_DT));
    const displayBall = game.getDisplayBall(alpha);
    const displayClimb = game.getDisplayClimbOffset(alpha);
    const displayHoop = game.getDisplayHoop(alpha);
    const displayShake = game.getDisplayShake() * shakeScaleForQuality(quality);

    const inGame = game.phase !== GamePhase.Menu;
    if (inGame !== inGameClass) {
      inGameClass = inGame;
      appRoot.classList.toggle('in-game', inGame);
    }
    hud.update(
      game.stats,
      game.phase,
      game.ball.hasLaunched,
      game.tutorialPrompt,
      game.stamina,
      game.runCoins,
      game.staminaIntroActive,
    );
    if (game.phase === GamePhase.Menu) {
      ctx.fillStyle = '#0a0e14';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      renderMenuHomeFx(menuFxCtx, game.time, saveData.equippedSkin);
      setMenuFxVisible(true);
    } else {
      setMenuFxVisible(false);
      // Continuous display time for idle bob / FX (avoids step-quantized motion).
      const displayTime = game.time + physicsAcc;
      render(
        ctx,
        {
          x: displayBall.x,
          y: displayBall.y,
          radius: game.ball.radius,
          rotation: displayBall.rotation,
          hasLaunched: game.ball.hasLaunched,
        },
        displayHoop,
        game.coins,
        game.floatingTexts,
        {
          shake: displayShake,
          climbOffset: displayClimb,
          time: displayTime,
          level: game.stats.level,
        },
        DEBUG ? game.colliders : undefined,
        saveData.equippedSkin,
      );
    }
  }
  requestAnimationFrame(loop);
}

main().catch(console.error);
