import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';

import type { WorkforceMember } from '../../api/admin';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';

export const LearnerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: member, error, isLoading } = useSWR<WorkforceMember>(id ? `/admin/users/${id}` : null, fetchClient);

  if (isLoading) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Spinner /></div>;
  if (error || !member) return <div style={{ color: 'var(--color-error-text)' }}>Failed to load learner detail.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/workforce')} style={{ marginBottom: 'var(--space-4)' }}>
          &larr; Back to Workforce
        </Button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{member.firstName} {member.lastName}</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{member.user?.email}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Department</span>
              <p style={{ fontWeight: 500 }}>{member.department?.name || 'Unassigned'}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Designation</span>
              <p style={{ fontWeight: 500 }}>{member.designation?.name || 'Unassigned'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competency Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Individual skill gap breakdown is available only to the learner or their direct supervisor via analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
