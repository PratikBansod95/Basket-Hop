import { HORIZONTAL_FORCE, JUMP_FORCE } from '../constants';
import type { Ball, Hoop, HoopSide } from '../types';

export interface TapContext {
  ball: Ball;
  hoop: Hoop;
  isFirstTap: boolean;
  /** 0-1 control power from the stamina meter (mid-air only). */
  staminaStrength?: number;
}

export interface LaunchMechanic {
  onFirstTap(ctx: TapContext): void;
  onTap(ctx: TapContext): void;
  reset(): void;
}

function horizontalTowardHoop(hoopSide: HoopSide): number {
  return hoopSide === 'left' ? -HORIZONTAL_FORCE : HORIZONTAL_FORCE;
}

/** @deprecated Use DefaultTapLaunch from defaultTapLaunch.ts */
export class DefaultTapLaunch implements LaunchMechanic {
  onFirstTap(ctx: TapContext): void {
    const { ball, hoop } = ctx;
    ball.hasLaunched = true;
    ball.vy = -JUMP_FORCE;
    ball.vx = horizontalTowardHoop(hoop.side);
  }

  onTap(ctx: TapContext): void {
    const { ball, hoop } = ctx;
    if (!ball.hasLaunched) {
      this.onFirstTap(ctx);
      return;
    }
    ball.vy = -JUMP_FORCE;
    ball.vx += horizontalTowardHoop(hoop.side) * 0.5;
    const maxVx = HORIZONTAL_FORCE * 1.5;
    ball.vx = Math.max(-maxVx, Math.min(maxVx, ball.vx));
  }

  reset(): void {}
}
