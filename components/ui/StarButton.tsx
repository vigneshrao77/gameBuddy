"use client";

import React from 'react';
import styles from './StarButton.module.css';

const STAR_PATH =
  'M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z';

const STAR_CLASSES = [
  styles.star1,
  styles.star2,
  styles.star3,
  styles.star4,
  styles.star5,
  styles.star6,
];

const Sparkles = () => (
  <>
    {STAR_CLASSES.map((star, i) => (
      <div key={i} className={`${styles.star} ${star}`} aria-hidden="true">
        <svg viewBox="0 0 784.11 815.53" xmlns="http://www.w3.org/2000/svg">
          <path d={STAR_PATH} />
        </svg>
      </div>
    ))}
  </>
);

export interface StarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Renders an anchor instead of a button. */
  href?: string;
}

export function StarButton({ href, children, className = '', ...props }: StarButtonProps) {
  const classes = `${styles.starButton} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
        <Sparkles />
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
      <Sparkles />
    </button>
  );
}

export default StarButton;
