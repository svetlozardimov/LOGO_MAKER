
import React, { forwardRef } from 'react';
import { LogoConfig } from '../types';

interface LogoRendererProps {
  config: LogoConfig;
  width?: number;
  height?: number;
  className?: string;
}

export const LogoRenderer = forwardRef<SVGSVGElement, LogoRendererProps>(
  ({ config, width = 800, height = 400, className }, ref) => {
    const {
      textMain,
      textSecondary,
      textTagline,
      colorMain,
      colorMainRest,
      colorSecondary,
      colorTagline,
      bgColor,
      fontFamily,
      letterSpacingMain,
      letterSpacingTagline,
      gapSize,
    } = config;

    // Calculations for layout
    const viewBoxWidth = 400;
    const viewBoxHeight = 200;
    const centerX = viewBoxWidth / 2;
    const centerY = viewBoxHeight / 2;

    // Split main text for dual coloring
    const mainFirstChar = textMain.charAt(0);
    const mainRest = textMain.slice(1);

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        width={width}
        height={height}
        className={className}
        style={{ backgroundColor: bgColor }}
        aria-label={`${textMain} ${textSecondary} ${textTagline} Logo`}
      >
        {/* Background */}
        <rect width="100%" height="100%" fill={bgColor} />

        {/* Main Logo Group */}
        <g transform={`translate(${centerX}, ${centerY - 15})`}>
          <text
            x="0"
            y="0"
            fontFamily={fontFamily}
            fontWeight="900" // Extra bold
            fontSize="85"
            textAnchor="middle"
            dominantBaseline="middle"
            letterSpacing={`${letterSpacingMain}em`}
          >
            {/* The First Letter (e.g. D) */}
            <tspan fill={colorMain}>{mainFirstChar}</tspan>
            
            {/* The Rest (e.g. imo) */}
            <tspan fill={colorMainRest}>{mainRest}</tspan>
            
            {/* Spacing between Dimo and V controlled by gapSize dx */}
            <tspan dx={gapSize}> </tspan>

            {/* The V - Italicized */}
            <tspan 
              fill={colorSecondary} 
              fontStyle="italic"
            >{textSecondary}</tspan>
          </text>
        </g>

        {/* Tagline */}
        <text
          x={centerX}
          y={centerY + 45}
          fill={colorTagline}
          fontFamily={fontFamily}
          fontWeight="bold"
          fontSize="20"
          letterSpacing={`${letterSpacingTagline}em`}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {textTagline}
        </text>
      </svg>
    );
  }
);

LogoRenderer.displayName = 'LogoRenderer';
