export const CANVAS_WIDTH = 720;

export const CANVAS_HEIGHT = 1280;



export const BALL_RADIUS = 30;

export const GRAVITY = 980;

export const JUMP_FORCE = 600;

export const HORIZONTAL_FORCE = 300;

export const AIR_DRAG = 0.15;

export const BOUNCE_COEF = 0.7;

export const FLOOR_FRICTION = 0.6;

export const MIN_H_SPEED = 50;



export const MAX_DT = 0.1;

export const HOOP_SLIDE_DURATION = 0.35;

export const RIM_TILT_SPRING = 0.08;

export const RIM_TILT_DAMPING = 0.92;

export const RIM_TILT_MAX = 0.12;



export const HOOP_LEFT_X = 12;

export const HOOP_RIGHT_X = CANVAS_WIDTH - 12;

export const HOOP_WIDTH = 95;

export const HOOP_RIM_RADIUS = 8;



/** Climbing — offset rises each basket so the world scrolls down (player rises). */

export const CLIMB_PER_BASKET = 240;

export const SCROLL_SPEED = 520;

export const HOOP_SCREEN_Y = 460;

export const HOOP_CLEARANCE = 140;

export const DEATH_MARGIN = 40;



/**

 * World Y grows downward. Smaller Y = higher altitude (sky).

 * Camera: screenY = worldY + climbOffset (climbOffset starts negative, increases as you climb).

 */

export const WORLD = {

  starsEnd: 500,

  highCloudEnd: 1100,

  lowCloudEnd: 1600,

  rooftopEnd: 1900,

  stadiumTop: 1900,

  courtFloorY: 3080,

  spawnY: 3020,

  spawnX: CANVAS_WIDTH / 2,

} as const;



export const BALL_SPAWN_X = WORLD.spawnX;

export const BALL_SPAWN_Y = WORLD.spawnY;

export const FLOOR_Y = WORLD.courtFloorY;



/** Screen Y where the ball floats at game start (center court jump circle). */

export const BALL_START_SCREEN_Y = 790;

/** Camera offset so spawn world Y maps to BALL_START_SCREEN_Y. */

export const INITIAL_CLIMB_OFFSET = BALL_START_SCREEN_Y - BALL_SPAWN_Y;



/** @deprecated use INITIAL_CLIMB_OFFSET */

export const INITIAL_SCROLL_Y = INITIAL_CLIMB_OFFSET;



export function screenY(worldY: number, climbOffset: number): number {

  return worldY + climbOffset;

}



export function worldYFromScreen(screenYPos: number, climbOffset: number): number {

  return screenYPos - climbOffset;

}



export function hoopWorldY(climbOffset: number): number {

  return HOOP_SCREEN_Y - climbOffset;

}



export function altitudeClimbed(climbOffset: number): number {

  return climbOffset - INITIAL_CLIMB_OFFSET;

}



export function isBallOffScreen(worldY: number, radius: number, climbOffset: number): boolean {

  const sy = screenY(worldY, climbOffset);

  return sy - radius < DEATH_MARGIN || sy + radius > CANVAS_HEIGHT - DEATH_MARGIN;

}



/** @deprecated use isBallOffScreen */

export function isBallOffBottom(worldY: number, radius: number, climbOffset: number): boolean {

  return isBallOffScreen(worldY, radius, climbOffset);

}



export function altitudeTier(climbOffset: number): number {

  return Math.floor(altitudeClimbed(climbOffset) / CLIMB_PER_BASKET);

}

