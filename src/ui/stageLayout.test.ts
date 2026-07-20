import { describe, expect, it } from 'vitest';
import { computeStageLayout } from './stageLayout';

describe('stage layout fit modes', () => {
  it('letterboxes with contain on taller-than-9:16 viewports', () => {
    const layout = computeStageLayout(390, 844, undefined, 'contain');
    expect(layout.fit).toBe('contain');
    expect(layout.width).toBeCloseTo(390, 1);
    expect(layout.height).toBeLessThan(844);
    expect(layout.scale).toBeCloseTo(390 / 720, 4);
  });

  it('fills taller phones with cover and crops the sides', () => {
    const layout = computeStageLayout(390, 844, undefined, 'cover');
    expect(layout.fit).toBe('cover');
    expect(layout.height).toBeCloseTo(844, 1);
    expect(layout.width).toBeGreaterThan(390);
    expect(layout.scale).toBeCloseTo(844 / 1280, 4);
  });

  it('ignores safe-area insets when covering for app shells', () => {
    const layout = computeStageLayout(
      390,
      844,
      { top: 48, right: 0, bottom: 24, left: 0 },
      'cover',
    );
    expect(layout.height).toBeCloseTo(844, 1);
    expect(layout.safe.top).toBe(0);
  });
});
