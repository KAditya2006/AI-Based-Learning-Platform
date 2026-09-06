import React from 'react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, TrendingUp } from 'lucide-react';


export const AdminDashboard = () => {
  const { data: analytics } = useSWR('/admin/analytics', fetchClient);

  return (
    <div className="flex-1 overflow-y-auto p-lg bg-background min-h-full font-body-md text-on-surface animate-in fade-in duration-300">
      <style>
        {`
          .shadow-grounded { box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05); }
          .card-border { border: 1px solid var(--tw-colors-outline-variant, #e2bfb5); }
          .interactive-card:active { box-shadow: none; border-color: #D1C9C4; transform: translateY(1px); }
        `}
      </style>
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-xl border-b border-surface-variant pb-md gap-md mt-sm">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface">Institutional Overview</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Real-time intelligence on workforce capabilities.</p>
        </div>
        <Button className="font-label-caps text-label-caps uppercase tracking-wider">
          GENERATE REPORT
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
        <div className="bg-surface-container-lowest p-md rounded-lg card-border shadow-grounded interactive-card cursor-pointer">
          <div className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase">Total Officials</div>
          <div className="font-headline-md text-headline-md text-on-surface">{(analytics as any)?.workforce?.totalUsers || 0}</div>
          <div className="font-caption text-caption text-secondary mt-xs flex items-center gap-xs">
            <TrendingUp className="text-[14px]" /> +2.4% this quarter
          </div>
        </div>

        <div className="bg-surface-container-lowest p-md rounded-lg card-border shadow-grounded interactive-card cursor-pointer">
          <div className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase">Active Learners</div>
          <div className="font-headline-md text-headline-md text-on-surface">{(analytics as any)?.workforce?.activeLearners || 0}</div>
          <div className="font-caption text-caption text-secondary mt-xs flex items-center gap-xs">
            <TrendingUp className="text-[14px]" /> +5.1% this quarter
          </div>
        </div>

        <div className="bg-surface-container-lowest p-md rounded-lg card-border shadow-grounded interactive-card cursor-pointer">
          <div className="font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase">Competency Coverage</div>
          <div className="font-headline-md text-headline-md text-on-surface">{(analytics as any)?.workforce?.coverageRate || 0}%</div>
          <div className="w-full bg-surface-container-high h-2 mt-sm rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${(analytics as any)?.workforce?.coverageRate || 0}%` }}></div>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-md rounded-lg card-border shadow-grounded interactive-card border-l-4 border-l-error cursor-pointer">
          <div className="font-label-caps text-label-caps text-error mb-xs uppercase">Critical Gaps</div>
          <div className="font-headline-md text-headline-md text-on-surface">{(analytics as any)?.workforce?.criticalGaps || 0}</div>
          <div className="font-caption text-caption text-error mt-xs flex items-center gap-xs">
            <AlertTriangle className="text-[14px]" /> Requires immediate action
          </div>
        </div>
      </div>
      
      {/* Quick Actions / Placeholders for remaining dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-lg card-border p-lg shadow-grounded min-h-[400px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-surface-variant pb-sm mb-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Workforce Distribution</h3>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">By Department</span>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center py-xl">
            <div className="w-full space-y-md max-w-lg">
              {((analytics as any)?.workforce?.departments || []).length > 0 ? (
                ((analytics as any).workforce.departments).slice(0, 5).map((dept: any, idx: number) => {
                  const percentage = Math.round((dept.count / (analytics as any).workforce.totalUsers) * 100) || 0;
                  const bgColors = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-primary-container', 'bg-secondary-container'];
                  return (
                    <div key={dept._id || idx}>
                      <div className="flex justify-between text-body-md text-on-surface mb-1">
                        <span>{dept._id || 'Unassigned'}</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-surface-variant h-2.5 rounded-full overflow-hidden">
                        <div className={`${bgColors[idx % bgColors.length]} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-on-surface-variant py-xl">No departmental data available.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-lg card-border p-lg shadow-grounded min-h-[400px]">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md border-b border-surface-variant pb-sm">Recent Alerts</h3>
            <div className="p-sm text-center text-on-surface-variant mt-xl">
              No recent alerts available.
            </div>
        </div>
      </div>
    </div>
  );
};
