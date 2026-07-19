import type { RenderDiagnostics } from '../game/renderQuality';
import type { StageLayout } from './stageLayout';

export class PerfDiagnostics {
  private element: HTMLElement | null = null;
  private lastUpdate = 0;

  constructor(parent: HTMLElement) {
    if (!new URLSearchParams(window.location.search).has('perf')) return;
    this.element = document.createElement('pre');
    this.element.className = 'perf-diagnostics';
    parent.append(this.element);
  }

  update(
    now: number,
    layout: StageLayout | null,
    diagnostics: RenderDiagnostics,
    zoneCacheSize: number,
  ): void {
    if (!this.element || !layout || now - this.lastUpdate < 400) return;
    this.lastUpdate = now;
    const rawDpr = window.devicePixelRatio || 1;
    this.element.textContent = [
      `${diagnostics.quality.toUpperCase()} · avg ${diagnostics.frameEmaMs.toFixed(1)}ms · p95 ${diagnostics.p95FrameMs.toFixed(1)}ms`,
      `refresh ${diagnostics.refreshIntervalMs.toFixed(1)}ms · drop ${(diagnostics.droppedFrameRatio * 100).toFixed(0)}%`,
      `raw DPR ${rawDpr.toFixed(2)} · canvas ${layout.dpr.toFixed(2)}x`,
      `stage ${Math.round(layout.width)}×${Math.round(layout.height)} · scale ${layout.scale.toFixed(2)}`,
      `backing ${Math.round(720 * layout.dpr)}×${Math.round(1280 * layout.dpr)}`,
      `zones ${zoneCacheSize}/4 · shifts ${diagnostics.transitions}`,
    ].join('\n');
  }
}
