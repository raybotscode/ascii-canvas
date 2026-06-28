import React from 'react';
import type { AsciiConfig } from '../types/artwork';
import { PRESETS } from '../lib/presets';

interface PresetsProps {
  onApply: (patch: Partial<AsciiConfig>) => void;
}

const Presets: React.FC<PresetsProps> = ({ onApply }) => {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
        Presets
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onApply(preset.config)}
            className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm text-neutral-300 transition border border-neutral-700 hover:border-neutral-600 text-left"
          >
            <span className="block text-xs font-medium">{preset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Presets;
