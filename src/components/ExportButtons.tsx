import React from 'react';
import type { AsciiArtData, AsciiConfig } from '../types/artwork';
import { downloadAsciiPNG, downloadAsciiTXT } from '../lib/export';

interface ExportButtonsProps {
  data: AsciiArtData | null;
  config: AsciiConfig;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ data, config }) => {
  if (!data) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.lines.join('\n'));
    } catch {
      // Fallback for mobile
      const ta = document.createElement('textarea');
      ta.value = data.lines.join('\n');
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
        Export
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => downloadAsciiPNG(data, config)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadAsciiTXT(data)}
          className="px-4 py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-sm font-medium transition"
        >
          Download TXT
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition border border-neutral-700"
        >
          Copy ASCII
        </button>
      </div>
    </div>
  );
};

export default ExportButtons;
