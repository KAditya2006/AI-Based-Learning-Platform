
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const PublicLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      <header style={{ padding: 'var(--space-4) var(--space-8)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-800)' }}>MoSPI Skill Intelligence</h1>
      </header>
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8)' }}>
        <Outlet />
      </main>
    </div>
  );
};
