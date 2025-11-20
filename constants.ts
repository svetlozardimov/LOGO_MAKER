
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
  // Modern / Geometric
  { label: 'Montserrat (Modern Geometric)', value: '"Montserrat", sans-serif' },
  { label: 'Poppins (Friendly Geometric)', value: '"Poppins", sans-serif' },
  { label: 'Nunito (Rounded)', value: '"Nunito", sans-serif' },
  { label: 'Righteous (Modern Display)', value: '"Righteous", cursive' },

  // Industrial / Strong
  { label: 'Bebas Neue (Tall & Condensed)', value: '"Bebas Neue", sans-serif' },
  { label: 'Oswald (Industrial Bold)', value: '"Oswald", sans-serif' },
  { label: 'Teko (Square/Boxy)', value: '"Teko", sans-serif' },
  { label: 'Alfa Slab One (Heavy Impact)', value: '"Alfa Slab One", cursive' },
  { label: 'Exo 2 (Tech/Futuristic)', value: '"Exo 2", sans-serif' },
  { label: 'Orbitron (Sci-Fi)', value: '"Orbitron", sans-serif' },
  
  // Classic / Serif
  { label: 'Playfair Display (Elegant)', value: '"Playfair Display", serif' },
  { label: 'Lora (Calligraphic Serif)', value: '"Lora", serif' },
  { label: 'Roboto Slab (Sturdy Serif)', value: '"Roboto Slab", serif' },
  { label: 'Cinzel (Classic Roman)', value: '"Cinzel", serif' },
  
  // Clean / Neutral
  { label: 'Lato (Clean & Friendly)', value: '"Lato", sans-serif' },
  { label: 'Raleway (Sophisticated)', value: '"Raleway", sans-serif' },
  
  // System Fallbacks
  { label: 'Arial (Standard)', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana (Readable)', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Impact (Heavy)', value: 'Impact, Charcoal, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New (Monospace)', value: '"Courier New", Courier, monospace' },
];

export const GEMINI_MODEL_NAME = "gemini-2.5-flash";