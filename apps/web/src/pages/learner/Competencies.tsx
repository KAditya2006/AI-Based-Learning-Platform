import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { Competency } from '../../api/competencies';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';

import { Skeleton } from '../../components/ui/Skeleton';

export const Competencies = () => {
  const navigate = useNavigate();
  const { data: competencies, error, isLoading } = useSWR<Competency[]>('/competencies', fetchClient);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="w-1/3 h-8 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="w-full h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-danger-500 p-4 bg-danger-50 border border-danger-200 rounded">Failed to load competencies.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Competency Library</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Explore the organizational competency framework.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {competencies?.map(comp => (
          <Card 
            key={comp._id} 
            style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--color-border)' }}
            onClick={() => navigate(`/competencies/${comp._id}`)}
          >
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <CardTitle>{comp.name}</CardTitle>
                <Badge variant={comp.isActive ? 'primary' : 'neutral'}>
                  {comp.isActive ? 'Active' : 'Draft'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                {comp.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>Domain: {comp.domain}</span>
                <span>Levels: {comp.levels.length}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {competencies?.length === 0 && (
        <Card><CardContent style={{ textAlign: 'center', padding: 'var(--space-6)' }}>No competencies found in the framework.</CardContent></Card>
      )}
    </div>
  );
};
