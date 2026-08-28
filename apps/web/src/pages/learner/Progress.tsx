import { Card, CardContent } from '../../components/ui/Card';
import { Target } from 'lucide-react';


export const Progress = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Target style={{ color: 'var(--color-primary-600)' }} size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Learning Progress</h1>
        </div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Track your historical completion and assessment scores.</p>
      </div>

      <Card style={{ border: '1px dashed var(--color-border)', backgroundColor: 'var(--color-background)' }}>
        <CardContent style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Target style={{ color: 'var(--color-text-muted)' }} size={48} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Analytics Engine Not Yet Active
          </h3>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
            Historical progress tracking depends on the Assessment & Analytics engines. This view will populate once you complete learning paths and standardized assessments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
