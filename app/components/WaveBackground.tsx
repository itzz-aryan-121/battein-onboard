'use client';

import React from 'react';

interface WaveBackgroundProps {
  height?: number;  // Base height in pixels that will scale responsively
}

/**
 * A reusable wave background component that implements the animated waves
 * from the home page with proper animations and responsive sizing
 */
export default function WaveBackground({ height = 300 }: WaveBackgroundProps) {
  // Calculate responsive height based on viewport width
  const getResponsiveHeight = () => {
    // We'll scale the height based on different breakpoints
    const baseHeight = height;
    
    // These values will be used with CSS calc() in the style
    return {
      xs: Math.max(Math.round(baseHeight * 0.6), 100), // Small mobile (minimum 100px)
      sm: Math.max(Math.round(baseHeight * 0.8), 120), // Large mobile
      md: baseHeight,                                   // Tablet and up (original size)
    };
  };
  
  const responsiveHeight = getResponsiveHeight();

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
      <div 
        className="relative sm:h-[var(--wave-height-sm)] md:h-[var(--wave-height-md)]"
        style={{ 
          height: `${responsiveHeight.xs}px`,
          // Responsive height using CSS custom properties
          ['--wave-height-sm' as any]: `${responsiveHeight.sm}px`,
          ['--wave-height-md' as any]: `${responsiveHeight.md}px`,
        }}
      >
        <div className="absolute bottom-0 w-full">
          <img
            src="/assets/wave-top.png"
            alt="Top Wave"
            className="object-bottom animate-waveMove w-full"
          />
        </div>
        <div className="absolute bottom-0 w-full">
          <img
            src="/assets/wave-middle.png"
            alt="Middle Wave"
            className="object-bottom animate-waveMove delay-200 w-full"
            style={{ animationDuration: '16s' }}
          />
        </div>
        <div className="absolute bottom-0 w-full">
          <img
            src="/assets/wave-bottom.png"
            alt="Bottom Wave"
            className="object-bottom animate-waveMove delay-400 w-full"
            style={{ animationDuration: '22s' }}
          />
        </div>
      </div>
    </div>
  );
}