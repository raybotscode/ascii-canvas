import type { AsciiArtData } from '../types/artwork';

/**
 * Character ramps — from lightest to darkest character.
 * Index 0 = lightest (spaces/light symbols), last = darkest (solid symbols).
 */
export const CHAR_RAMPS: Record<string, string> = {
  simple: ' .:-=+*#%@',
  dense: ' .\'`^",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$',
  blocks: '░▒▓█',
  binary: '01',
};

/** Grid column counts for each detail level */
export const DETAIL_GRID: Record<string, { cols: number; label: string }> = {
  low:    { cols: 80,  label: 'Low' },
  medium: { cols: 120, label: 'Medium' },
  high:   { cols: 180, label: 'High' },
  ultra:  { cols: 240, label: 'Ultra' },
};

/**
 * Aspect ratio of a monospace character: height / width.
 * Most monospace fonts render characters about 1.7–2× taller than wide.
 * We use this to calculate the number of rows so the output appears square.
 */
const CHAR_ASPECT_RATIO = 1.7;

/**
 * Generate ASCII art from an ImageData source.
 * Crops to centre square, resamples to grid, maps luminance to characters.
 */
export function imageToAscii(
  imageData: ImageData,
  cols: number,
  charRamp: string,
  invert: boolean,
  brightness: number,
  contrast: number,
): AsciiArtData {
  const { width, height } = imageData;
  const rows = Math.max(1, Math.round(cols / CHAR_ASPECT_RATIO));

  // Resample the ImageData to cols × rows via an offscreen canvas
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = width;
  srcCanvas.height = height;
  const srcCtx = srcCanvas.getContext('2d')!;
  srcCtx.putImageData(imageData, 0, 0);

  const dstCanvas = document.createElement('canvas');
  dstCanvas.width = cols;
  dstCanvas.height = rows;
  const dstCtx = dstCanvas.getContext('2d')!;
  dstCtx.imageSmoothingEnabled = true;
  dstCtx.imageSmoothingQuality = 'high';
  dstCtx.drawImage(srcCanvas, 0, 0, cols, rows);

  const sampled = dstCtx.getImageData(0, 0, cols, rows).data;

  const lines: string[] = [];
  const rampLen = charRamp.length;
  if (rampLen === 0) return { lines: [], cols: 0, rows: 0 };

  // Precompute brightness & contrast adjustments
  const bOffset = (brightness / 100) * 255;
  // Contrast: scale distance from midpoint
  let contrastSlope: number;
  if (contrast >= 0) {
    contrastSlope = 1 + contrast / 100;
  } else {
    contrastSlope = 1 / (1 - contrast / 100);
  }

  for (let row = 0; row < rows; row++) {
    let line = '';
    for (let col = 0; col < cols; col++) {
      const idx = (row * cols + col) * 4;
      const r = sampled[idx];
      const g = sampled[idx + 1];
      const b = sampled[idx + 2];

      // Perceptual luminance
      let lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Apply brightness
      lum += bOffset;
      // Apply contrast
      lum = 128 + (lum - 128) * contrastSlope;
      // Clamp
      lum = Math.max(0, Math.min(255, lum));
      // Invert
      if (invert) lum = 255 - lum;

      // Map luminance to character (0–255 → ramp index)
      // Dark pixels → high index (dense char), light pixels → low index (sparse char)
      const charIdx = Math.floor((1 - lum / 255) * (rampLen - 1));
      line += charRamp[Math.max(0, Math.min(rampLen - 1, charIdx))];
    }
    lines.push(line);
  }

  return { lines, cols, rows };
}

/**
 * Resample an HTMLImageElement to a square grid of cols × rows.
 * Crops to centre-square from the source first, then scales down.
 */
export function getImageDataForGrid(
  img: HTMLImageElement,
  cols: number,
): ImageData {
  const rows = Math.max(1, Math.round(cols / CHAR_ASPECT_RATIO));
  const size = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - size) / 2;
  const sy = (img.naturalHeight - size) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, size, size, 0, 0, cols, rows);
  return ctx.getImageData(0, 0, cols, rows);
}
