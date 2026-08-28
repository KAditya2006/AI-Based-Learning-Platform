import useSWR from 'swr';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { adminApi } from '../../api/admin';

export const DepartmentIntelligence = () => {
  const { data, error, mutate } = useSWR('/admin/intelligence/departments', adminApi.getDepartmentIntelligence);

  if (error) {
    return <ErrorState title="Failed to load Department Intelligence" message={error.message} onRetry={() => mutate()} />;
  }

  if (!data) {
    return <div>Loading department intelligence...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Department Intelligence</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Analyze workforce distribution and competency across departments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
        {data.length === 0 ? (
          <Card><CardContent><p style={{ padding: 'var(--space-4)' }}>No department data available.</p></CardContent></Card>
        ) : (
          data.map((dept: any) => (
            <Card key={dept.name}>
              <CardHeader>
                <CardTitle>{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
                  <div>
                    <h3 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{dept.workforceSize}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Personnel</p>
                  </div>
                  {/* Future: Add average maturity score here if needed */}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
