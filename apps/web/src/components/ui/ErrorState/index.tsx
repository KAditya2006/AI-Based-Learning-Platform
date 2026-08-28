import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while loading this data. Please try again.', 
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-error-bg border border-error-border rounded-lg m-4">
      <AlertCircle className="w-12 h-12 text-error-text mb-4" />
      <h3 className="text-lg font-semibold text-error-text mb-2">{title}</h3>
      <p className="text-sm text-error-text mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-white text-error-text border border-error-border rounded-md hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
