"use client";

import React from 'react';
import styles from './CyberCard.module.css';

export interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  innerClassName?: string;
}

export const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ children, className = '', innerClassName = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`${styles.card} ${className}`.trim()} {...props}>
        <div className={`${styles.card2} ${innerClassName}`.trim()}>
          {children}
        </div>
      </div>
    );
  }
);

CyberCard.displayName = 'CyberCard';
