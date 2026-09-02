import React from 'react';
import clsx from 'clsx';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  glow?: boolean;
  label?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({
  className,
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  glow = false,
  label,
  showLabel = false,
  ...props
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx(styles.progressWrapper, className)} {...props}>
      {(label || showLabel) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.labelText}>{label}</span>}
          {showLabel && <span className={styles.labelValue}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        className={clsx(
          styles.barContainer,
          styles[size],
          variant !== 'default' && styles[variant],
          glow && styles.glow
        )}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.bar} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
