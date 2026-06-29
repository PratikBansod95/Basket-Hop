import { COLORS } from './palette';

const EMOJI_SIZE = 256;
let emojiCanvas: HTMLCanvasElement | null = null;
let emojiReady = false;

function getEmojiCanvas(): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  if (!emojiCanvas) {
    emojiCanvas = document.createElement('canvas');
    emojiCanvas.width = EMOJI_SIZE;
    emojiCanvas.height = EMOJI_SIZE;
    const ctx = emojiCanvas.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, EMOJI_SIZE, EMOJI_SIZE);
    ctx.font = '220px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏀', EMOJI_SIZE / 2, EMOJI_SIZE / 2 + 8);
    try {
      const px = ctx.getImageData(EMOJI_SIZE / 2 + 18, EMOJI_SIZE / 2, 1, 1).data[3];
      emojiReady = px > 8;
    } catch {
      emojiReady = true;
    }
  }
  return emojiCanvas;
}

if (typeof document !== 'undefined' && document.fonts) {
  void document.fonts.ready.then(() => getEmojiCanvas());
}

export function drawBallShadow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  floorY: number,
): void {
  const dist = floorY - y;
  const range = radius * 0.6;
  const t = Math.max(0, Math.min(1, dist / range));
  const scale = 1 - t * 0.5;
  const alpha = 0.45 * (1 - t * 0.7);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(x, floorY - 2, radius * 1.25 * scale, radius * 0.32 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawBall(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rotation: number,
): void {
  const emoji = getEmojiCanvas();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = COLORS.ball;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.fill();
  if (emoji && emojiReady) {
    const size = radius * 2.4;
    ctx.drawImage(emoji, -size / 2, -size / 2, size, size);
  } else {
    const grad = ctx.createRadialGradient(-radius * 0.25, -radius * 0.25, radius * 0.1, 0, 0, radius);
    grad.addColorStop(0, '#f0a064');
    grad.addColorStop(0.55, '#d4682a');
    grad.addColorStop(1, '#6a2c0c');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1b0e07';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-radius * 0.75, 0);
    ctx.lineTo(radius * 0.75, 0);
    ctx.stroke();
  }
  ctx.restore();
}
