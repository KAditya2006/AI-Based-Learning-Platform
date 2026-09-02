import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this data. Please try again.',
  onRetry,
  compact = false,
}) => {
  // Sanitize message — never expose stack traces or internals
  const safeMessage =
    typeof message === 'string' && message.length < 200 && !message.includes('stack') && !message.includes('at ')
      ? message
      : 'An unexpected error occurred. Please try again or contact support if the issue persists.';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: compact ? 'var(--sp-6) var(--sp-4)' : 'var(--sp-10) var(--sp-8)',
      gap: 'var(--sp-4)',
      background: 'var(--error-bg)',
      border: '1px solid var(--error-border)',
      borderRadius: 'var(--radius-xl)',
      width: '100%',
    }}>
      <div style={{
        width: compact ? '36px' : '48px',
        height: compact ? '36px' : '48px',
        borderRadius: 'var(--radius-xl)',
        background: 'rgba(244, 63, 94, 0.15)',
        border: '1px solid var(--error-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--error-text)',
      }}>
        <AlertTriangle size={compact ? 16 : 22} />
      </div>
      <div>
        <h3 style={{
          fontSize: compact ? 'var(--text-base)' : 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--error-text)',
          margin: 0,
          marginBottom: 'var(--sp-2)',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'rgba(253, 164, 175, 0.8)',
          lineHeight: 1.6,
          maxWidth: '380px',
          margin: '0 auto',
        }}>
          {safeMessage}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            padding: 'var(--sp-2) var(--sp-4)',
            background: 'rgba(244, 63, 94, 0.12)',
            color: 'var(--error-text)',
            border: '1px solid var(--error-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            transition: 'all var(--duration-fast)',
          }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244, 63, 94, 0.20)';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244, 63, 94, 0.12)';
          }}
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      )}
    </div>
  );
};
