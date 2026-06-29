export interface NetPoint {
  x: number;
  y: number;
}

export interface NetLayout {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  strands: number;
  topPts: NetPoint[];
  hangPts: NetPoint[];
  bottomPts: NetPoint[];
  ringYs: number[];
  spanLeft: number;
  spanRight: number;
  bottomLeft: number;
  bottomRight: number;
}

export function buildNetLayout(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rimLeftX: number,
  rimRightX: number,
): NetLayout {
  const strands = 9;
  const hangY = cy + ry * 0.42;
  const netDepth = 80;
  const pad = 16;
  const spanLeft = rimLeftX + 2;
  const spanRight = rimRightX - 2;
  const bottomLeft = spanLeft + pad;
  const bottomRight = spanRight - pad;
  const netBottom = hangY + netDepth;

  const topPts: NetPoint[] = [];
  const hangPts: NetPoint[] = [];
  const bottomPts: NetPoint[] = [];

  for (let i = 0; i <= strands; i++) {
    const t = i / strands;
    const angle = Math.PI * (0.08 + t * 0.84);
    topPts.push({
      x: cx + Math.cos(angle) * (rx - 0.5),
      y: cy + Math.sin(angle) * (ry - 0.3),
    });
    hangPts.push({ x: spanLeft + (spanRight - spanLeft) * t, y: hangY });
    bottomPts.push({ x: bottomLeft + (bottomRight - bottomLeft) * t, y: netBottom });
  }

  const ringYs = [1, 2, 3].map((ring) => hangY + (netDepth * ring) / 4);

  return {
    cx,
    cy,
    rx,
    ry,
    strands,
    topPts,
    hangPts,
    bottomPts,
    ringYs,
    spanLeft,
    spanRight,
    bottomLeft,
    bottomRight,
  };
}

export function ringPoint(layout: NetLayout, ringIdx: number, col: number): NetPoint {
  const hang = layout.hangPts[col];
  const bottom = layout.bottomPts[col];
  const y = layout.ringYs[ringIdx];
  const t = (y - hang.y) / (bottom.y - hang.y);
  return { x: hang.x + (bottom.x - hang.x) * t, y };
}

export function ringSpan(layout: NetLayout, y: number): { x1: number; x2: number } {
  const hangY = layout.hangPts[0].y;
  const bottomY = layout.bottomPts[0].y;
  const rt = (y - hangY) / (bottomY - hangY);
  return {
    x1: layout.spanLeft + (layout.bottomLeft - layout.spanLeft) * rt,
    x2: layout.spanRight + (layout.bottomRight - layout.spanRight) * rt,
  };
}
