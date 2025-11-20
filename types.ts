
export interface LogoConfig {
  textMain: string;
  textSecondary: string;
  textTagline: string;
  colorMain: string;
  colorMainRest: string;
  colorSecondary: string;
  colorTagline: string;
  bgColor: string;
  fontFamily: string;
  letterSpacingMain: number;
  letterSpacingTagline: number;
  gapSize: number;
}

export enum DownloadFormat {
  SVG = 'SVG',
  PNG = 'PNG',
}
