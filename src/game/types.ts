export type HoopSide = 'left' | 'right';

export enum GamePhase {
  Menu = 'menu',
  Idle = 'idle',
  Playing = 'playing',
  GameOver = 'gameover',
}

export type PauseSource = 'none' | 'platform' | 'tutorial' | 'staminaTutorial';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hasLaunched: boolean;
  scoredThisShot: boolean;
  hitRimThisShot: boolean;
  fallingThrough: boolean;
  rotation: number;
  frameStartX: number;
  frameStartY: number;
  frameStartVelY: number;
  comboAtShot: number;
}

export interface Hoop {
  side: HoopSide;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  slideFromX: number;
  slideFromY: number;
  slideT: number;
  tilt: number;
  tiltVel: number;
  animating: boolean;
}

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  vy: number;
  color: string;
}

export interface Coin {
  id: string;
  x: number;
  y: number;
  radius: number;
  value: number;
  collected: boolean;
  phase: number;
}

export interface RunStats {
  score: number;
  combo: number;
  cleanShots: number;
  rimHits: number;
  totalShots: number;
  hasScoredOnce: boolean;
  level: number;
}

export interface TutorialState {
  enabled: boolean;
  stepsCompleted: number;
  maxSteps: number;
  awaitingSuccess: boolean;
  prompt: string | null;
}

export interface StaminaIntroState {
  enabled: boolean;
  pending: boolean;
  prompt: string | null;
}

export interface StaminaState {
  active: boolean;
  current: number;
  max: number;
  drainPerTap: number;
  regenPerSecond: number;
  basketRestore: number;
  blockedFeedback: number;
}

export interface GameSnapshot {
  phase: GamePhase;
  ball: Ball;
  hoop: Hoop;
  coins: Coin[];
  stats: RunStats;
  shake: number;
  floatingTexts: FloatingText[];
}
