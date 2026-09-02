import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, leftIcon, rightIcon, ...props }, ref) => {
    
    // Map variant to global class
    const variantClass = variant === 'primary' 
      ? 'btn-primary' 
      : (variant === 'secondary' || variant === 'outline') 
      ? 'btn-secondary' 
      : 'btn-ghost';
    
    return (
      <button
        ref={ref}
        className={clsx(
          variantClass,
          size === 'sm' && 'text-xs px-3 py-1',
          size === 'lg' && 'text-lg px-6 py-3',
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-current rounded-full animate-spin" aria-hidden="true" />
        ) : leftIcon ? (
          <span aria-hidden="true">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
