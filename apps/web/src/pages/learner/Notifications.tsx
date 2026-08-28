import { Card, CardContent } from '../../components/ui/Card';
import { Bell, CheckCircle } from 'lucide-react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { Button } from '../../components/ui/Button';

export const Notifications = () => {
  const { data, mutate, isLoading } = useSWR('/notifications', fetchClient);

  const notifications = (data as any)?.data?.notifications || [];

  const handleMarkAsRead = async (id: string) => {
    await fetchClient(`/notifications/${id}/read`, { method: 'PATCH' });
    mutate();
  };

  const handleMarkAllAsRead = async () => {
    await fetchClient('/notifications/read-all', { method: 'POST' });
    mutate();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Bell style={{ color: 'var(--color-primary-600)' }} size={24} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Notifications</h1>
        </div>
        {notifications.some((n: any) => !n.isRead) && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {notifications.length === 0 ? (
          <Card style={{ backgroundColor: 'var(--color-background)' }}>
            <CardContent style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              You have no new notifications.
            </CardContent>
          </Card>
        ) : (
          notifications.map((n: any) => (
            <Card key={n._id} style={{ backgroundColor: n.isRead ? 'var(--color-background)' : 'white' }}>
              <CardContent style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{n.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>{n.message}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '8px' }}>
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!n.isRead && (
                  <Button variant="outline" onClick={() => handleMarkAsRead(n._id)} aria-label="Mark as read">
                    <CheckCircle size={20} style={{ color: 'var(--color-success-600)' }} />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
