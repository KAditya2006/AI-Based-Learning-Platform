import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import styles from './Spinner.module.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'inverse';
}

export const Spinner = ({ className, size = 'md', variant = 'primary', ...props }: SpinnerProps) => {
  return (
    <div className={clsx(styles.spinner, styles[size], styles[variant], className)} {...props}>
      <Loader2 className={clsx(styles[size])} />
    </div>
  );
};
