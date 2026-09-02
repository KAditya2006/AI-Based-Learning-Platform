import useSWR from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { adminApi } from '../../api/admin';
import { Users } from 'lucide-react';

export const RoleIntelligence = () => {
  const { data, error, mutate } = useSWR('/admin/intelligence/roles', adminApi.getRoleIntelligence);

  if (error) {
    return <ErrorState title="Failed to load Role Intelligence" message={error.message} onRetry={() => mutate()} />;
  }

  if (!data) {
    return <div>Loading role intelligence...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>Role Intelligence</h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Analyze workforce distribution across roles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--sp-6)' }}>
        {data.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: 'var(--sp-8)', textAlign: 'center', background: 'var(--bg-elevated)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
            No role data available.
          </div>
        ) : (
          data.map((role: any, index: number) => (
            <Card key={`${role.name}-${index}`} variant="elevated">
              <CardHeader>
                <CardTitle>{role.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{role.workforceSize}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, margin: '2px 0 0 0' }}>Assigned Personnel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
