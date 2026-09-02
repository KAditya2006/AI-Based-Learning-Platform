import React from 'react';
import clsx from 'clsx';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect';
}

export const Skeleton = ({ className, variant = 'rect', style, ...props }: SkeletonProps) => {
  return (
    <div
      className={clsx('skeleton', className)}
      style={{
        borderRadius: variant === 'circle' ? '50%' : variant === 'text' ? '4px' : undefined,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};
