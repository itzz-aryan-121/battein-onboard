'use client';

import React from 'react';

interface WaveBackgroundProps {
  height?: number;  // Height in pixels
}

/**
 * A reusable wave background component that implements the animated waves
 * from the home page with proper animations
 */
export default function WaveBackground({ height = 300 }: WaveBackgroundProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 w-full">
      <div className="relative" style={{ height: `${height}px` }}>
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