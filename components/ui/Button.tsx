import React from 'react';
import { CyberButton, CyberButtonProps } from './CyberButton';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  if (variant === 'cyber') {
    return (
      <CyberButton className={className} {...props}>
        {children}
      </CyberButton>
    );
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export { CyberButton };
export type { CyberButtonProps };
