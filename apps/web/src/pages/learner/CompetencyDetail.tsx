import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { Competency } from '../../api/competencies';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

export const CompetencyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: competency, error, isLoading } = useSWR<Competency>(id ? `/competencies/${id}` : null, fetchClient);

  if (isLoading) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Spinner /></div>;
  if (error || !competency) return <div style={{ color: 'var(--color-error-text)' }}>Failed to load competency detail.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate('/competencies')} style={{ marginBottom: 'var(--space-4)' }}>
          &larr; Back to Library
        </Button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{competency.name}</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Domain: {competency.domain}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-secondary)' }}>{competency.description}</p>
        </CardContent>
      </Card>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 'var(--space-4)' }}>Proficiency Levels</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {competency.levels.map(level => (
          <Card key={level.level}>
            <CardContent style={{ padding: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              <div style={{ 
                background: 'var(--color-primary-100)', 
                color: 'var(--color-primary-700)',
                width: '2.5rem', height: '2.5rem', 
                borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {level.level}
              </div>
              <div>
                <p style={{ color: 'var(--color-text-primary)' }}>{level.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
