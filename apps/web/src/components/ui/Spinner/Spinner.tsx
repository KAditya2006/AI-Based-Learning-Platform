import React from 'react';
import clsx from 'clsx';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'inverse' | 'muted';
  className?: string;
  label?: string;
}

export const Spinner = ({ size = 'md', variant = 'primary', className, label = 'Loading...' }: SpinnerProps) => {
  return (
    <span
      className={clsx(styles.spinner, styles[size], styles[variant], className)}
      role="status"
      aria-label={label}
    >
      <span className={styles.ring} aria-hidden="true" />
    </span>
  );
};
