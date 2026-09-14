"use client";

import React from 'react';
import styles from './CyberButton.module.css';

export interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
  /** Render as a span when nested inside a link, where a button is invalid HTML. */
  as?: 'button' | 'span';
}

export const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ children = 'P L A Y', className = '', size = 'md', as = 'button', ...props }, ref) => {
    const classes = [styles.cyberButton, size === 'sm' && styles.small, className]
      .filter(Boolean)
      .join(' ');

    const decoration = (
      <>
        <span className={styles.label}>{children}</span>
        <div className={styles.clip}>
          <div className={`${styles.corner} ${styles.leftTop}`} />
          <div className={`${styles.corner} ${styles.rightBottom}`} />
          <div className={`${styles.corner} ${styles.rightTop}`} />
          <div className={`${styles.corner} ${styles.leftBottom}`} />
        </div>
        <span className={`${styles.arrow} ${styles.rightArrow}`} />
        <span className={`${styles.arrow} ${styles.leftArrow}`} />
      </>
    );

    if (as === 'span') {
      return <span className={classes}>{decoration}</span>;
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {decoration}
      </button>
    );
  }
);

CyberButton.displayName = 'CyberButton';
