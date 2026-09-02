import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Bell, Settings, User as UserIcon, BookOpen, Target, TrendingUp, Home, Compass, Route as RouteIcon, HelpCircle } from 'lucide-react';

export const LearnerLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-md text-on-surface-variant">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'LEARNER') {
    return <Navigate to="/login" replace />;
  }

  const userInitial = (user.email || 'L')[0].toUpperCase();

  const navLinks = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Competencies', path: '/competencies', icon: Target },
    { label: 'Skill Gaps', path: '/skill-gaps', icon: Target },
    { label: 'Learning Path', path: '/learning-path', icon: RouteIcon },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body-lg text-on-background bg-background">
      {/* Top Navigation Bar */}
      <header className="w-full sticky top-0 h-14 bg-surface border-b border-outline-variant z-50 flex justify-between items-center px-lg max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-xl">
          <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight cursor-pointer" onClick={() => navigate('/dashboard')}>
            SkillIntel
          </h1>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-md lg:gap-lg h-14">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-sm transition-colors duration-200 h-14 font-medium text-sm ${
                    isActive 
                      ? 'text-primary font-semibold border-b-2 border-primary' 
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-md">
          <button 
            onClick={() => navigate('/notifications')}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 p-sm rounded-full hover:bg-surface-container-low"
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:opacity-80 p-sm rounded-full hover:bg-surface-container-low"
            title="Settings"
          >
            <Settings size={20} />
          </button>
          
          <div className="relative group">
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-sm text-primary font-body-md hover:bg-surface-container-low px-sm py-xs rounded transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                {userInitial}
              </div>
              <span className="hidden md:inline">Profile</span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-md shadow-lg hidden group-hover:block z-50">
               <div className="py-1">
                 <Link to="/profile" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">My Profile</Link>
                 <Link to="/profile/edit" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">Edit Profile</Link>
                 <Link to="/learning-history" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">Learning History</Link>
                 <Link to="/support" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low">Help &amp; Support</Link>
                 <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container">Sign out</button>
               </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-on-surface-variant p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 bg-surface z-40 border-t border-outline-variant flex flex-col p-4 gap-2 overflow-y-auto">
          {navLinks.map((link) => (
             <Link
               key={link.path}
               to={link.path}
               onClick={() => setMobileMenuOpen(false)}
               className="text-headline-sm text-on-surface p-3 border-b border-outline-variant/60 flex items-center gap-3"
             >
               <link.icon size={20} className="text-primary" />
               {link.label}
             </Link>
          ))}
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="text-headline-sm text-on-surface p-3 border-b border-outline-variant/60 flex items-center gap-3"
          >
            <UserIcon size={20} className="text-primary" />
            Official Profile
          </Link>
          <Link
            to="/support"
            onClick={() => setMobileMenuOpen(false)}
            className="text-headline-sm text-on-surface p-3 border-b border-outline-variant/60 flex items-center gap-3"
          >
            <HelpCircle size={20} className="text-primary" />
            Helpdesk Support
          </Link>
          <button onClick={logout} className="text-headline-sm text-error p-3 flex items-center gap-3 mt-auto">
            Sign out
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-xl">
        <div className="max-w-screen-2xl mx-auto px-lg mt-xl">
           <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl mt-auto bg-surface-container border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-lg max-w-screen-2xl mx-auto gap-md">
        <span className="font-label-caps text-label-caps text-on-surface-variant">© 2026 SkillIntel Official Statistical Platform. Ministry of Statistics &amp; Programme Implementation.</span>
        <div className="flex flex-wrap gap-md justify-center">
          <Link to="/support" className="font-caption text-caption text-on-surface-variant hover:underline hover:text-primary transition-colors">Support</Link>
          <Link to="/about" className="font-caption text-caption text-on-surface-variant hover:underline hover:text-primary transition-colors">About DIID</Link>
        </div>
      </footer>
    </div>
  );
};
