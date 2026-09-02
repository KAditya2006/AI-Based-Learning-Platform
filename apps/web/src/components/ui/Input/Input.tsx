import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ai?: boolean;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, ai, wrapperClassName, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (
      <div className={clsx('flex flex-col gap-1', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-on-surface-variant flex items-center pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full bg-surface-container-lowest border border-surface-variant rounded-lg py-2.5 font-body-md text-body-md text-on-surface outline-none transition-all duration-200 placeholder:text-surface-dim focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim',
              leftIcon ? 'pl-11' : 'pl-4',
              rightIcon ? 'pr-11' : 'pr-4',
              error && 'border-error focus:border-error focus:ring-error-container text-error',
              ai && 'border-accent-lavender focus:border-accent-violet focus:ring-accent-soft bg-accent-soft/10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-on-surface-variant flex items-center pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <span id={`${inputId}-error`} className="text-error font-caption text-caption mt-1" role="alert">
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${inputId}-helper`} className="text-on-surface-variant font-caption text-caption mt-1">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

