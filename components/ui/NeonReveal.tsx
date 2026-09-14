"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './NeonReveal.module.css';

export interface NeonRevealProps {
  /** Milliseconds to wait before the sweep starts. */
  revealDelay?: number;
  /** Duration of the sweep in milliseconds. */
  revealDuration?: number;
  /** Position along the cross axis, 0 = bottom/left, 1 = top/right. */
  verticalOffset?: number;
  direction?: 'horizontal' | 'vertical';
  /** Hue in degrees (0-360). */
  color?: number;
  /** Length of the bar as a fraction of the container (0-1). */
  barWidth?: number;
  /** Thickness of the bar as a fraction of the container (0-1). */
  barHeight?: number;
  /** Render a second bar mirrored across the container. */
  mirrored?: boolean;
  expandFrom?: 'center' | 'left' | 'right';
  /** Overall glow strength multiplier. */
  intensity?: number;
  /** How far the glow spreads. */
  glowSpread?: number;
  /** Start the sweep when the element scrolls into view. */
  animateOnScroll?: boolean;
  scrollThreshold?: number;
  onStart?: () => void;
  onComplete?: () => void;
  className?: string;
  children?: React.ReactNode;
}

type BarVars = React.CSSProperties & Record<string, string | number>;

export function NeonReveal({
  revealDelay = 0,
  revealDuration = 2000,
  verticalOffset = 0.7,
  direction = 'horizontal',
  color = 200,
  barWidth = 1.0,
  barHeight = 0.02,
  mirrored = false,
  expandFrom = 'center',
  intensity = 1.0,
  glowSpread = 1.0,
  animateOnScroll = false,
  scrollThreshold = 0.3,
  onStart,
  onComplete,
  className = '',
  children,
}: NeonRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Trigger on mount, or when scrolled into view.
  useEffect(() => {
    const node = rootRef.current;
    if (!animateOnScroll) {
      const frame = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(frame);
    }
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: scrollThreshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [animateOnScroll, scrollThreshold]);

  // Fire lifecycle callbacks around the sweep.
  useEffect(() => {
    if (!revealed) return;
    const startTimer = setTimeout(() => onStart?.(), revealDelay);
    const doneTimer = setTimeout(() => onComplete?.(), revealDelay + revealDuration);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(doneTimer);
    };
  }, [revealed, revealDelay, revealDuration, onStart, onComplete]);

  const isHorizontal = direction === 'horizontal';

  // Where the bar sits on the cross axis. verticalOffset is measured from the
  // bottom (horizontal) or the left (vertical), matching the documented API.
  const crossPct = `${(1 - verticalOffset) * 100}%`;

  /** Anchors the bar so it grows from the requested edge or the centre. */
  const anchor = (flip: boolean): BarVars => {
    const from =
      flip && expandFrom !== 'center'
        ? expandFrom === 'left'
          ? 'right'
          : 'left'
        : expandFrom;

    if (isHorizontal) {
      const cross = flip ? `${verticalOffset * 100}%` : crossPct;
      if (from === 'center') {
        return { '--left': '50%', '--shift': 'translate(-50%, -50%)', top: cross };
      }
      if (from === 'left') {
        return { '--left': '0%', '--shift': 'translateY(-50%)', top: cross };
      }
      return { '--right': '0%', '--shift': 'translateY(-50%)', top: cross };
    }

    const cross = flip ? `${verticalOffset * 100}%` : crossPct;
    if (from === 'center') {
      return { '--top': '50%', '--shift': 'translate(-50%, -50%)', left: cross };
    }
    if (from === 'left') {
      return { '--top': '0%', '--shift': 'translateX(-50%)', left: cross };
    }
    return { '--bottom': '0%', '--shift': 'translateX(-50%)', left: cross };
  };

  // One soft ellipse per bar, so the grain never extends past the glow.
  // Multiple mask layers composite additively, giving their union.
  const maskAt = (pos: string) =>
    isHorizontal
      ? `radial-gradient(ellipse 58% 20% at 50% ${pos}, #000 15%, transparent 100%)`
      : `radial-gradient(ellipse 20% 58% at ${pos} 50%, #000 15%, transparent 100%)`;

  // Deduped, since a mirror at 0.5 lands on top of the original and would
  // otherwise stack two mask layers into visibly doubled grain.
  const grainMask = Array.from(
    new Set(mirrored ? [crossPct, `${verticalOffset * 100}%`] : [crossPct])
  )
    .map(maskAt)
    .join(', ');

  const rootVars: BarVars = {
    '--h': color,
    '--i': intensity,
    '--s': glowSpread,
    '--len': `${barWidth * 100}%`,
    '--t': `${barHeight * 100}%`,
    '--dur': `${revealDuration}ms`,
    '--delay': `${revealDelay}ms`,
    '--grain-mask': grainMask,
  };

  const classes = [
    styles.root,
    isHorizontal ? styles.horizontal : styles.vertical,
    revealed ? styles.revealed : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={rootRef} className={classes} style={rootVars}>
      <div className={styles.stage} aria-hidden="true">
        <div className={styles.bloom} style={anchor(false)} />
        <div className={styles.bar} style={anchor(false)} />
        {mirrored && (
          <>
            <div className={styles.bloom} style={anchor(true)} />
            <div className={styles.bar} style={anchor(true)} />
          </>
        )}
        <div className={styles.grain} />
      </div>
      {children != null && <div className={styles.content}>{children}</div>}
    </div>
  );
}

export default NeonReveal;
