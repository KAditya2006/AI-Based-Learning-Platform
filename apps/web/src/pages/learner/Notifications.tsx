import React, { useState } from 'react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Award, ClipboardCheck, RefreshCcw, Star, FileText, ClipboardList, Cloud, GraduationCap, Inbox, MailWarning } from 'lucide-react';


const getNotifIcon = (type: string) => {
    if (type?.toLowerCase().includes('recommendation') || type?.toLowerCase().includes('award')) return <Award />;
    if (type?.toLowerCase().includes('learn') || type?.toLowerCase().includes('course')) return <GraduationCap />;
    if (type?.toLowerCase().includes('assessment') || type?.toLowerCase().includes('review')) return <ClipboardCheck />;
    if (type?.toLowerCase().includes('system') || type?.toLowerCase().includes('update')) return <RefreshCcw />;
    if (type?.toLowerCase().includes('endorse')) return <Star />;
    return <FileText />;
  };

const formatDateSection = (dateStr: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatTimeAgo = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  
  if (formatDateSection(dateStr) === 'Yesterday') return 'Yesterday';
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const Notifications = () => {
  const { data, mutate, isLoading } = useSWR('/notifications', fetchClient);
  const notifications = (data as any)?.data?.notifications || [];
  
  const [activeFilter, setActiveFilter] = useState('All');
  
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await fetchClient(`/notifications/${id}/read`, { method: 'PATCH' });
    mutate();
  };

  const handleMarkAllAsRead = async () => {
    await fetchClient('/notifications/read-all', { method: 'POST' });
    mutate();
  };
  
  const filteredNotifications = notifications.filter((n: any) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return !n.isRead;
    if (activeFilter === 'Learning') return n.type?.toLowerCase().includes('learn') || n.type?.toLowerCase().includes('course') || n.type?.toLowerCase().includes('recommendation');
    if (activeFilter === 'Assessments') return n.type?.toLowerCase().includes('assessment') || n.type?.toLowerCase().includes('review');
    if (activeFilter === 'System') return n.type?.toLowerCase().includes('system') || n.type?.toLowerCase().includes('update');
    return true;
  });
  
  // Group by date section
  const groupedNotifications: { [key: string]: any[] } = {};
  filteredNotifications.forEach((n: any) => {
    const section = formatDateSection(n.createdAt);
    if (!groupedNotifications[section]) {
      groupedNotifications[section] = [];
    }
    groupedNotifications[section].push(n);
  });

  return (
    <div className="flex-1 w-full max-w-screen-2xl mx-auto px-container-margin md:px-lg py-xl font-body-lg text-on-surface animate-in fade-in duration-300">
      <style>
        {`
          .grounded-shadow {
            box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
          }
          .interactive-card:active {
            box-shadow: none;
            border-color: #D1C9C4;
          }
        `}
      </style>
      
      {/* Page Header */}
      <div className="mb-xl flex justify-between items-end">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Notifications</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Stay updated on your learning journey and team assessments.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" onClick={handleMarkAllAsRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Split Pane Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl items-start">
        {/* Left Pane: Filters */}
        <aside className="md:col-span-3 flex flex-row md:flex-col gap-sm overflow-x-auto pb-sm md:pb-0 hide-scrollbar">
          <button 
            onClick={() => setActiveFilter('All')}
            className={`flex items-center justify-between px-md py-sm rounded-lg font-body-md text-body-md whitespace-nowrap transition-all border border-transparent ${activeFilter === 'All' ? 'bg-surface-container text-on-surface font-semibold interactive-card' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
          >
            <span className="flex items-center gap-sm">
              <Inbox className="text-[20px]" /> All
            </span>
            <span className="font-caption text-caption bg-primary-fixed text-on-primary-fixed-variant px-sm rounded-full">{notifications.length}</span>
          </button>
          
          <button 
            onClick={() => setActiveFilter('Unread')}
            className={`flex items-center justify-between px-md py-sm rounded-lg font-body-md text-body-md whitespace-nowrap transition-all border border-transparent ${activeFilter === 'Unread' ? 'bg-surface-container text-on-surface font-semibold interactive-card' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
          >
            <span className="flex items-center gap-sm">
              <MailWarning className="text-[20px]" /> Unread
            </span>
            {unreadCount > 0 && <span className="w-2 h-2 rounded-full bg-primary"></span>}
          </button>
          
          <div className="hidden md:block w-full h-[1px] bg-surface-variant my-xs"></div>
          
          <button 
            onClick={() => setActiveFilter('Learning')}
            className={`flex items-center justify-between px-md py-sm rounded-lg font-body-md text-body-md whitespace-nowrap transition-all border border-transparent ${activeFilter === 'Learning' ? 'bg-surface-container text-on-surface font-semibold interactive-card' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
          >
            <span className="flex items-center gap-sm">
              <GraduationCap className="text-[20px]" /> Learning
            </span>
          </button>
          
          <button 
            onClick={() => setActiveFilter('Assessments')}
            className={`flex items-center justify-between px-md py-sm rounded-lg font-body-md text-body-md whitespace-nowrap transition-all border border-transparent ${activeFilter === 'Assessments' ? 'bg-surface-container text-on-surface font-semibold interactive-card' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
          >
            <span className="flex items-center gap-sm">
              <ClipboardList className="text-[20px]" /> Assessments
            </span>
          </button>
          
          <button 
            onClick={() => setActiveFilter('System')}
            className={`flex items-center justify-between px-md py-sm rounded-lg font-body-md text-body-md whitespace-nowrap transition-all border border-transparent ${activeFilter === 'System' ? 'bg-surface-container text-on-surface font-semibold interactive-card' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}`}
          >
            <span className="flex items-center gap-sm">
              <Cloud className="text-[20px]" /> System
            </span>
          </button>
        </aside>

        {/* Right Pane: Notification List */}
        <section className="md:col-span-9 flex flex-col gap-md">
          {isLoading ? (
             <div className="flex flex-col gap-md">
               <div className="h-24 bg-surface-variant rounded-xl animate-pulse"></div>
               <div className="h-24 bg-surface-variant rounded-xl animate-pulse"></div>
             </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-xl flex flex-col items-center justify-center text-center">
               <Inbox className="text-on-surface-variant mb-md text-[48px]" />
               <h3 className="font-headline-sm text-headline-sm text-on-surface">No notifications</h3>
               <p className="font-body-md text-body-md text-on-surface-variant mt-sm">You're all caught up!</p>
            </div>
          ) : (
            Object.keys(groupedNotifications).map((section) => (
              <React.Fragment key={section}>
                <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-xs mt-sm first:mt-0">{section}</h2>
                {groupedNotifications[section].map((n: any) => {
                  const iconName = getNotifIcon(n.type);
                  return (
                    <div 
                      key={n._id}
                      onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                      className={`relative bg-surface-container-lowest border border-surface-variant rounded-xl p-md grounded-shadow flex flex-col sm:flex-row gap-md items-start sm:items-center cursor-pointer transition-all interactive-card ${n.isRead ? 'opacity-80 hover:opacity-100' : 'hover:border-primary'}`}
                    >
                      {/* Unread Indicator */}
                      {!n.isRead && (
                        <div className="absolute top-md left-sm w-2 h-2 rounded-full bg-primary sm:hidden"></div>
                      )}
                      
                      {/* Icon */}
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center relative ${!n.isRead ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container text-on-surface-variant'}`}>
                        {!n.isRead && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-surface-container-lowest hidden sm:block"></div>
                        )}
                        {iconName}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-md">
                          <h3 className={`font-headline-sm text-headline-sm truncate ${!n.isRead ? 'text-on-surface' : 'text-on-surface font-body-lg text-body-lg'}`}>{n.title}</h3>
                          <span className="font-caption text-caption text-outline shrink-0 mt-xs">{formatTimeAgo(n.createdAt)}</span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs line-clamp-2">{n.message}</p>
                        
                        {/* Action Area based on type */}
                        {!n.isRead && n.type?.toLowerCase().includes('recommendation') && (
                          <div className="mt-md flex items-center gap-sm">
                            <button className="px-md py-sm bg-primary text-on-primary font-label-caps text-label-caps rounded-DEFAULT hover:opacity-90 transition-opacity">View Path</button>
                            <span className="px-sm py-xs bg-tertiary-fixed text-on-tertiary-fixed font-caption text-caption rounded-DEFAULT">Recommendation</span>
                          </div>
                        )}
                        {n.isRead && n.type?.toLowerCase().includes('assessment') && (
                          <div className="mt-sm">
                            <span className="px-sm py-xs bg-surface-container-high text-on-surface-variant font-caption text-caption rounded-DEFAULT">Assessment</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))
          )}
        </section>
      </div>
    </div>
  );
};


