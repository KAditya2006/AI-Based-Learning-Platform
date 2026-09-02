import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  message,
  action,
  compact = false,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: compact ? 'var(--sp-8) var(--sp-4)' : 'var(--sp-16) var(--sp-8)',
      gap: 'var(--sp-4)',
    }}>
      {Icon && (
        <div style={{
          width: compact ? '40px' : '56px',
          height: compact ? '40px' : '56px',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--ai-glow-subtle)',
          border: '1px solid var(--border-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-lavender)',
          marginBottom: 'var(--sp-2)',
        }}>
          <Icon size={compact ? 18 : 24} />
        </div>
      )}
      <div>
        <h3 style={{
          fontSize: compact ? 'var(--text-base)' : 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          marginBottom: 'var(--sp-2)',
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '360px',
          margin: '0 auto',
        }}>
          {message}
        </p>
      </div>
      {action && (
        <div style={{ marginTop: 'var(--sp-2)' }}>
          {action}
        </div>
      )}
    </div>
  );
};
