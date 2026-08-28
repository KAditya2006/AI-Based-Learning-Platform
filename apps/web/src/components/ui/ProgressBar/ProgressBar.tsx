import React from 'react';
import clsx from 'clsx';
import styles from './ProgressBar.module.css';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export const ProgressBar = ({ className, value, max = 100, ...props }: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx(styles.progressWrapper, className)} {...props}>
      <div className={styles.barContainer}>
        <div className={styles.bar} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
