import { Card, CardContent } from '../../components/ui/Card';
import { FileCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const RoleMapping = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>
          Role-Competency Mapping
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          Define required competency levels for organizational designations.
        </p>
      </div>

      <Card style={{ border: '2px dashed var(--border)', background: 'var(--bg-subtle)' }}>
        <CardContent style={{ padding: 'var(--sp-12)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-default)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            <FileCheck size={32} />
          </div>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Role Mapping Read-Only
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6, margin: 0 }}>
            The Role Mapping UI relies on the Role Management API which is slated for a future phase.
            Currently, required competencies are statically seeded via the backend configuration.
          </p>
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <Button variant="outline">View Static Mappings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
