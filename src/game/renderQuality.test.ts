import { describe, expect, it } from 'vitest';
import {
  AdaptiveQualityController,
  maxPhysicsStepsForFrame,
  targetCanvasScale,
} from './renderQuality';

describe('adaptive render quality', () => {
  it('promotes a stable 60 Hz phone instead of trapping it on low', () => {
    const controller = new AdaptiveQualityController('low');
    for (let i = 0; i < 300; i += 1) controller.noteFrame(16.67);
    expect(controller.quality).toBe('medium');
  });

  it('also recognizes healthy high-refresh frame pacing', () => {
    const controller = new AdaptiveQualityController('low');
    for (let i = 0; i < 700; i += 1) controller.noteFrame(8.33);
    expect(controller.quality).toBe('medium');
    expect(controller.refreshIntervalMs).toBeCloseTo(8.33, 1);
  });

  it('promotes a stable 90 Hz profile', () => {
    const controller = new AdaptiveQualityController('low');
    for (let i = 0; i < 500; i += 1) controller.noteFrame(11.11);
    expect(controller.quality).toBe('medium');
    expect(controller.refreshIntervalMs).toBeCloseTo(11.11, 1);
  });

  it('falls back after sustained missed frames', () => {
    const controller = new AdaptiveQualityController('medium');
    for (let i = 0; i < 100; i += 1) controller.noteFrame(25);
    expect(controller.quality).toBe('low');
  });

  it('reports a rolling p95 frame interval for diagnostics', () => {
    const controller = new AdaptiveQualityController('low');
    for (let i = 0; i < 19; i += 1) controller.noteFrame(10);
    controller.noteFrame(30);
    expect(controller.p95FrameMs).toBe(30);
  });
});

describe('canvas resolution budgeting', () => {
  it('targets physical resolution only when the quality budget supports it', () => {
    const stageScale = 390 / 720;
    expect(targetCanvasScale(stageScale, 3, 'low')).toBe(1.22);
    expect(targetCanvasScale(stageScale, 3, 'medium')).toBeCloseTo(1.625, 3);
  });

  it('does not oversample a DPR-2 phone unnecessarily', () => {
    expect(targetCanvasScale(390 / 720, 2, 'medium')).toBeCloseTo(1.083, 3);
  });
});

describe('physics step budgeting', () => {
  it('scales fixed steps with frame duration instead of render quality', () => {
    expect(maxPhysicsStepsForFrame(1 / 60)).toBe(4);
    expect(maxPhysicsStepsForFrame(1 / 20)).toBeGreaterThanOrEqual(4);
    expect(maxPhysicsStepsForFrame(0.1)).toBe(7);
  });
});
