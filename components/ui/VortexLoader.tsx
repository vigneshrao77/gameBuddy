import React from 'react';
import styles from './VortexLoader.module.css';

const RING_COUNT = 20;

/**
 * Generate per-ring CSS custom properties for size, depth, opacity, and timing.
 * Inner rings: brighter, smaller, closer to core.
 * Outer rings: larger, dimmer, more atmospheric.
 */
function getRingStyle(i: number): React.CSSProperties {
  const t = i / (RING_COUNT - 1); // 0 → 1 (inner → outer)

  // Size ramps from ~18% to ~95% of container
  const size = 18 + t * 77;

  // Z-depth: inner rings sit higher, outer rings lower
  const zBase = (1 - t) * 28 - 14; // roughly -14 to +14

  // Scale: inner slightly smaller perspective, outer slightly larger
  const scaleBase = 0.92 + t * 0.12;

  // Opacity: inner bright, outer dim
  const opacity = 0.95 - t * 0.55;

  // Staggered delay for wave effect
  const delay = i * 0.12;

  // Slightly varied duration for organic feel
  const duration = 4 + (i % 5) * 0.4;

  return {
    '--ring-size': `${size}%`,
    '--z-base': `${zBase}px`,
    '--scale-base': `${scaleBase}`,
    '--ring-opacity': `${opacity}`,
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
  } as React.CSSProperties;
}

function getRingClass(i: number): string {
  const t = i / (RING_COUNT - 1);
  if (t < 0.3) return styles.ringInner;
  if (t < 0.65) return styles.ringMid;
  return styles.ringOuter;
}

const rings = Array.from({ length: RING_COUNT }, (_, i) => i);

export default function VortexLoader() {
  return (
    <div className={styles.vortex} aria-label="Loading" role="status">
      <div className={styles.scene}>
        {rings.map((i) => (
          <div
            key={i}
            className={`${styles.ring} ${getRingClass(i)}`}
            style={getRingStyle(i)}
          />
        ))}
        <div className={styles.core} />
      </div>
    </div>
  );
}
