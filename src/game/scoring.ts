import { HOOP_GEOMETRY } from './palette';
import { getRimPoints } from './collision';
import type { Ball, FloatingText, Hoop, RunStats } from './types';

export interface ScoreResult {
  scored: boolean;
  points: number;
  isSwish: boolean;
  displayText: string;
}

export function checkScore(ball: Ball, hoop: Hoop): ScoreResult | null {
  if (ball.scoredThisShot || !ball.hasLaunched || ball.fallingThrough) return null;

  const rimLine = hoop.y + HOOP_GEOMETRY.rimLeft.offsetY + HOOP_GEOMETRY.rimLeft.thickness;
  const { left: rimLeft, right: rimRight } = getRimPoints(hoop.x, hoop.y, hoop.side);

  const prevTop = ball.frameStartY - ball.radius;
  const currTop = ball.y - ball.radius;

  if (
    prevTop < rimLine &&
    currTop >= rimLine
  ) {
    const t = (rimLine - prevTop) / (currTop - prevTop);
    const cx = ball.frameStartX + (ball.x - ball.frameStartX) * t;
    if (cx - ball.radius > rimLeft && cx + ball.radius < rimRight) {
      const isSwish = !ball.hitRimThisShot;
      let points: number;
      let displayText: string;
      if (isSwish) {
        const combo = ball.comboAtShot + 1;
        points = combo;
        displayText = combo > 1 ? `Swish x${combo}!` : 'Swish!';
      } else {
        points = 1;
        displayText = '+1';
      }
      return { scored: true, points, isSwish, displayText };
    }
  }
  return null;
}

export function applyScore(
  result: ScoreResult,
  stats: RunStats,
  ball: Ball,
  floatingTexts: FloatingText[],
): void {
  if (result.isSwish) {
    stats.combo += 1;
    stats.cleanShots += 1;
  } else {
    stats.combo = 0;
    stats.rimHits += 1;
  }
  stats.score += result.points;
  stats.hasScoredOnce = true;

  floatingTexts.push({
    x: ball.x,
    y: ball.y - 40,
    text: result.displayText,
    life: 1.2,
    vy: -80,
    color: result.isSwish ? '#4ade80' : '#fbbf24',
  });
}

export function getCleanPercent(stats: RunStats): number {
  if (stats.totalShots === 0) return 0;
  return Math.round((stats.cleanShots / stats.totalShots) * 100);
}
