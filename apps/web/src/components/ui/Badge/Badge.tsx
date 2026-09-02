import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'ai';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = ({ className, variant = 'neutral', size = 'md', dot, children, ...props }: BadgeProps) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        size !== 'md' && styles[size],
        dot && styles.withDot,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
