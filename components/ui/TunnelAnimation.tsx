import React from "react";

/* ============================================================
   3D PURPLE ENERGY VORTEX
   ------------------------------------------------------------
   Same animation concept:
   - 24 concentric rings
   - 3D perspective
   - purple neon tunnel
   - traveling wave
   - central energy core

   This is a visual animation, NOT a loading indicator.
============================================================ */

const RING_COUNT = 24;

const rings = Array.from({ length: RING_COUNT }, (_, i) => {
  const t = i / (RING_COUNT - 1);

  /*
    Ring size
    Inner → Outer
  */
  const size = 30 + t * 208;

  /*
    Inner rings are slightly thicker.
    Outer rings become thinner.
  */
  const thickness = 3.4 - t * 2.25;

  /*
    Purple → violet → soft magenta.
    Kept within a controlled purple palette.
  */
  const hue =
    t < 0.65
      ? 262 + t * 32
      : 283 + (t - 0.65) * 25;

  const saturation = 92 - t * 16;
  const lightness = 70 - t * 25;

  /*
    Inner rings = stronger.
    Outer rings = softer.
  */
  const baseOpacity = 0.96 - t * 0.56;
  const peakOpacity = Math.min(1, baseOpacity + 0.2);

  /*
    Glow hierarchy.
  */
  const glowAlpha = 0.68 - t * 0.43;
  const farGlowAlpha = glowAlpha * 0.28;

  /*
    Wave timing.
    Outer rings move slightly slower.
  */
  const delay = i * 0.115;
  const waveDuration = 5.8 + t * 2.8;

  /*
    Pulse is slightly slower than the wave.
  */
  const pulseDuration = 4.2 + t * 1.8;

  /*
    Depth.
    Inner rings have more depth movement.
  */
  const depth = 14 + (1 - t) * 34;

  /*
    Subtle scale change.
  */
  const scalePeak = 1 + (1 - t) * 0.055;

  /*
    Depth of field.
    Only the far outer rings receive blur.
  */
  const dofBlur =
    t > 0.58
      ? (t - 0.58) * 1.7
      : 0;

  /*
    Proportional vertical movement.
  */
  const bounceUp = 7 + t * 14;
  const bounceDown = 4 + t * 9;

  return {
    index: i,

    style: {
      "--size": `${size}px`,
      "--thickness": `${Math.max(1, thickness)}px`,

      "--color": `
        hsl(
          ${hue % 360},
          ${saturation}%,
          ${lightness}%
        )
      `,

      "--glow-color": `
        hsla(
          ${hue % 360},
          ${saturation}%,
          ${Math.min(lightness + 14, 95)}%,
          ${glowAlpha}
        )
      `,

      "--glow-far": `
        hsla(
          ${hue % 360},
          ${saturation}%,
          ${Math.min(lightness + 14, 95)}%,
          ${farGlowAlpha}
        )
      `,

      "--base-opacity": baseOpacity,
      "--peak-opacity": peakOpacity,

      "--delay": `${delay}s`,
      "--wave-duration": `${waveDuration}s`,
      "--pulse-duration": `${pulseDuration}s`,

      "--depth": `${depth}px`,
      "--scale-peak": scalePeak,

      "--dof-blur": `${dofBlur}px`,

      "--bounce-up": `${bounceUp}px`,
      "--bounce-down": `${bounceDown}px`,
    } as React.CSSProperties,
  };
});

export const TunnelAnimation = () => {
  return (
    <>
      <div className="tunnel-container">
        <div className="tunnel-loader">
          <div className="vortex-scene">

            {/* =================================================
                RINGS
            ================================================= */}

            {rings.map((ring) => (
              <div
                key={ring.index}
                className="tunnel-circle"
                style={ring.style}
              >
                <div className="tunnel-circle-glow" />
                <div className="tunnel-circle-highlight" />
              </div>
            ))}

            {/* =================================================
                CENTRAL ENERGY CORE
            ================================================= */}

            <div className="vortex-core">
              <div className="core-outer-glow" />
              <div className="core-halo" />
              <div className="core-hot" />
              <div className="core-specular" />
              <div className="core-center" />
            </div>

          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `

/* ============================================================
   CONTAINER
============================================================ */

.tunnel-container {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: visible;

  pointer-events: none;
}


/* ============================================================
   MAIN 3D SPACE
============================================================ */

.tunnel-loader {
  position: relative;

  width: 240px;
  height: 240px;

  display: flex;
  align-items: center;
  justify-content: center;

  perspective: 680px;

  transform-style: preserve-3d;
}


@media (min-width: 1024px) {

  .tunnel-loader {
    width: 280px;
    height: 280px;

    perspective: 760px;
  }

}


/* ============================================================
   VORTEX
============================================================ */

.vortex-scene {
  position: relative;

  width: 100%;
  height: 100%;

  transform-style: preserve-3d;

  transform:
    rotateX(68deg)
    rotateY(0deg)
    rotateZ(0deg);

  animation:
    vortex-breathe 8s
      cubic-bezier(.45, 0, .55, 1)
      infinite,

    vortex-wobble 13s
      cubic-bezier(.45, 0, .55, 1)
      infinite;

  will-change: transform;
}


/* ============================================================
   RING
============================================================ */

.tunnel-circle {
  position: absolute;

  top: 50%;
  left: 50%;

  width: var(--size);
  height: var(--size);

  margin-top: calc(var(--size) * -0.5);
  margin-left: calc(var(--size) * -0.5);

  border-radius: 50%;

  border:
    var(--thickness)
    solid
    var(--color);

  background: transparent;

  transform-style: preserve-3d;

  opacity: var(--base-opacity);

  filter:
    blur(var(--dof-blur))
    brightness(1);

  box-shadow:
    0 0 5px var(--glow-color),
    0 0 12px var(--glow-color),
    inset 0 0 5px var(--glow-color);

  animation:
    ring-wave
      var(--wave-duration)
      cubic-bezier(.37, 0, .63, 1)
      var(--delay)
      infinite,

    ring-light
      var(--pulse-duration)
      cubic-bezier(.45, 0, .55, 1)
      var(--delay)
      infinite;

  will-change:
    transform,
    opacity,
    filter;
}


/* ============================================================
   SOFT ATMOSPHERIC GLOW
============================================================ */

.tunnel-circle-glow {
  position: absolute;

  inset: -42%;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      var(--glow-color) 0%,
      var(--glow-far) 28%,
      transparent 68%
    );

  opacity: 0.36;

  filter: blur(11px);

  pointer-events: none;
}


/* ============================================================
   SMALL RING HIGHLIGHT
============================================================ */

.tunnel-circle-highlight {
  position: absolute;

  inset: 5%;

  border-radius: 50%;

  border:
    1px solid
    rgba(235, 215, 255, 0.14);

  opacity: 0.5;

  box-shadow:
    inset 0 0 8px
    rgba(220, 190, 255, 0.18);

  pointer-events: none;
}


/* ============================================================
   CENTRAL CORE
============================================================ */

.vortex-core {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 24px;
  height: 24px;

  margin:
    -12px
    0
    0
    -12px;

  transform-style: preserve-3d;

  z-index: 50;
}


/* ============================================================
   OUTER CORE GLOW
============================================================ */

.core-outer-glow {
  position: absolute;

  inset: -34px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(168, 105, 255, 0.25),
      rgba(119, 55, 230, 0.1) 42%,
      transparent 72%
    );

  filter: blur(9px);

  animation:
    core-atmosphere 5s
    ease-in-out
    infinite;
}


/* ============================================================
   CORE HALO
============================================================ */

.core-halo {
  position: absolute;

  inset: -15px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(215, 190, 255, 0.28) 0%,
      rgba(142, 87, 245, 0.14) 35%,
      transparent 72%
    );

  filter: blur(4px);

  animation:
    core-halo-pulse
    4.5s
    cubic-bezier(.45, 0, .55, 1)
    infinite;
}


/* ============================================================
   CORE HOT CENTER
============================================================ */

.core-hot {
  position: absolute;

  inset: 0;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 38% 34%,
      #ffffff 0%,
      #f1eaff 18%,
      #d0bcff 38%,
      #9d72ff 62%,
      #6e3ce5 82%,
      transparent 100%
    );

  box-shadow:
    0 0 8px rgba(255, 245, 255, 0.9),
    0 0 18px rgba(190, 145, 255, 0.85),
    0 0 38px rgba(128, 65, 235, 0.65),
    0 0 70px rgba(94, 44, 210, 0.35);

  animation:
    core-pulse
    3.8s
    cubic-bezier(.45, 0, .55, 1)
    infinite;
}


/* ============================================================
   SPECULAR LIGHT
============================================================ */

.core-specular {
  position: absolute;

  inset: -2px;

  border-radius: 50%;

  background:
    conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(255,255,255,.85) 14deg,
      transparent 42deg,
      transparent 360deg
    );

  mix-blend-mode: screen;

  opacity: 0.7;

  animation:
    core-spin
    3.8s
    linear
    infinite;
}


/* ============================================================
   CENTER POINT
============================================================ */

.core-center {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 5px;
  height: 5px;

  transform:
    translate(-50%, -50%);

  border-radius: 50%;

  background: #ffffff;

  box-shadow:
    0 0 5px #ffffff,
    0 0 12px #d7baff,
    0 0 20px #9c65ff;
}


/* ============================================================
   VORTEX BREATHING
============================================================ */

@keyframes vortex-breathe {

  0%,
  100% {
    transform:
      rotateX(68deg)
      rotateY(0deg)
      scale(1);
  }

  50% {
    transform:
      rotateX(69.5deg)
      rotateY(1deg)
      scale(1.035);
  }

}


/* ============================================================
   VERY SLOW 3D WOBBLE
============================================================ */

@keyframes vortex-wobble {

  0%,
  100% {
    transform:
      rotateX(68deg)
      rotateY(-0.5deg)
      rotateZ(-0.4deg);
  }

  50% {
    transform:
      rotateX(70deg)
      rotateY(1.5deg)
      rotateZ(0.4deg);
  }

}


/* ============================================================
   RING TRAVELING WAVE
============================================================ */

@keyframes ring-wave {

  0%,
  100% {

    transform:
      translateZ(0)
      translateY(0)
      scale(1);

    opacity:
      var(--base-opacity);
  }


  28% {

    transform:
      translateZ(var(--depth))
      translateY(
        calc(var(--bounce-up) * -1)
      )
      scale(var(--scale-peak));

    opacity:
      var(--peak-opacity);
  }


  42% {

    transform:
      translateZ(
        calc(var(--depth) * 0.7)
      )
      translateY(
        calc(var(--bounce-up) * -0.6)
      )
      scale(
        calc(var(--scale-peak) * 0.99)
      );

  }


  67% {

    transform:
      translateZ(
        calc(var(--depth) * -0.38)
      )
      translateY(var(--bounce-down))
      scale(0.975);

    opacity:
      calc(var(--base-opacity) * 0.72);
  }

}


/* ============================================================
   RING LIGHT / GLOW
============================================================ */

@keyframes ring-light {

  0%,
  100% {

    filter:
      brightness(1)
      blur(var(--dof-blur));

    box-shadow:
      0 0 5px var(--glow-color),
      0 0 12px var(--glow-color),
      inset 0 0 5px var(--glow-color);
  }


  30% {

    filter:
      brightness(1.28)
      blur(var(--dof-blur));

    box-shadow:
      0 0 8px var(--glow-color),
      0 0 18px var(--glow-color),
      0 0 34px var(--glow-far),
      inset 0 0 9px var(--glow-color);
  }


  52% {

    filter:
      brightness(1.08)
      blur(var(--dof-blur));
  }

}


/* ============================================================
   CORE ANIMATION
============================================================ */

@keyframes core-pulse {

  0%,
  100% {
    transform: scale(0.92);
  }

  50% {
    transform: scale(1.16);
  }

}


@keyframes core-spin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}


@keyframes core-atmosphere {

  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.95);
  }

  50% {
    opacity: 0.9;
    transform: scale(1.18);
  }

}


@keyframes core-halo-pulse {

  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.9);
  }

  50% {
    opacity: 0.95;
    transform: scale(1.25);
  }

}


/* ============================================================
   ACCESSIBILITY
============================================================ */

@media (prefers-reduced-motion: reduce) {

  .vortex-scene,
  .tunnel-circle,
  .core-hot,
  .core-specular,
  .core-halo,
  .core-outer-glow {

    animation: none !important;
  }

}

          `,
        }}
      />
    </>
  );
};
