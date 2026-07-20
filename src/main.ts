import { SfxEngine } from './audio/sfx';
import { CANVAS_HEIGHT, CANVAS_WIDTH, altitudeLevel } from './game/constants';
import { DEBUG } from './game/debug';
import { Game } from './game/Game';
import { VersusGame, type VersusPlayerId } from './game/VersusGame';
import { createStaminaIntroState, createTutorialState, shouldRunStaminaTutorial, shouldRunTutorial } from './game/tutorial';
import { GamePhase } from './game/types';
import { DefaultTapLaunch } from './game/mechanics/defaultTapLaunch';
import { render, renderLoading, renderVersus } from './game/renderer';
import { preloadBackgroundAssets } from './game/assetLoader';
import { preloadCoinAsset } from './game/coinRenderer';
import { getDecodedZoneAssetCount, preloadZoneAssets } from './game/zoneAssets';
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
import { PerfDiagnostics } from './ui/perfDiagnostics';
import { renderMenuHomeFx } from './ui/menuHome3d';
import { SkinsShop } from './ui/skinsShop';
import { NicknameGate } from './ui/nicknameGate';
import { LeaderboardOverlay } from './ui/leaderboardOverlay';
import {
  applyAppShellClass,
  applyResponsiveCssVars,
  bindStageResize,
  computeStageLayout,
  detectStageFit,
  getViewportSize,
  layoutsEqual,
  syncSafeAreaCssVars,
  type StageLayout,
} from './ui/stageLayout';
import { FIXED_DT, stepFixed } from './game/physics';
import {
  freezeRenderQuality,
  getRenderQuality,
  getRenderDiagnostics,
  maxPhysicsStepsForFrame,
  noteFrameTime,
  onRenderQualityChange,
  shakeScaleForQuality,
} from './game/renderQuality';
import { newClientRunId, submitSoloRunScore } from './services/api/submitRun';
import { MpClient } from './services/mp/client';
import { OnlineVersusSession } from './services/mp/onlineVersus';
import type { MpServerMessage } from '../shared/contracts/mp';

const launchMechanic = new DefaultTapLaunch();
const versusLaunchMechanic = new DefaultTapLaunch();

type ActiveMode = 'menu' | 'solo' | 'versus';
type VersusKind = 'local' | 'online';

async function main(): Promise<void> {
  const platform = createPlatform();
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const ctx =
    canvas.getContext('2d', { alpha: false, desynchronized: true }) ?? canvas.getContext('2d')!;
  const menuFxCanvas = document.getElementById('menu-fx-canvas') as HTMLCanvasElement;
  const menuFxCtx = menuFxCanvas.getContext('2d')!;
  const canvasStage = document.querySelector('.canvas-stage') as HTMLElement;
  const appRoot = document.getElementById('app')!;
  const perfDiagnostics = new PerfDiagnostics(canvasStage);
  let lastLayout: StageLayout | null = null;
  let physicsAcc = 0;
  let currentRunId = newClientRunId();
  let activeMode: ActiveMode = 'menu';
  let versusKind: VersusKind = 'local';
  let onlineMp: MpClient | null = null;
  let onlineSession: OnlineVersusSession | null = null;
  let onlineLabels = { p1: 'P1', p2: 'P2' };

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
    () => {
      requireNicknameThen(() => {
        if (versusKind === 'online') {
          cleanupOnline();
          versusLobby.show();
          return;
        }
        startVersusRun();
      });
    },
    () => goToMainMenu(),
  );

  const versusLobby = new VersusLobby({
    getSave: () => saveData,
    onLocalVersus: () => requireNicknameThen(() => startVersusRun()),
    onOnlineMatch: (mp, initial) => startOnlineVersus(mp, initial),
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
    const fit = detectStageFit();
    applyAppShellClass(fit === 'cover');

    // Cover mode fills the true WebView; contain uses the padded #app box.
    const viewport = fit === 'cover' ? getViewportSize() : {
      width: appRoot.clientWidth,
      height: appRoot.clientHeight,
    };
    const layout = computeStageLayout(viewport.width, viewport.height, undefined, fit);
    applyResponsiveCssVars(canvasStage, layout, appRoot);

    if (layoutsEqual(lastLayout, layout)) return;
    lastLayout = layout;

    canvasStage.style.width = `${layout.width}px`;
    canvasStage.style.height = `${layout.height}px`;
    canvasStage.style.maxWidth = fit === 'cover' ? 'none' : '';
    canvasStage.style.maxHeight = fit === 'cover' ? 'none' : '';

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
      if (onlineSession?.active && onlineSession.youAreHost) {
        onlineSession.publishMatchEnd(result);
        return;
      }
      if (onlineSession?.active && !onlineSession.youAreHost) {
        // Guest waits for authoritative match_end from the host.
        return;
      }
      sfx.gameOver();
      versusResultModal.show(result, onlineLabels);
    },
  });

  function cleanupOnline(): void {
    onlineSession?.dispose();
    onlineSession = null;
    onlineMp?.disconnect();
    onlineMp = null;
  }

  function showOnlineResult(
    result: {
      scoreP1: number;
      scoreP2: number;
      winner: 'p1' | 'p2' | 'draw';
      durationSec: number;
      reason: 'timer' | 'forfeit';
    },
  ): void {
    versusHud.hide();
    sfx.gameOver();
    versusResultModal.show(result, {
      ...onlineLabels,
      forfeit: result.reason === 'forfeit',
    });
  }

  function startOnlineVersus(mp: MpClient, initial?: MpServerMessage): void {
    cleanupOnline();
    versusKind = 'online';
    onlineMp = mp;
    onlineSession = new OnlineVersusSession(mp, versusGame, {
      onCountdown: () => {},
      onMatchStart: ({ yourSlot, youAreHost, players }) => {
        const p1 = players.find((p) => p.slot === 0)?.nickname ?? 'P1';
        const p2 = players.find((p) => p.slot === 1)?.nickname ?? 'P2';
        onlineLabels = { p1, p2 };
        const you = yourSlot === 0 ? p1 : p2;
        versusHud.setLabels(
          p1,
          p2,
          youAreHost
            ? `Tap to shoot · You are ${you} (host)`
            : `Tap to shoot · You are ${you}`,
        );
        activeMode = 'versus';
        skinsShop.hide();
        leaderboard.hide();
        nicknameGate.hide();
        gameOverModal.hide();
        game.returnToMenu();
        versusResultModal.hide();
        versusHud.show();
        mainMenu.hide();
        setMenuFxVisible(false);
      },
      onMatchEnd: (result) => showOnlineResult(result),
    });

    mp.setHandlers({
      onMessage: (message) => {
        onlineSession?.bindMessage(message);
      },
      onClose: () => {
        if (!onlineSession?.active) return;
        const yourSlot = onlineSession.yourSlot;
        const scoreP1 = versusGame.scoreP1;
        const scoreP2 = versusGame.scoreP2;
        onlineSession.dispose();
        versusGame.markMatchOver();
        showOnlineResult({
          scoreP1,
          scoreP2,
          winner: yourSlot === 0 ? 'p2' : 'p1',
          durationSec: 120,
          reason: 'forfeit',
        });
      },
      onError: () => {},
    });

    if (initial) {
      onlineSession.bindMessage(initial);
    }
  }

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
    cleanupOnline();
    versusKind = 'local';
    onlineLabels = { p1: 'P1', p2: 'P2' };
    versusHud.setLabels('P1', 'P2', 'Left tap = P1 · Right tap = P2');
    skinsShop.hide();
    leaderboard.hide();
    nicknameGate.hide();
    versusResultModal.hide();
    versusHud.hide();
    versusGame.returnToMenu();
    currentRunId = newClientRunId();
    game.reset();
    physicsAcc = 0;
    game.syncRenderPrev();
    freezeRenderQuality(true);
    gameOverModal.hide();
    mainMenu.hide();
    setMenuFxVisible(false);
  }

  function startVersusRun(): void {
    cleanupOnline();
    versusKind = 'local';
    onlineLabels = { p1: 'P1', p2: 'P2' };
    versusHud.setLabels('P1', 'P2', 'Left tap = P1 · Right tap = P2');
    activeMode = 'versus';
    skinsShop.hide();
    leaderboard.hide();
    nicknameGate.hide();
    gameOverModal.hide();
    game.returnToMenu();
    versusResultModal.hide();
    versusGame.reset();
    physicsAcc = 0;
    versusGame.syncRenderPrev();
    freezeRenderQuality(true);
    versusHud.show();
    mainMenu.hide();
    setMenuFxVisible(false);
  }

  function goToMainMenu(): void {
    activeMode = 'menu';
    cleanupOnline();
    versusKind = 'local';
    onlineLabels = { p1: 'P1', p2: 'P2' };
    versusHud.setLabels('P1', 'P2', 'Left tap = P1 · Right tap = P2');
    game.returnToMenu();
    versusGame.returnToMenu();
    gameOverModal.hide();
    versusResultModal.hide();
    versusHud.hide();
    physicsAcc = 0;
    freezeRenderQuality(false);
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
      sfx.unlock();
      if (onlineSession?.active) {
        onlineSession.handleLocalTap();
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / Math.max(1, rect.width);
      const player: VersusPlayerId = xNorm < 0.5 ? 0 : 1;
      versusGame.handleTap(player);
      return;
    }

    if (game.phase === GamePhase.GameOver || game.phase === GamePhase.Menu) return;
    sfx.unlock();
    game.handleTap();
  });

  // Keyboard helpers for versus on desktop.
  window.addEventListener('keydown', (e) => {
    if (activeMode !== 'versus') return;
    if (versusGame.phase === GamePhase.GameOver || versusGame.phase === GamePhase.Menu) return;
    const key = e.key.toLowerCase();
    if (onlineSession?.active) {
      if (key === ' ' || key === 'w' || key === 'arrowup') {
        e.preventDefault();
        onlineSession.handleLocalTap();
      }
      return;
    }
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
    perfDiagnostics.update(
      now,
      lastLayout,
      getRenderDiagnostics(),
      getDecodedZoneAssetCount(),
    );

    const quality = getRenderQuality();
    const physicsSteps = maxPhysicsStepsForFrame(dt);

    if (activeMode === 'versus') {
      onlineSession?.sampleRemoteState(now);
      versusGame.captureRenderPrev();
      physicsAcc = stepFixed(
        physicsAcc,
        dt,
        (fixedDt) => versusGame.update(fixedDt),
        physicsSteps,
      );
      onlineSession?.publishSnapshotIfDue(now);
      const alpha = Math.max(0, Math.min(1, physicsAcc / FIXED_DT));
      const b0 = versusGame.getDisplayBall(0, alpha);
      const b1 = versusGame.getDisplayBall(1, alpha);
      const displayClimb = versusGame.getDisplayClimbOffset(alpha);
      const displayHoop = versusGame.getDisplayHoop(alpha);
      const displayShake = versusGame.getDisplayShake() * shakeScaleForQuality(quality);
      const climbLevel = altitudeLevel(displayClimb);

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
      if (onlineSession?.active) {
        versusHud.setPing(onlineSession.getRttMs());
      } else {
        versusHud.setPing(null);
      }

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
      physicsSteps,
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
          level: altitudeLevel(displayClimb),
        },
        DEBUG ? game.colliders : undefined,
        saveData.equippedSkin,
      );
    }
  }
  requestAnimationFrame(loop);
}

main().catch(console.error);
