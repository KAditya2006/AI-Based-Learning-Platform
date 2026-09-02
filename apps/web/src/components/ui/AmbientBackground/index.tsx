import React from 'react';

type AmbientMode = 'idle' | 'processing' | 'active' | 'off';

interface AmbientBackgroundProps {
  mode?: AmbientMode;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ mode = 'idle' }) => {
  if (mode === 'off') return null;

  return (
    <div className={`ambient-bg ${mode}`} aria-hidden="true">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
    </div>
  );
};
