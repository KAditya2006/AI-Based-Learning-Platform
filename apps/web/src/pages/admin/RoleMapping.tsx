import { Card, CardContent } from '../../components/ui/Card';
import { FileCheck } from 'lucide-react';

export const RoleMapping = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <FileCheck style={{ color: 'var(--color-primary-600)' }} size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Role-Competency Mapping</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Define required competency levels for organizational designations.</p>
      </div>

      <Card style={{ border: '1px dashed var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <CardContent style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <FileCheck style={{ color: 'var(--color-text-muted)' }} size={48} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Role Mapping Read-Only
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
            The Role Mapping UI relies on the Role Management API which is slated for a future phase.
            Currently, required competencies are statically seeded via the backend.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
