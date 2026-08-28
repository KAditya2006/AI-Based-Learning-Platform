import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '800px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <SettingsIcon style={{ color: 'var(--color-primary-600)' }} size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Account Settings</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Notification preferences will be available once the email delivery service is integrated.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Password reset and SSO configuration options will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
