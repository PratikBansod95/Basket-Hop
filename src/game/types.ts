export type HoopSide = 'left' | 'right';

export enum GamePhase {
  Menu = 'menu',
  Idle = 'idle',
  Playing = 'playing',
  GameOver = 'gameover',
}

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

export interface RunStats {
  score: number;
  combo: number;
  cleanShots: number;
  rimHits: number;
  totalShots: number;
  hasScoredOnce: boolean;
  level: number;
}

export interface GameSnapshot {
  phase: GamePhase;
  ball: Ball;
  hoop: Hoop;
  stats: RunStats;
  shake: number;
  floatingTexts: FloatingText[];
}
