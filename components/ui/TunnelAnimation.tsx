import React from 'react';
import './TunnelAnimation.css';

/* ── Ring configuration ────────────────────────────────────────
   20 concentric rings, each with computed size, color, opacity,
   glow intensity, animation delay, and depth parameters.
   Everything is driven by CSS custom properties so the browser
   handles all animation on the compositor thread.              */

const RING_COUNT = 20;

const rings = Array.from({ length: RING_COUNT }, (_, i) => {
  const t = i / (RING_COUNT - 1); // 0 → 1, inner → outer

  // Size ramp: inner rings ~30px, outer rings ~220px
  const size = 30 + t * 190;

  // Border thickness: thicker inner, thinner outer
  const thickness = Math.max(1.2, 3.5 - t * 2.5);

  // Color: inner = bright lavender, outer = deep purple
  const hue = 268 + t * 8;          // 268 → 276
  const sat = 80 - t * 15;          // 80% → 65%
  const lit = 72 - t * 32;          // 72% → 40%

  // Opacity: inner rings brighter, outer rings atmospheric
  const baseOpacity = 0.9 - t * 0.5;
  const peakOpacity = Math.min(1, baseOpacity + 0.2);

  // Glow color with alpha for outer softness
  const glowAlpha = 0.6 - t * 0.35;
  const glowFarAlpha = glowAlpha * 0.4;

  // Animation timing — staggered delays for wave effect
  const delay = i * 0.15;
  const waveDuration = 5 + t * 3;   // inner faster, outer slower
  const pulseDuration = 4 + (1 - t) * 3; // offset from wave

  // Depth: how far rings travel in Z during wave
  const depth = 15 + (1 - t) * 25;
  const scalePeak = 1 + (1 - t) * 0.06;

  return {
    index: i,
    style: {
      '--size': size,
      '--thickness': `${thickness}px`,
      '--color': `hsl(${hue}, ${sat}%, ${lit}%)`,
      '--glow-color': `hsla(${hue}, ${sat}%, ${lit + 10}%, ${glowAlpha})`,
      '--glow-far': `hsla(${hue}, ${sat}%, ${lit + 10}%, ${glowFarAlpha})`,
      '--base-opacity': baseOpacity,
      '--peak-opacity': peakOpacity,
      '--delay': delay,
      '--wave-duration': `${waveDuration}s`,
      '--pulse-duration': `${pulseDuration}s`,
      '--depth': depth,
      '--scale-peak': scalePeak,
    } as React.CSSProperties,
  };
});

export const TunnelAnimation = () => {
  return (
    <div className="tunnel-container">
      <div className="tunnel-loader">
        <div className="vortex-scene">
          {rings.map((ring) => (
            <div
              key={ring.index}
              className="tunnel-circle"
              style={ring.style}
            />
          ))}
          <div className="vortex-core" />
        </div>
      </div>
    </div>
  );
};
