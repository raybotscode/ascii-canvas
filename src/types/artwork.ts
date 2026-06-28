export type DetailLevel = 'low' | 'medium' | 'high' | 'ultra';

export type CharacterStyle = 'simple' | 'dense' | 'blocks' | 'binary' | 'custom';

export type BackgroundType = 'solid' | 'linear' | 'radial' | 'rainbow' | 'darkPoster' | 'creamPaper';

export interface AsciiConfig {
  detail: DetailLevel;
  characterStyle: CharacterStyle;
  customChars: string;
  textColor: string;
  bgColor: string;
  bgColor2: string;
  bgType: BackgroundType;
  gradientAngle: number;
  brightness: number;
  contrast: number;
  invert: boolean;
}

export interface AsciiArtData {
  lines: string[];
  cols: number;
  rows: number;
}

export interface PresetDefinition {
  name: string;
  label: string;
  config: Partial<AsciiConfig>;
}
