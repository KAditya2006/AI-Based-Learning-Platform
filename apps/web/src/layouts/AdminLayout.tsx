import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, Users, Target, BookOpen, UserPlus, Settings, LogOut, FileText, BrainCircuit, ListChecks, Network
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'AI Review Queue', path: '/admin/ai-review', icon: ListChecks },
    { label: 'Integration Center', path: '/admin/integrations', icon: Network },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-background)' }}>
      {/* Sidebar - Dark theme for Admin to distinguish from Learner */}
      <aside style={{ width: '250px', backgroundColor: 'var(--color-text-primary)', color: 'var(--color-text-inverse)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem' }}>MoSPI Admin</h2>
          <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>DIID Analytics</span>
        </div>
        <nav style={{ flex: 1, padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: 'white',
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: 'none'
                }}
              >
                <item.icon size={20} opacity={isActive ? 1 : 0.7} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)', fontWeight: 500, textAlign: 'left'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-8)' }}>
        <Outlet />
      </main>
    </div>
  );
};
