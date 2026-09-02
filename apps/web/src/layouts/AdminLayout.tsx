import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Users, Target, BookOpen, LogOut, Settings, Network,
  BrainCircuit, ListChecks, Building2, Briefcase, BarChart3,
  Upload, FileText, ClipboardList, Thermometer, Menu, Shield,
  Search, Bell, X, FileBarChart, History
} from 'lucide-react';

const adminNavSections = [
  {
    label: 'Intelligence',
    items: [
      { label: 'Intelligence Hub', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Department Intel', path: '/admin/departments', icon: Building2 },
      { label: 'Role Intelligence', path: '/admin/roles', icon: Briefcase },
      { label: 'Competency Heatmap', path: '/admin/heatmap', icon: Thermometer },
      { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { label: 'Workforce Directory', path: '/admin/workforce', icon: Users },
    ],
  },
  {
    label: 'Competency',
    items: [
      { label: 'Competency Framework', path: '/admin/competencies', icon: Target },
      { label: 'Role Mapping', path: '/admin/role-mapping', icon: ClipboardList },
    ],
  },
  {
    label: 'Content & AI',
    items: [
      { label: 'Content Library', path: '/admin/content', icon: BookOpen },
      { label: 'Upload & Process', path: '/admin/ai-upload', icon: Upload },
      { label: 'AI Assessment Studio', path: '/admin/ai-studio', icon: BrainCircuit },
      { label: 'AI Review Queue', path: '/admin/ai-review', icon: ListChecks },
      { label: 'Question Bank', path: '/admin/questions', icon: FileText },
      { label: 'Assessments', path: '/admin/assessments', icon: ClipboardList },
    ],
  },
  {
    label: 'Platform & Governance',
    items: [
      { label: 'Reports & Exports', path: '/admin/reports', icon: FileBarChart },
      { label: 'Security Audit Logs', path: '/admin/audit-logs', icon: History },
      { label: 'Integration Center', path: '/admin/integrations', icon: Network },
      { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

export const AdminLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-md text-on-surface-variant">Loading Admin Console...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const userInitial = (user.email || 'A')[0].toUpperCase();

  const SidebarContent = () => (
    <>
      <div className="mb-6 px-4">
        <div className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <Shield size={20} />
          Admin Suite
        </div>
        <div className="font-caption text-caption text-on-surface-variant mt-1">Government Portal</div>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto px-2">
        {adminNavSections.map((section, idx) => (
           <React.Fragment key={section.label}>
             {idx > 0 && <div className="mt-4 mb-2 px-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{section.label}</div>}
             {section.items.map((item) => {
               const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
               return (
                 <li key={item.path}>
                   <Link
                     to={item.path}
                     onClick={() => setMobileMenuOpen(false)}
                     className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                       isActive 
                         ? 'bg-secondary-container text-on-secondary-container font-semibold' 
                         : 'text-on-surface-variant hover:bg-surface-container-high'
                     }`}
                   >
                     <item.icon size={20} />
                     <span className="font-body-md text-body-md">{item.label}</span>
                   </Link>
                 </li>
               )
             })}
           </React.Fragment>
        ))}
      </ul>
      <div className="mt-auto p-4 border-t border-outline-variant">
         <button onClick={logout} className="flex items-center gap-3 px-4 py-2 w-full text-left text-error hover:bg-error-container rounded-lg transition-all">
           <LogOut size={20} />
           <span className="font-body-md text-body-md">Sign Out</span>
         </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-lg text-on-background">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen border-r border-outline-variant bg-surface-container py-8 sticky left-0 top-0">
        <SidebarContent />
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <nav className="relative flex flex-col w-64 h-screen bg-surface-container border-r border-outline-variant py-8 shadow-xl">
             <button className="absolute top-4 right-4 text-on-surface-variant" onClick={() => setMobileMenuOpen(false)}>
               <X size={24} />
             </button>
            <SidebarContent />
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-surface border-b border-outline-variant h-14 w-full flex justify-between items-center px-4 md:px-6 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-on-surface-variant" onClick={() => setMobileMenuOpen(true)}>
               <Menu size={24} />
            </button>
            <div className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">Workforce Intelligence</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-[36px] pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim text-body-md w-64 placeholder:text-on-surface-variant" 
              />
            </div>
            <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors" title="Notifications">
              <Bell size={20} />
            </button>
            <button onClick={() => navigate('/admin/settings')} className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors" title="Settings">
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm border border-outline-variant ml-2">
              {userInitial}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
           <div className="max-w-7xl mx-auto">
             <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};
