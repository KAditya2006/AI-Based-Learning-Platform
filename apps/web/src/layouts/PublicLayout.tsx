import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export const PublicLayout = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col antialiased text-on-background selection:bg-primary-fixed-dim selection:text-on-primary-fixed">
      {/* Main Centered Layout */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-[480px] mx-auto">
        
        {/* Branding Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="bg-primary text-on-primary p-3 rounded-lg mb-4 inline-flex items-center justify-center">
            <BrainCircuit size={32} />
          </div>
          <h1 className="font-headline-md text-headline-md text-on-background tracking-tight">Skill Intelligence</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">Institutional Access Portal</p>
        </div>

        {/* Child Routes (Login/Register Form) */}
        <div className="bg-surface border border-surface-variant rounded-lg w-full p-6 md:p-8 shadow-sm">
          <Outlet />
        </div>
        
        {/* Security & Organization Footer */}
        <div className="mt-8 text-center flex flex-col items-center gap-4 w-full">
          {/* Security Indicator */}
          <div className="flex items-center justify-center gap-2 text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full border border-surface-variant">
            <span className="font-caption text-caption font-medium">Secure Government System</span>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-on-surface-variant font-caption text-caption">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span aria-hidden="true" className="text-surface-variant">|</span>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span aria-hidden="true" className="text-surface-variant">|</span>
            <a href="#" className="hover:text-primary transition-colors">Help Center</a>
          </div>
          
          <p className="font-caption text-caption text-outline mt-2">
            Warning: Unauthorized access to this system is strictly prohibited and subject to institutional policy.
          </p>
        </div>

      </main>
    </div>
  );
};
