import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AsciiConfig, AsciiArtData } from './types/artwork';
import { DETAIL_GRID, CHAR_RAMPS, imageToAscii, getImageDataForGrid } from './lib/ascii';
import { loadImage } from './lib/image';
import ImageUploader from './components/ImageUploader';
import AsciiCanvas from './components/AsciiCanvas';
import ControlsPanel from './components/ControlsPanel';
import Presets from './components/Presets';
import ExportButtons from './components/ExportButtons';

const DEFAULT_CONFIG: AsciiConfig = {
  detail: 'medium',
  characterStyle: 'dense',
  customChars: '',
  textColor: '#ffffff',
  bgColor: '#111111',
  bgColor2: '#333333',
  bgType: 'solid',
  gradientAngle: 135,
  brightness: 0,
  contrast: 0,
  invert: false,
};

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const [asciiData, setAsciiData] = useState<AsciiArtData | null>(null);
  const [config, setConfig] = useState<AsciiConfig>(DEFAULT_CONFIG);
  const [showOriginal, setShowOriginal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const genTimeoutRef = useRef<number | null>(null);

  // Handle image upload
  const handleImage = useCallback(async (file: File, dataUrl: string) => {
    setImageFile(file);
    setImageDataUrl(dataUrl);
    try {
      const img = await loadImage(file);
      setLoadedImage(img);
    } catch {
      console.error('Failed to load image');
    }
  }, []);

  // Regenerate ASCII when image or config changes (debounced)
  useEffect(() => {
    if (!loadedImage) {
      setAsciiData(null);
      return;
    }

    if (genTimeoutRef.current) {
      clearTimeout(genTimeoutRef.current);
    }

    genTimeoutRef.current = window.setTimeout(() => {
      setIsGenerating(true);

      // Get the active character ramp
      const ramp =
        config.characterStyle === 'custom' && config.customChars.length > 0
          ? config.customChars
          : CHAR_RAMPS[config.characterStyle] || CHAR_RAMPS.dense;

      const cols = DETAIL_GRID[config.detail].cols;

      // Get resampled image data
      const imageData = getImageDataForGrid(loadedImage, cols);

      // Convert to ASCII
      const result = imageToAscii(
        imageData,
        cols,
        ramp,
        config.invert,
        config.brightness,
        config.contrast,
      );

      setAsciiData(result);
      setIsGenerating(false);
    }, 80); // 80ms debounce

    return () => {
      if (genTimeoutRef.current) clearTimeout(genTimeoutRef.current);
    };
  }, [loadedImage, config]);

  // Apply preset
  const applyPreset = useCallback((patch: Partial<AsciiConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  // Update single config value
  const updateConfig = useCallback((patch: Partial<AsciiConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  // Reset
  const resetAll = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setShowOriginal(false);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎨</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              ASCII <span className="text-blue-400">Canvas</span>
            </h1>
          </div>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl">
            Turn any photo into ASCII canvas art. Upload, customise the text and background, then download a poster-ready image.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Upload section */}
        <ImageUploader onImage={handleImage} hasImage={!!imageFile} />

        {!imageFile && (
          <div className="text-center py-20 text-neutral-600">
            <p className="text-lg">Upload a photo to get started ✨</p>
            <p className="text-sm mt-1">Your image stays on this device — no uploads to any server.</p>
          </div>
        )}

        {imageFile && (
          <>
            {/* Canvas + Before/After toggle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setShowOriginal(!showOriginal)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        showOriginal ? 'bg-blue-600' : 'bg-neutral-700'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          showOriginal ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                    <span className="text-xs text-neutral-400">
                      {showOriginal ? 'Original' : 'ASCII'}
                    </span>
                  </label>
                  {isGenerating && (
                    <span className="text-xs text-neutral-500 animate-pulse">Generating…</span>
                  )}
                </div>
                <button
                  onClick={resetAll}
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition"
                >
                  Reset all
                </button>
              </div>

              <AsciiCanvas
                data={asciiData}
                config={config}
                showOriginal={showOriginal}
                originalDataUrl={imageDataUrl}
              />
            </div>

            {/* Controls + Presets + Export — stacked on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls panel */}
              <div className="lg:col-span-2">
                <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 border border-neutral-800">
                  <ControlsPanel config={config} onChange={updateConfig} />
                </div>
              </div>

              {/* Sidebar: Presets + Export */}
              <div className="space-y-4">
                <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 border border-neutral-800">
                  <Presets onApply={applyPreset} />
                </div>
                <div className="bg-neutral-900 rounded-xl p-4 sm:p-6 border border-neutral-800">
                  <ExportButtons data={asciiData} config={config} />
                </div>
              </div>
            </div>

            {/* Privacy note */}
            <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 text-center">
              <p className="text-xs text-neutral-500">
                🔒 For this MVP, all image processing happens in your browser. Your photo never leaves this device.
              </p>
            </div>
          </>
        )}

        {/* Future print section */}
        <div className="bg-neutral-900/30 rounded-xl p-6 border border-neutral-800 text-center">
          <h3 className="text-sm font-semibold text-neutral-400 mb-2">🖨️ Canvas & Poster Prints</h3>
          <p className="text-xs text-neutral-600">
            Ordering physical canvas prints and posters directly from the app is coming soon.
            We'll be connecting to Printify so you can get your ASCII art on real walls.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800 mt-12 py-6 text-center text-xs text-neutral-600">
        <p>ASCII Canvas — built with React + Cloudflare Pages</p>
      </footer>
    </div>
  );
};

export default App;
