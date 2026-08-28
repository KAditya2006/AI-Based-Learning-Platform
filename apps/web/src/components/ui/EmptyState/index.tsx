import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = 'No Data Found', 
  message = 'There is currently no data available to display here.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface border border-border rounded-lg m-4">
      <FileQuestion className="w-12 h-12 text-text-muted mb-4 opacity-50" />
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-4 max-w-md">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
