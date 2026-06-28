import React from 'react';
import type { AsciiConfig, DetailLevel, CharacterStyle, BackgroundType } from '../types/artwork';
import { DETAIL_GRID, CHAR_RAMPS } from '../lib/ascii';

interface ControlsPanelProps {
  config: AsciiConfig;
  onChange: (patch: Partial<AsciiConfig>) => void;
}

const bgOptions: { value: BackgroundType; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'linear', label: 'Gradient' },
  { value: 'radial', label: 'Radial' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'darkPoster', label: 'Dark Poster' },
  { value: 'creamPaper', label: 'Cream Paper' },
];

const ControlsPanel: React.FC<ControlsPanelProps> = ({ config, onChange }) => {
  const isGradient = config.bgType === 'linear' || config.bgType === 'radial';

  return (
    <div className="space-y-6">
      {/* Detail Level */}
      <Section label="Detail">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(DETAIL_GRID) as [DetailLevel, { cols: number; label: string }][]).map(
            ([key, { label }]) => (
              <button
                key={key}
                onClick={() => onChange({ detail: key })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  config.detail === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </Section>

      {/* Character Style */}
      <Section label="Character Style">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['simple', 'dense', 'blocks', 'binary', 'custom'] as CharacterStyle[]).map(
            (style) => (
              <button
                key={style}
                onClick={() => onChange({ characterStyle: style })}
                className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition ${
                  config.characterStyle === style
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {style === 'custom' ? 'Custom' : style}
              </button>
            ),
          )}
        </div>
        {config.characterStyle === 'custom' && (
          <input
            type="text"
            value={config.customChars}
            onChange={(e) => onChange({ customChars: e.target.value })}
            placeholder="Enter characters, dark→light (e.g. @%#*+=-:. )"
            className="w-full mt-2 px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-neutral-200 placeholder-neutral-500"
          />
        )}
        {config.characterStyle !== 'custom' && (
          <p className="text-neutral-500 text-xs mt-1 font-mono tracking-wider select-all">
            {CHAR_RAMPS[config.characterStyle]}
          </p>
        )}
      </Section>

      {/* Colours */}
      <Section label="Text Colour">
        <ColorInput
          value={config.textColor}
          onChange={(v) => onChange({ textColor: v })}
        />
      </Section>

      {/* Background */}
      <Section label="Background">
        <div className="flex flex-wrap gap-2">
          {bgOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ bgType: opt.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                config.bgType === opt.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Colour 1</label>
            <ColorInput
              value={config.bgColor}
              onChange={(v) => onChange({ bgColor: v })}
            />
          </div>
          {isGradient && (
            <div>
              <label className="block text-xs text-neutral-500 mb-1">Colour 2</label>
              <ColorInput
                value={config.bgColor2}
                onChange={(v) => onChange({ bgColor2: v })}
              />
            </div>
          )}
        </div>

        {config.bgType === 'linear' && (
          <div className="mt-2">
            <label className="block text-xs text-neutral-500 mb-1">
              Angle: {config.gradientAngle}°
            </label>
            <input
              type="range"
              min={0}
              max={360}
              value={config.gradientAngle}
              onChange={(e) => onChange({ gradientAngle: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        )}
      </Section>

      {/* Adjustments */}
      <Section label="Adjustments">
        <Slider
          label={`Brightness: ${config.brightness > 0 ? '+' : ''}${config.brightness}`}
          value={config.brightness}
          min={-100}
          max={100}
          onChange={(v) => onChange({ brightness: v })}
        />
        <Slider
          label={`Contrast: ${config.contrast > 0 ? '+' : ''}${config.contrast}`}
          value={config.contrast}
          min={-100}
          max={100}
          onChange={(v) => onChange({ contrast: v })}
        />
        <Toggle
          label="Invert colours"
          value={config.invert}
          onChange={(v) => onChange({ invert: v })}
        />
      </Section>
    </div>
  );
};

/* ─── Sub-components ─── */

const Section: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
      {label}
    </h3>
    {children}
  </div>
);

const ColorInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({
  value,
  onChange,
}) => (
  <div className="flex items-center gap-2">
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-9 h-9 rounded-lg cursor-pointer border border-neutral-700 bg-transparent"
    />
    <span className="text-xs text-neutral-400 font-mono">{value}</span>
  </div>
);

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, onChange }) => (
  <div className="mb-3">
    <label className="block text-xs text-neutral-400 mb-1">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-blue-500"
    />
  </div>
);

const Toggle: React.FC<{
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, value, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <div
      onClick={() => onChange(!value)}
      className={`w-10 h-6 rounded-full transition-colors relative ${
        value ? 'bg-blue-600' : 'bg-neutral-700'
      }`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
          value ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
    <span className="text-sm text-neutral-300">{label}</span>
  </label>
);

export default ControlsPanel;
