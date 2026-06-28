import React, { useEffect, useRef, useState } from 'react';
import type { AsciiArtData, AsciiConfig } from '../types/artwork';
import { renderAsciiPreview } from '../lib/export';

interface AsciiCanvasProps {
  data: AsciiArtData | null;
  config: AsciiConfig;
  showOriginal: boolean;
  originalDataUrl: string | null;
}

const AsciiCanvas: React.FC<AsciiCanvasProps> = ({
  data,
  config,
  showOriginal,
  originalDataUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Render onto canvas whenever deps change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || containerWidth === 0) return;

    if (showOriginal && originalDataUrl) {
      // Show original image
      const dpr = window.devicePixelRatio || 1;
      canvas.width = containerWidth * dpr;
      canvas.height = containerWidth * dpr;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, containerWidth, containerWidth);
      };
      img.src = originalDataUrl;
    } else if (data) {
      renderAsciiPreview(canvas, data, config, containerWidth);
    }
  }, [data, config, containerWidth, showOriginal, originalDataUrl]);

  return (
    <div
      ref={containerRef}
      className="aspect-square w-full max-w-[min(80vh,100%)] mx-auto rounded-xl overflow-hidden shadow-2xl"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

export default AsciiCanvas;
