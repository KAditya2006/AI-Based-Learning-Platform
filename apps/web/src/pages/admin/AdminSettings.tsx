import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';


export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="flex-1 overflow-auto bg-surface-bright flex flex-row font-body-md text-on-surface h-full animate-in fade-in duration-300">
      {/* Settings Sub-Navigation */}
      <aside className="w-64 border-r border-outline-variant bg-surface py-lg px-md flex flex-col gap-sm hidden lg:flex">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md px-2">Settings</h3>
        <nav className="flex flex-col gap-1 font-body-md text-body-md">
          <button 
            onClick={() => setActiveTab('config')}
            className={`w-full text-left px-3 py-2 rounded-lg font-bold flex justify-between items-center transition-colors ${activeTab === 'config' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            System Config
            <ChevronRight className="text-sm" />
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${activeTab === 'roles' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            Cadre Roles &amp; Permissions
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${activeTab === 'notifications' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            Dispatch &amp; Notifications
          </button>
          <button 
            onClick={() => setActiveTab('integrations')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${activeTab === 'integrations' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            Institutional Integrations
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${activeTab === 'security' ? 'bg-secondary-container text-on-secondary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            Security &amp; Audit Trail
          </button>
        </nav>
      </aside>

      {/* Settings Detail Pane */}
      <div className="flex-1 p-lg lg:p-xl max-w-4xl">
        <div className="mb-xl mt-sm">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">System Configuration</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage core institutional instance settings and operational parameters.</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] overflow-hidden">
          <div className="p-lg border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">General Configuration</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Basic information about this ministry instance environment.</p>
            </div>
          </div>
          <div className="p-lg flex flex-col gap-xl">
            {/* Instance Name Field */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider">Instance Name</label>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all" 
                type="text" 
                defaultValue="Statistix Intelligence Core v2.4"
              />
              <p className="mt-1 font-caption text-caption text-on-surface-variant">The display name used throughout the application header and official exports.</p>
            </div>

            {/* Timezone Select */}
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface-variant mb-2 uppercase tracking-wider">System Timezone</label>
              <div className="relative">
                <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all pr-10 cursor-pointer">
                  <option value="ist">IST (Indian Standard Time, UTC+05:30)</option>
                  <option value="utc">UTC (Coordinated Universal Time)</option>
                  <option value="est">EST (Eastern Standard Time)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="flex items-center justify-between border-t border-outline-variant pt-lg mt-sm">
              <div>
                <label className="block font-headline-sm text-headline-sm text-on-surface">Maintenance Mode</label>
                <p className="mt-1 font-body-md text-body-md text-on-surface-variant max-w-md">Restrict access to system administrators only during database migrations. Active users will be logged out gracefully.</p>
              </div>
              <button 
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                aria-checked={maintenanceMode} 
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${maintenanceMode ? 'bg-primary' : 'bg-surface-variant'}`}
                role="switch" 
                type="button"
              >
                <span 
                  aria-hidden="true" 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface-container-lowest shadow ring-0 transition duration-200 ease-in-out ${maintenanceMode ? 'translate-x-5' : 'translate-x-0'}`}
                ></span>
              </button>
            </div>
          </div>
          
          <div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-end gap-md">
            <button className="px-4 py-2 font-label-caps text-label-caps uppercase text-primary hover:bg-surface-container rounded-md transition-colors">Discard Changes</button>
            <button className="px-4 py-2 font-label-caps text-label-caps uppercase bg-primary text-on-primary rounded-md shadow-sm hover:bg-primary-container transition-colors">Save Configuration</button>
          </div>
        </div>
      </div>
    </div>
  );
};
