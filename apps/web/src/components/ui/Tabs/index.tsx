import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onChange,
  variant = 'line',
}) => {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id);
  const active = controlledTab ?? internalActive;

  const handleChange = (id: string) => {
    setInternalActive(id);
    onChange?.(id);
  };

  if (variant === 'pill') {
    return (
      <div style={{
        display: 'flex',
        gap: 'var(--sp-2)',
        padding: '4px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        width: 'fit-content',
      }} role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => handleChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              padding: 'var(--sp-2) var(--sp-4)',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              transition: 'all var(--duration-fast) var(--ease-out)',
              background: active === tab.id
                ? 'linear-gradient(135deg, var(--primary-600), var(--primary-500))'
                : 'transparent',
              color: active === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: active === tab.id ? '0 2px 8px var(--ai-glow-subtle)' : 'none',
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span style={{
                background: active === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)',
                color: active === tab.id ? 'white' : 'var(--text-muted)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: 'var(--radius-full)',
                minWidth: '20px',
                textAlign: 'center',
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Line variant (default)
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--border)',
      gap: '0',
    }} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => handleChange(tab.id)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            padding: 'var(--sp-3) var(--sp-4)',
            borderBottom: `2px solid ${active === tab.id ? 'var(--primary-500)' : 'transparent'}`,
            marginBottom: '-1px',
            border: 'none',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: active === tab.id ? 'var(--primary-500)' : 'transparent',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: active === tab.id ? 600 : 500,
            background: 'transparent',
            color: active === tab.id ? 'var(--primary-400)' : 'var(--text-muted)',
            transition: 'all var(--duration-fast) var(--ease-out)',
            whiteSpace: 'nowrap',
          }}
          onMouseOver={e => {
            if (active !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
          onMouseOut={e => {
            if (active !== tab.id) (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span style={{
              background: active === tab.id ? 'var(--ai-glow-subtle)' : 'var(--bg-elevated)',
              color: active === tab.id ? 'var(--accent-lavender)' : 'var(--text-muted)',
              border: `1px solid ${active === tab.id ? 'var(--border-primary)' : 'var(--border)'}`,
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
            }}>{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
};
