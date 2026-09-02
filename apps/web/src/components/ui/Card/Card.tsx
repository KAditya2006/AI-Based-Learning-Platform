import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'grounded' | 'elevated' | 'ai';
  interactive?: boolean;
}

export const Card = ({ className, variant = 'grounded', interactive, children, ...props }: CardProps) => (
  <div
    className={clsx(
      (variant === 'grounded' || variant === 'elevated') && 'card-grounded',
      variant === 'ai' && 'card-grounded border-primary/30',
      variant === 'default' && 'bg-surface border border-surface-variant rounded-md shadow-sm',
      interactive && 'hover:-translate-y-1 hover:shadow-md cursor-pointer transition-all duration-200',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
}

export const CardHeader = ({ className, compact, children, ...props }: CardHeaderProps) => (
  <div className={clsx('flex flex-col gap-1', compact ? 'p-3' : 'p-6', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={clsx('text-headline-sm font-semibold tracking-tight text-on-surface', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx('text-body-md text-on-surface-variant', className)} {...props}>
    {children}
  </p>
);

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  compact?: boolean;
  flush?: boolean;
}

export const CardContent = ({ className, compact, flush, children, ...props }: CardContentProps) => (
  <div className={clsx(flush ? 'p-0' : compact ? 'p-3 pt-0' : 'p-6 pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('flex items-center', className)} {...props}>
    {children}
  </div>
);
