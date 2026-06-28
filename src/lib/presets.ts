import type { PresetDefinition } from '../types/artwork';

export const PRESETS: PresetDefinition[] = [
  {
    name: 'classic-terminal',
    label: 'Classic Terminal',
    config: {
      textColor: '#00ff41',
      bgColor: '#0a0a0a',
      bgColor2: '#1a1a1a',
      bgType: 'solid',
      characterStyle: 'simple',
    },
  },
  {
    name: 'gallery-print',
    label: 'Gallery Print',
    config: {
      textColor: '#2c2c2c',
      bgColor: '#F5F0E8',
      bgColor2: '#E8DCC8',
      bgType: 'creamPaper',
      characterStyle: 'dense',
    },
  },
  {
    name: 'neon',
    label: 'Neon',
    config: {
      textColor: '#ffffff',
      bgColor: '#00d4ff',
      bgColor2: '#d500f9',
      bgType: 'linear',
      gradientAngle: 135,
      characterStyle: 'dense',
    },
  },
  {
    name: 'rainbow-poster',
    label: 'Rainbow Poster',
    config: {
      textColor: '#ffffff',
      bgColor: '#ff0040',
      bgColor2: '#d500f9',
      bgType: 'rainbow',
      characterStyle: 'dense',
    },
  },
  {
    name: 'blueprint',
    label: 'Blueprint',
    config: {
      textColor: '#64b5f6',
      bgColor: '#0d1b2a',
      bgColor2: '#1b2838',
      bgType: 'solid',
      characterStyle: 'simple',
    },
  },
  {
    name: 'midnight-sun',
    label: 'Midnight Sun',
    config: {
      textColor: '#ffb347',
      bgColor: '#0a0a2e',
      bgColor2: '#1a0a2e',
      bgType: 'radial',
      characterStyle: 'blocks',
    },
  },
  {
    name: 'clean-white',
    label: 'Clean White',
    config: {
      textColor: '#1a1a1a',
      bgColor: '#ffffff',
      bgColor2: '#f0f0f0',
      bgType: 'solid',
      characterStyle: 'dense',
    },
  },
  {
    name: 'cherry-blossom',
    label: 'Cherry Blossom',
    config: {
      textColor: '#ff6b9d',
      bgColor: '#2d1b2e',
      bgColor2: '#1a1a2e',
      bgType: 'linear',
      gradientAngle: 45,
      characterStyle: 'dense',
    },
  },
];
