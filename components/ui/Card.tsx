import React from 'react';
import { CyberCard, CyberCardProps } from './CyberCard';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow';
}

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  if (variant === 'glow') {
    return (
      <CyberCard className={className} {...props}>
        {children}
      </CyberCard>
    );
  }

  return (
    <div className={`border rounded p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mb-2 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-bold ${className}`} {...props}>{children}</h3>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mt-4 ${className}`} {...props}>{children}</div>;
}

export { CyberCard };
export type { CyberCardProps };
