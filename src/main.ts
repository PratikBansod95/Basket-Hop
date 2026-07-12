import { SfxEngine } from './audio/sfx';
import { CANVAS_HEIGHT, CANVAS_WIDTH, altitudeTier } from './game/constants';
import { DEBUG } from './game/debug';
import { Game } from './game/Game';
import { VersusGame, type VersusPlayerId } from './game/VersusGame';
import { createStaminaIntroState, createTutorialState, shouldRunStaminaTutorial, shouldRunTutorial } from './game/tutorial';
import { GamePhase } from './game/types';
import { DefaultTapLaunch } from './game/mechanics/defaultTapLaunch';
import { render, renderLoading, renderVersus } from './game/renderer';
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
import { VersusLobby } from './ui/versusLobby';
import { VersusHud } from './ui/versusHud';
import { VersusResultModal } from './ui/versusResult';
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
const versusLaunchMechanic = new DefaultTapLaunch();

type ActiveMode = 'menu' | 'solo' | 'versus';

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
  let activeMode: ActiveMode = 'menu';

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
  const versusHud = new VersusHud();
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

  const versusResultModal = new VersusResultModal(
    () => requireNicknameThen(() => startVersusRun()),
    () => goToMainMenu(),
  );

  const versusLobby = new VersusLobby({
    getSave: () => saveData,
    onLocalVersus: () => requireNicknameThen(() => startVersusRun()),
    onClose: () => {},
  });

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
    () => {
      sfx.unlock();
      requireNicknameThen(() => versusLobby.show());
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

  const versusGame = new VersusGame(versusLaunchMechanic, {
    onTap: () => {
      sfx.unlock();
      sfx.tap();
    },
    onBounce: () => sfx.bounce(),
    onSwoosh: () => sfx.swoosh(),
    onScore: () => {},
    onMatchEnd: (result) => {
      sfx.gameOver();
      versusResultModal.show(result);
    },
  });

  if (DEBUG) {
    (window as unknown as { __game: Game; __versus: VersusGame }).__game = game;
    (window as unknown as { __versus: VersusGame }).__versus = versusGame;
    console.log('[debug] enabled — logs + collider overlay. Inspect: window.__game / __versus');
  }

  platform.onPause(() => {
    paused = true;
    game.paused = true;
    versusGame.paused = true;
    void platform.saveSave(saveData);
  });
  platform.onResume(() => {
    paused = false;
    game.paused = false;
    versusGame.paused = false;
  });

  function startRun(): void {
    activeMode = 'solo';
    skinsShop.hide();
    leaderboard.hide();
    nicknameGate.hide();
    versusResultModal.hide();
    versusHud.hide();
    versusGame.returnToMenu();
    currentRunId = newClientRunId();
    game.reset();
    gameOverModal.hide();
    mainMenu.hide();
    setMenuFxVisible(false);
  }

  function startVersusRun(): void {
    activeMode = 'versus';
    skinsShop.hide();
    leaderboard.hide();
    nicknameGate.hide();
    gameOverModal.hide();
    game.returnToMenu();
    versusResultModal.hide();
    versusGame.reset();
    versusHud.show();
    mainMenu.hide();
    setMenuFxVisible(false);
  }

  function goToMainMenu(): void {
    activeMode = 'menu';
    game.returnToMenu();
    versusGame.returnToMenu();
    gameOverModal.hide();
    versusResultModal.hide();
    versusHud.hide();
    mainMenu.show(saveData);
    mainMenu.setMuted(isMuted());
    setMenuFxVisible(true);
    if (nicknameGate.needsNickname(saveData)) {
      nicknameGate.show();
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    if (mainMenu.isVisible()) return;
    if (nicknameGate.isOpen() || leaderboard.isOpen() || versusLobby.isOpen()) return;

    if (activeMode === 'versus') {
      if (versusGame.phase === GamePhase.GameOver || versusGame.phase === GamePhase.Menu) return;
      const rect = canvas.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / Math.max(1, rect.width);
      const player: VersusPlayerId = xNorm < 0.5 ? 0 : 1;
      sfx.unlock();
      versusGame.handleTap(player);
      return;
    }

    if (game.phase === GamePhase.GameOver || game.phase === GamePhase.Menu) return;
    sfx.unlock();
    game.handleTap();
  });

  // Keyboard helpers for local versus on desktop (A/W = P1, arrows = P2).
  window.addEventListener('keydown', (e) => {
    if (activeMode !== 'versus') return;
    if (versusGame.phase === GamePhase.GameOver || versusGame.phase === GamePhase.Menu) return;
    const key = e.key.toLowerCase();
    if (key === 'a' || key === 'w') {
      e.preventDefault();
      versusGame.handleTap(0);
    } else if (key === 'arrowleft' || key === 'arrowup') {
      e.preventDefault();
      versusGame.handleTap(1);
    }
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
      if (activeMode === 'versus') versusGame.syncRenderPrev();
      else game.syncRenderPrev();
      return;
    }
    const dtMs = now - lastTime;
    const dt = dtMs / 1000;
    lastTime = now;
    noteFrameTime(dtMs);

    const quality = getRenderQuality();

    if (activeMode === 'versus') {
      versusGame.captureRenderPrev();
      physicsAcc = stepFixed(
        physicsAcc,
        dt,
        (fixedDt) => versusGame.update(fixedDt),
        maxPhysicsStepsForQuality(quality),
      );
      const alpha = Math.max(0, Math.min(1, physicsAcc / FIXED_DT));
      const b0 = versusGame.getDisplayBall(0, alpha);
      const b1 = versusGame.getDisplayBall(1, alpha);
      const displayClimb = versusGame.getDisplayClimbOffset(alpha);
      const displayHoop = versusGame.getDisplayHoop(alpha);
      const displayShake = versusGame.getDisplayShake() * shakeScaleForQuality(quality);
      const climbLevel = altitudeTier(versusGame.climbOffset);

      const inGame = versusGame.phase !== GamePhase.Menu;
      if (inGame !== inGameClass) {
        inGameClass = inGame;
        appRoot.classList.toggle('in-game', inGame);
      }

      // Hide solo HUD while versus is active.
      hud.update(game.stats, 'menu', false);
      versusHud.update(
        versusGame.scoreP1,
        versusGame.scoreP2,
        versusGame.timeLeft,
        versusGame.phase,
        versusGame.balls[0].hasLaunched || versusGame.balls[1].hasLaunched,
      );

      if (versusGame.phase === GamePhase.Menu) {
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        renderMenuHomeFx(menuFxCtx, versusGame.time, saveData.equippedSkin);
        setMenuFxVisible(true);
      } else {
        setMenuFxVisible(false);
        const displayTime = versusGame.time + physicsAcc;
        renderVersus(
          ctx,
          [
            {
              x: b0.x,
              y: b0.y,
              radius: versusGame.balls[0].radius,
              rotation: b0.rotation,
              hasLaunched: versusGame.balls[0].hasLaunched,
            },
            {
              x: b1.x,
              y: b1.y,
              radius: versusGame.balls[1].radius,
              rotation: b1.rotation,
              hasLaunched: versusGame.balls[1].hasLaunched,
            },
          ],
          displayHoop,
          versusGame.floatingTexts,
          {
            shake: displayShake,
            climbOffset: displayClimb,
            time: displayTime,
            level: climbLevel,
          },
          DEBUG ? versusGame.colliders : undefined,
          [saveData.equippedSkin, saveData.equippedSkin],
        );
      }
      return;
    }

    // Solo path — keep versus HUD tucked away.
    versusHud.hide();

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
