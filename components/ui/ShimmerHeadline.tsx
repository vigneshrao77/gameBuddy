"use client";

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { motion } from 'motion/react';
import { ShimmerText } from '@/components/ui/shimmer-text';

/** Seconds a single letter takes to fade and rise into place. */
const LETTER_DURATION = 0.5;

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

export interface ShimmerHeadlineProps {
  text: string;
  /** Seconds before the first letter lands. */
  delay?: number;
  /** Seconds between consecutive letters. */
  stagger?: number;
  /** Seconds before the shimmer sweep begins. */
  shimmerDelay?: number;
  shimmerDuration?: number;
  className?: string;
}

/**
 * Reveals a line letter by letter, then hands off to ShimmerText's sweep.
 *
 * The two stages can't simply overlap: ShimmerText paints its gradient on the
 * parent with background-clip:text, which ignores child opacity, so mid-reveal
 * letters would show anyway. During the reveal the parent is therefore blanked
 * and each letter fills itself.
 */
export function ShimmerHeadline({
  text,
  delay = 0.4,
  stagger = 0.035,
  shimmerDelay = 0.6,
  shimmerDuration = 1.8,
  className,
}: ShimmerHeadlineProps) {
  // Read as a store rather than set in an effect, so the reduced-motion case
  // resolves during render instead of triggering a cascading re-render.
  const prefersReduced = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
  const [revealDone, setRevealDone] = useState(false);
  const entered = prefersReduced || revealDone;

  // Split on spaces first so each word stays in one inline-block and the line
  // still breaks only between words.
  const words = useMemo(() => {
    let index = 0;
    return text.split(' ').map((word) => [...word].map((char) => ({ char, index: index++ })));
  }, [text]);

  useEffect(() => {
    if (prefersReduced) return;
    const total = delay + (text.length - 1) * stagger + LETTER_DURATION;
    const timer = setTimeout(() => setRevealDone(true), total * 1000);
    return () => clearTimeout(timer);
  }, [prefersReduced, delay, stagger, text.length]);

  const letters = words.map((word, wordIndex) => (
    <React.Fragment key={wordIndex}>
      <span className="landing-word">
        {word.map(({ char, index }) =>
          // A leftover transform makes background-clip:text skip the letter, so
          // the settled state has to be a plain span with no motion styles.
          entered ? (
            <span key={index} className="landing-letter">
              {char}
            </span>
          ) : (
            <motion.span
              key={index}
              className="landing-letter"
              initial={{ opacity: 0, y: '0.4em' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: LETTER_DURATION,
                delay: delay + index * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          )
        )}
      </span>
      {wordIndex < words.length - 1 ? ' ' : null}
    </React.Fragment>
  ));

  return (
    <div className={`shimmer-headline${entered ? ' is-entered' : ''}`}>
      <ShimmerText className={className} delay={shimmerDelay} duration={shimmerDuration}>
        {letters}
      </ShimmerText>
    </div>
  );
}

export default ShimmerHeadline;
