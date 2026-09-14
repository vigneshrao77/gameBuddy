import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rolling' | 'spinner';
  size?: number;
}

export function Loading({ variant = 'rolling', className = '', size, ...props }: LoadingProps) {
  if (variant === 'spinner') {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`} {...props}>
        <Loader2 className="animate-spin text-[var(--violet)]" size={size || 24} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-3 ${className}`} {...props}>
      <div className="loader" style={size ? { fontSize: `${size}px` } : undefined} />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function RollingLoader({ className = '', size }: { className?: string; size?: number }) {
  return (
    <div className={`loader ${className}`.trim()} style={size ? { fontSize: `${size}px` } : undefined} />
  );
}
