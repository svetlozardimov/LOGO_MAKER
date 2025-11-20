
import { LogoConfig } from './types';

export const DEFAULT_LOGO_CONFIG: LogoConfig = {
  textMain: "Dimo",
  textSecondary: "V",
  textTagline: "CONSTRUCTION",
  colorMain: "#DC2626", // Red for 'D'
  colorMainRest: "#FFFFFF", // White for 'imo'
  colorSecondary: "#DC2626", // Red for 'V'
  colorTagline: "#FFFFFF", // White for Tagline
  bgColor: "#000000",
  fontFamily: "Arial, Helvetica, sans-serif",
  letterSpacingMain: 0,
  letterSpacingTagline: 0.35, // Wide spacing for tagline
  gapSize: 20, // Space between Dimo and V
};

export const FONT_OPTIONS = [
  { label: 'Arial (Standard)', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana (Clean)', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Georgia (Serif)', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New (Tech)', value: '"Courier New", Courier, monospace' },
  { label: 'Impact (Bold)', value: 'Impact, Charcoal, sans-serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif' },
];

export const GEMINI_MODEL_NAME = "gemini-2.5-flash";
