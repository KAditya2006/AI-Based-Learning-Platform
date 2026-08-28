import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { SkillGap } from '../../api/skillGaps';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ErrorState } from '../../components/ui/ErrorState';

export const SkillGaps = () => {
  const navigate = useNavigate();
  const { data: gaps, error, isLoading, mutate } = useSWR<SkillGap[]>('/skill-gaps', fetchClient);

  if (isLoading) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Spinner /></div>;
  if (error) return <ErrorState title="Failed to load skill gaps" message={error.message || 'There was an issue fetching your skill gaps.'} onRetry={() => mutate()} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>My Skill Gaps</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Analyzed based on your current role requirements.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {gaps?.length === 0 && (
          <Card>
            <CardContent style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No skill gaps identified. You meet all requirements for your current role.
            </CardContent>
          </Card>
        )}
        
        {gaps?.map(gap => (
          <Card 
            key={gap._id} 
            style={{ cursor: 'pointer', border: '1px solid var(--color-border)' }}
            onClick={() => navigate(`/skill-gaps/${gap._id}`)}
          >
            <CardContent style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <h3 style={{ fontWeight: 600 }}>{gap.competency?.name || 'Unknown Competency'}</h3>
                  {gap.gapSize > 0 && <Badge variant="warning">Gap: {gap.gapSize} levels</Badge>}
                  {gap.gapSize <= 0 && <Badge variant="success">Met</Badge>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 'var(--space-1)' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Current: Level {gap.currentLevel}</span>
                      <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Required: Level {gap.requiredLevel}</span>
                    </div>
                    <ProgressBar value={gap.currentLevel} max={5} />
                  </div>
                </div>
              </div>
              <div style={{ color: 'var(--color-text-muted)' }}>&rarr;</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
