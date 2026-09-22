import React from 'react';

/* ── Ring configuration ────────────────────────────────────────
   24 concentric rings, each with computed size, color, opacity,
   glow intensity, animation delay, and depth parameters.
   Everything is driven by CSS custom properties.

   Key changes from the original:
   - Color now drifts across three hues (indigo → violet → cyan)
     instead of a single hue ramping in lightness, so the tunnel
     reads as an energy gradient rather than "purple, but dimmer."
   - Easing uses a custom cubic-bezier with slight overshoot
     instead of ease-in-out everywhere, so the wave feels like it's
     being pulled rather than mechanically tweened.
   - Glow is built from a blurred duplicate layer (real bloom) in
     addition to box-shadow, which is the difference between
     "circle with a shadow" and "circle that's actually glowing."
   - The core is now three layered pieces (hot center, rotating
     specular highlight, soft halo) so it reads as the light SOURCE
     the rings are being pulled toward, not just another ring.
   - Rings closer to the viewer blur slightly less than rings far
     away is reversed on purpose — the FAR rings get a touch of
     blur to simulate depth of field, which is what actually sells
     "tunnel" over "flat stacked circles."
──────────────────────────────────────────────────────────────── */

const RING_COUNT = 24;

const rings = Array.from({ length: RING_COUNT }, (_, i) => {
  const t = i / (RING_COUNT - 1); // 0 → 1, inner → outer

  const size = 26 + t * 210;
  const thickness = Math.max(1, 3.2 - t * 2.4);

  // Three-stop hue drift: hot indigo core → violet mid → cool cyan rim.
  // This is what makes the tunnel feel like it has depth-coded energy
  // rather than one hue just getting darker as it recedes.
  const hue = t < 0.5
    ? 255 + (t / 0.5) * 30      // 255 → 285 (indigo → violet)
    : 285 + ((t - 0.5) / 0.5) * 100; // 285 → 385 (violet → cyan, wraps past 360)
  const sat = 85 - t * 20;
  const lit = 68 - t * 30;

  const baseOpacity = 0.92 - t * 0.55;
  const peakOpacity = Math.min(1, baseOpacity + 0.25);

  const glowAlpha = 0.65 - t * 0.4;
  const glowFarAlpha = glowAlpha * 0.35;

  const delay = i * 0.13;
  const waveDuration = 5.5 + t * 3.5;
  const pulseDuration = 3.6 + (1 - t) * 3;

  const depth = 16 + (1 - t) * 28;
  const scalePeak = 1 + (1 - t) * 0.07;

  // Rings further from the eye pick up a touch of blur — cheap,
  // convincing depth-of-field cue that a flat opacity ramp can't fake.
  const dofBlur = t > 0.55 ? (t - 0.55) * 2.2 : 0;

  return {
    index: i,
    style: {
      '--size': size,
      '--thickness': `${thickness}px`,
      '--color': `hsl(${hue % 360}, ${sat}%, ${lit}%)`,
      '--glow-color': `hsla(${hue % 360}, ${sat}%, ${lit + 12}%, ${glowAlpha})`,
      '--glow-far': `hsla(${hue % 360}, ${sat}%, ${lit + 12}%, ${glowFarAlpha})`,
      '--base-opacity': baseOpacity,
      '--peak-opacity': peakOpacity,
      '--delay': delay,
      '--wave-duration': `${waveDuration}s`,
      '--pulse-duration': `${pulseDuration}s`,
      '--depth': depth,
      '--scale-peak': scalePeak,
      '--dof-blur': `${dofBlur}px`,
    },
  };
});

export const TunnelAnimation = () => {
  return (
    <>
      <div className="tunnel-container">
        <div className="tunnel-loader">
          <div className="vortex-scene">
            {rings.map((ring) => (
              <div key={ring.index} className="tunnel-circle" style={ring.style as React.CSSProperties}>
                <div className="tunnel-circle-bloom" />
              </div>
            ))}
            <div className="vortex-core">
              <div className="core-hot" />
              <div className="core-specular" />
              <div className="core-halo" />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tunnel-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          inset: 0;
          overflow: visible;
        }

        .tunnel-loader {
          height: 240px;
          width: 240px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          perspective: 620px;
        }

        @media (min-width: 1024px) {
          .tunnel-loader {
            height: 280px;
            width: 280px;
            perspective: 720px;
          }
        }

        .vortex-scene {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform: rotateX(68deg);
          animation:
            vortex-breathe 7s cubic-bezier(0.45, 0, 0.55, 1) infinite,
            vortex-wobble 11s ease-in-out infinite;
        }

        .tunnel-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          transform-style: preserve-3d;
          width: calc(var(--size) * 1px);
          height: calc(var(--size) * 1px);
          margin-top: calc(var(--size) * -0.5px);
          margin-left: calc(var(--size) * -0.5px);
          border: var(--thickness) solid transparent;
          border-color: var(--color);
          opacity: var(--base-opacity);
          filter: blur(var(--dof-blur));
          box-shadow:
            0 0 6px var(--glow-color),
            0 0 14px var(--glow-color),
            inset 0 0 6px var(--glow-color);
          animation:
            ring-wave var(--wave-duration) cubic-bezier(0.37, 0, 0.63, 1) calc(var(--delay) * 1s) infinite,
            ring-pulse var(--pulse-duration) ease-in-out calc(var(--delay) * 1s) infinite;
          will-change: transform, opacity;
        }

        /* Real bloom: a blurred, slightly larger copy of the ring sitting
           behind it. Box-shadow alone reads as "outline with a shadow";
           this reads as "glowing." */
        .tunnel-circle-bloom {
          position: absolute;
          inset: -40%;
          border-radius: 50%;
          border: calc(var(--thickness) * 2) solid var(--glow-color);
          filter: blur(8px);
          opacity: 0.55;
          pointer-events: none;
        }

        .vortex-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          z-index: 10;
        }

        .core-hot {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at 42% 38%,
            #ffffff 0%,
            #e7dcff 22%,
            #b79dfb 45%,
            #7c5cf0 70%,
            transparent 100%
          );
          box-shadow:
            0 0 14px rgba(184, 157, 251, 0.9),
            0 0 34px rgba(124, 92, 240, 0.55),
            0 0 68px rgba(94, 60, 220, 0.3);
          animation: core-pulse 3.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        /* A thin rotating arc of brightness across the core so it reads
           as a spinning point of light rather than a static glow blob. */
        .core-specular {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(255, 255, 255, 0.9) 12deg,
            transparent 45deg,
            transparent 360deg
          );
          mix-blend-mode: screen;
          animation: core-spin 2.6s linear infinite;
        }

        .core-halo {
          position: absolute;
          inset: -22px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(199, 178, 255, 0.18) 0%,
            rgba(139, 92, 246, 0.08) 45%,
            transparent 75%
          );
          animation: core-glow 5.5s ease-in-out infinite;
        }

        @keyframes vortex-rotate {
          0%   { rotate: z 0deg; }
          100% { rotate: z 360deg; }
        }

        @keyframes vortex-breathe {
          0%, 100% { scale: 1; }
          50%      { scale: 1.045; }
        }

        /* Subtle non-repeating-feeling tilt drift so the tunnel doesn't
           look like it's on a mechanical turntable. */
        @keyframes vortex-wobble {
          0%, 100% { transform: rotateX(68deg) rotateY(0deg); }
          50%      { transform: rotateX(70.5deg) rotateY(2deg); }
        }

        @keyframes ring-wave {
          0%, 100% {
            transform: translateZ(0px) scale(1);
            opacity: var(--base-opacity);
          }
          35% {
            transform: translateZ(calc(var(--depth) * 1px)) scale(var(--scale-peak));
            opacity: var(--peak-opacity);
          }
          65% {
            transform: translateZ(calc(var(--depth) * -0.5px)) scale(0.97);
            opacity: calc(var(--base-opacity) * 0.7);
          }
        }

        @keyframes ring-pulse {
          0%, 100% {
            filter: brightness(1) blur(var(--dof-blur));
            box-shadow:
              0 0 6px var(--glow-color),
              0 0 14px var(--glow-color),
              inset 0 0 6px var(--glow-color);
          }
          50% {
            filter: brightness(1.3) blur(var(--dof-blur));
            box-shadow:
              0 0 9px var(--glow-color),
              0 0 24px var(--glow-color),
              0 0 44px var(--glow-far),
              inset 0 0 11px var(--glow-color);
          }
        }

        @keyframes core-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.18); }
        }

        @keyframes core-spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes core-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.35); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vortex-scene, .tunnel-circle, .core-hot, .core-specular, .core-halo {
            animation: none;
          }
        }
      `}} />
    </>
  );
};
