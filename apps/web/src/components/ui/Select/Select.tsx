import React from 'react';
import clsx from 'clsx';
import styles from './Select.module.css';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className={clsx(styles.selectWrapper, className)}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          ref={ref}
          className={clsx(styles.select, { [styles.hasError]: !!error })}
          {...props}
        >
          <option value="" disabled>Select an option...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
