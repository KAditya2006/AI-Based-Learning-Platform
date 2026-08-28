import useSWR from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { adminApi } from '../../api/admin';

export const RoleIntelligence = () => {
  const { data, error, mutate } = useSWR('/admin/intelligence/roles', adminApi.getRoleIntelligence);

  if (error) {
    return <ErrorState title="Failed to load Role Intelligence" message={error.message} onRetry={() => mutate()} />;
  }

  if (!data) {
    return <div>Loading role intelligence...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Role Intelligence</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Analyze workforce distribution across roles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {data.length === 0 ? (
          <Card style={{ gridColumn: '1 / -1' }}><CardContent><p style={{ padding: 'var(--space-4)' }}>No role data available.</p></CardContent></Card>
        ) : (
          data.map((role: any) => (
            <Card key={role.name}>
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{role.workforceSize}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Assigned Personnel</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
