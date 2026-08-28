
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Target, BookOpen, LogOut, User as UserIcon, TrendingUp, Bell, Settings } from 'lucide-react';

export const LearnerLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user || user.role !== 'LEARNER') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Competencies', path: '/competencies', icon: Target },
    { label: 'My Skill Gaps', path: '/skill-gaps', icon: Target },
    { label: 'Learning Path', path: '/learning-path', icon: BookOpen },
    { label: 'Explore Learning', path: '/explore', icon: BookOpen },
    { label: 'Recommendations', path: '/recommendations', icon: BookOpen },
    { label: 'AI Insights', path: '/insights', icon: Target },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
    { label: 'My Profile', path: '/profile', icon: UserIcon },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-background)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)' }}>
          <h2 style={{ fontWeight: 700, color: 'var(--color-primary-800)', fontSize: '1.125rem' }}>MoSPI Learner</h2>
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
                  backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                  color: isActive ? 'var(--color-primary-700)' : 'var(--color-text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)',
              width: '100%', background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-text-secondary)', fontWeight: 500, textAlign: 'left'
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
