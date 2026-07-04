import { HORIZONTAL_FORCE, JUMP_FORCE } from '../constants';
import type { HoopSide } from '../types';
import type { LaunchMechanic, TapContext } from './LaunchMechanic';

function horizontalTowardHoop(hoopSide: HoopSide): number {
  return hoopSide === 'left' ? -HORIZONTAL_FORCE : HORIZONTAL_FORCE;
}

function applySteer(ball: TapContext['ball'], hoop: TapContext['hoop'], strength: number): void {
  ball.vy = -JUMP_FORCE * strength;
  ball.vx += horizontalTowardHoop(hoop.side) * 0.5 * strength;
  const maxVx = HORIZONTAL_FORCE * 1.5;
  ball.vx = Math.max(-maxVx, Math.min(maxVx, ball.vx));
}

/** Reference tap-to-jump mechanic — swap this class for Phase 8 core logic change. */
export class DefaultTapLaunch implements LaunchMechanic {
  onFirstTap(ctx: TapContext): void {
    const { ball, hoop } = ctx;
    ball.hasLaunched = true;
    ball.vy = -JUMP_FORCE;
    ball.vx = horizontalTowardHoop(hoop.side);
  }

  onTap(ctx: TapContext): void {
    const { ball, hoop, staminaStrength = 1 } = ctx;
    if (!ball.hasLaunched) {
      this.onFirstTap(ctx);
      return;
    }
    applySteer(ball, hoop, staminaStrength);
  }

  reset(): void {}
}
