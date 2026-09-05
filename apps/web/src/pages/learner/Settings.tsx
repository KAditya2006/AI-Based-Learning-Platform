import React, { useState, useEffect } from 'react';
import { profileApi } from '../../api/profile';
import { useAuth } from '../../contexts/AuthContext';
import { Accessibility, Bell, ChevronDown, LogOut, User } from 'lucide-react';


export const Settings = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user?.email) {
      // Basic fallback if profile data isn't fetched; ideally we'd fetch the full profile here
      setFullName(user.email.split('@')[0]);
    }
    // Attempt to fetch actual profile name
    profileApi.getProfile().then(res => {
      if (res.firstName || res.lastName) {
        setFullName(`${res.firstName || ''} ${res.lastName || ''}`.trim());
      }
    }).catch(() => {});
  }, [user]);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSaveMessage({ text: '', type: '' });
      const parts = fullName.trim().split(' ');
      const firstName = parts[0];
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '';
      
      await profileApi.updateProfile({ firstName, lastName });
      setSaveMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      setTimeout(() => setSaveMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
      setSaveMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-screen-lg mx-auto px-lg py-xl flex flex-col gap-xl font-body-md text-on-background animate-in fade-in duration-300">
      <style>
        {`
          .toggle-checkbox:checked {
            right: 0;
            border-color: #F05A2A;
          }
          .toggle-checkbox:checked + .toggle-label {
            background-color: #F05A2A;
          }
          .toggle-checkbox:checked + .toggle-label:after {
            transform: translateX(100%);
            border-color: white;
          }
          .toggle-label {
              width: 3rem;
              height: 1.5rem;
              background-color: #e7e1dd;
              border-radius: 9999px;
              position: relative;
              cursor: pointer;
              transition: background-color 0.2s ease-in-out;
          }
          .toggle-label:after {
              content: '';
              position: absolute;
              top: 0.125rem;
              left: 0.125rem;
              width: 1.25rem;
              height: 1.25rem;
              background-color: white;
              border-radius: 50%;
              transition: transform 0.2s ease-in-out;
              box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.2);
          }
        `}
      </style>

      <header className="mb-lg mt-xl">
        <h1 className="font-display-lg text-display-lg text-on-background mb-xs">Platform Preferences</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Manage your account settings, notifications, and accessibility options.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden md:block md:col-span-3">
          <nav className="sticky top-24 flex flex-col gap-sm">
            <a href="#account" className="font-body-md text-body-md text-primary bg-surface-container-low px-md py-sm rounded-lg font-semibold flex items-center gap-sm">
              <User className="text-[20px]" />
              Account & Security
            </a>
            <a href="#notifications" className="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-lowest px-md py-sm rounded-lg flex items-center gap-sm transition-colors duration-200">
              <Bell className="text-[20px]" />
              Notifications
            </a>
            <a href="#accessibility" className="font-body-md text-body-md text-on-surface-variant hover:bg-surface-container-lowest px-md py-sm rounded-lg flex items-center gap-sm transition-colors duration-200">
              <Accessibility className="text-[20px]" />
              Preferences & Accessibility
            </a>
          </nav>
        </aside>

        {/* Settings Sections */}
        <div className="md:col-span-9 flex flex-col gap-xl pb-24">
          
          {/* Account & Security Section */}
          <section id="account" className="bg-surface-container-lowest border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] scroll-mt-24">
            <div className="border-b border-surface-variant pb-md mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-background">Account & Security</h2>
              <p className="font-caption text-caption text-on-surface-variant mt-xs">Update your basic information and security settings.</p>
            </div>
            
            <div className="flex flex-col gap-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-md py-sm font-body-md text-on-background focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-primary-fixed transition-all duration-200" 
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Email Address</label>
                  <input type="email" value={user?.email || "learner@gov.institution.org"} disabled className="w-full bg-surface-container-low border border-surface-variant rounded-lg px-md py-sm font-body-md text-on-surface-variant cursor-not-allowed" />
                  <p className="font-caption text-caption text-on-surface-variant">Contact IT to change email.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-xs pt-md border-t border-surface-variant">
                <div className="flex justify-between items-center mb-sm">
                  <div>
                    <h3 className="font-body-lg text-body-lg text-on-background font-semibold">Two-Factor Authentication</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Enhance account security with 2FA.</p>
                  </div>
                  <div>
                    <input type="checkbox" id="tfa-toggle" className="sr-only toggle-checkbox" defaultChecked />
                    <label htmlFor="tfa-toggle" className="toggle-label block"></label>
                  </div>
                </div>
              </div>
              
              <div className="pt-md flex flex-col gap-sm">
                {saveMessage.text && (
                  <p className={`font-body-sm text-sm ${saveMessage.type === 'success' ? 'text-green-600' : 'text-error'}`}>
                    {saveMessage.text}
                  </p>
                )}
                <div className="flex gap-md">
                  <button 
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="bg-primary text-on-primary px-lg py-sm rounded-lg font-body-md font-semibold hover:bg-primary-container hover:text-on-primary transition-colors duration-200 shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="bg-surface-container-lowest border border-secondary-container text-secondary-container px-lg py-sm rounded-lg font-body-md font-semibold hover:bg-surface-container-low transition-colors duration-200">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section id="notifications" className="bg-surface-container-lowest border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] scroll-mt-24">
            <div className="border-b border-surface-variant pb-md mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-background">Notifications</h2>
              <p className="font-caption text-caption text-on-surface-variant mt-xs">Manage how you receive updates and alerts.</p>
            </div>
            
            <div className="flex flex-col gap-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-background font-semibold">Weekly Progress Report</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Receive a summary of your skill development.</p>
                </div>
                <div>
                  <input type="checkbox" id="notif-progress" className="sr-only toggle-checkbox" defaultChecked />
                  <label htmlFor="notif-progress" className="toggle-label block"></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-background font-semibold">New Learning Opportunities</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Alerts when new relevant courses are available.</p>
                </div>
                <div>
                  <input type="checkbox" id="notif-learning" className="sr-only toggle-checkbox" defaultChecked />
                  <label htmlFor="notif-learning" className="toggle-label block"></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-background font-semibold">Administrative Announcements</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Critical system and policy updates.</p>
                </div>
                <div>
                  <input type="checkbox" id="notif-admin" className="sr-only toggle-checkbox" disabled defaultChecked />
                  <label htmlFor="notif-admin" className="toggle-label block opacity-50 cursor-not-allowed"></label>
                  <p className="font-caption text-caption text-on-surface-variant text-right mt-xs">Required</p>
                </div>
              </div>
            </div>
          </section>

          {/* Preferences & Accessibility Section */}
          <section id="accessibility" className="bg-surface-container-lowest border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] scroll-mt-24">
            <div className="border-b border-surface-variant pb-md mb-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-background">Preferences & Accessibility</h2>
              <p className="font-caption text-caption text-on-surface-variant mt-xs">Customize your platform experience.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Interface Language</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-md py-sm font-body-md text-on-background appearance-none focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-primary-fixed transition-all duration-200">
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-md text-on-surface-variant">
                    <ChevronDown />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Text Size</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg px-md py-sm font-body-md text-on-background appearance-none focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-primary-fixed transition-all duration-200">
                    <option value="default">Default</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-md text-on-surface-variant">
                    <ChevronDown />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-lg mt-lg pt-lg border-t border-surface-variant">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-background font-semibold">High Contrast Mode</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Increase visual contrast for better readability.</p>
                </div>
                <div>
                  <input type="checkbox" id="access-contrast" className="sr-only toggle-checkbox" />
                  <label htmlFor="access-contrast" className="toggle-label block"></label>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-body-lg text-body-lg text-on-background font-semibold">Reduce Motion</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Minimize non-essential animations.</p>
                </div>
                <div>
                  <input type="checkbox" id="access-motion" className="sr-only toggle-checkbox" defaultChecked />
                  <label htmlFor="access-motion" className="toggle-label block"></label>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone / Sign Out */}
          <section className="mt-lg border-t border-surface-variant pt-lg">
            <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg p-lg">
              <h2 className="font-headline-sm text-headline-sm text-[#991B1B] mb-sm">Session Management</h2>
              <p className="font-body-md text-body-md text-[#7F1D1D] mb-lg">Ensure you sign out when using shared institutional devices.</p>
              <button onClick={handleLogout} className="bg-[#DC2626] text-white px-xl py-sm rounded-lg font-body-md font-semibold hover:bg-[#B91C1C] transition-colors duration-200 flex items-center gap-sm w-fit">
                <LogOut className="text-[20px]" />
                Sign Out Securely
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
