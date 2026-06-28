import type { AsciiArtData, AsciiConfig } from '../types/artwork';

/** Ratio of monospace character width to font-size (approximate for most browsers). */
const CHAR_WIDTH_RATIO = 0.6;

/**
 * Draw a background onto a canvas context.
 */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  config: AsciiConfig,
) {
  switch (config.bgType) {
    case 'solid':
      ctx.fillStyle = config.bgColor;
      ctx.fillRect(0, 0, w, h);
      break;

    case 'linear': {
      const angle = (config.gradientAngle * Math.PI) / 180;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.max(w, h) / 2;
      const dx = Math.cos(angle) * r;
      const dy = Math.sin(angle) * r;
      const grad = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
      grad.addColorStop(0, config.bgColor);
      grad.addColorStop(1, config.bgColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'radial': {
      const r = Math.max(w, h) / 2;
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, r);
      grad.addColorStop(0, config.bgColor);
      grad.addColorStop(1, config.bgColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'rainbow': {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0.0, '#FF0040');
      grad.addColorStop(0.17, '#FF8C00');
      grad.addColorStop(0.33, '#FFE600');
      grad.addColorStop(0.5, '#00E676');
      grad.addColorStop(0.67, '#00B0FF');
      grad.addColorStop(0.83, '#304FFE');
      grad.addColorStop(1.0, '#D500F9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'darkPoster': {
      const r = Math.max(w, h) / 2;
      const grad = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h / 2, r);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(0.5, '#16213e');
      grad.addColorStop(1, '#0f3460');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }

    case 'creamPaper': {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#F5F0E8');
      grad.addColorStop(1, '#E8DCC8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      break;
    }
  }
}

/**
 * Core renderer — draws ASCII characters onto a canvas context at a given logical size.
 * Used by both preview and export renderers.
 */
export function renderAsciiOnCanvas(
  ctx: CanvasRenderingContext2D,
  data: AsciiArtData,
  config: AsciiConfig,
  size: number,
) {
  const { lines, cols, rows } = data;
  if (!lines.length) return;

  // Background
  drawBackground(ctx, size, size, config);

  // Calculate font size to fill the square width
  // charWidth = fontSize * CHAR_WIDTH_RATIO
  // cols * charWidth = size  →  fontSize = size / (cols * CHAR_WIDTH_RATIO)
  const fontSize = size / (cols * CHAR_WIDTH_RATIO);
  ctx.font = `${fontSize}px "Courier New", Courier, monospace`;
  ctx.textBaseline = 'top';
  ctx.fillStyle = config.textColor;

  for (let row = 0; row < rows; row++) {
    const line = lines[row];
    if (!line) continue;
    ctx.fillText(line, 0, row * fontSize);
  }
}

/**
 * Render ASCII onto a canvas at the given logical size, handling device-pixel ratio.
 * Used for the on-screen preview.
 */
export function renderAsciiPreview(
  canvas: HTMLCanvasElement,
  data: AsciiArtData,
  config: AsciiConfig,
  logicalSize: number,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = logicalSize * dpr;
  canvas.height = logicalSize * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(dpr, dpr);
  renderAsciiOnCanvas(ctx, data, config, logicalSize);
}

/**
 * Render ASCII onto a canvas at the given export size (default 1080px).
 * Used for PNG download.
 */
export function renderAsciiExport(
  canvas: HTMLCanvasElement,
  data: AsciiArtData,
  config: AsciiConfig,
  exportSize = 1080,
) {
  canvas.width = exportSize;
  canvas.height = exportSize;
  const ctx = canvas.getContext('2d')!;
  renderAsciiOnCanvas(ctx, data, config, exportSize);
}

/**
 * Download a canvas as PNG.
 */
function downloadCanvasBlob(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Generate and download a PNG of the ASCII art at 1080×1080.
 */
export function downloadAsciiPNG(data: AsciiArtData, config: AsciiConfig, filename = 'ascii-canvas.png') {
  const canvas = document.createElement('canvas');
  renderAsciiExport(canvas, data, config);
  downloadCanvasBlob(canvas, filename);
}

/**
 * Download raw ASCII text as a .txt file.
 */
export function downloadAsciiTXT(data: AsciiArtData, filename = 'ascii-canvas.txt') {
  const text = data.lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
