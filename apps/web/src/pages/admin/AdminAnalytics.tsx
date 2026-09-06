import React from 'react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Download, Filter, Gauge, TrendingUp, Users } from 'lucide-react';


export const AdminAnalytics = () => {
  const { data: analyticsResp, isLoading } = useSWR('/admin/analytics', fetchClient);
  const analytics = (analyticsResp as any)?.data;

  return (
    <div className="flex-1 p-lg md:p-xl max-w-[1400px] mx-auto w-full space-y-xl font-body-md text-on-surface bg-background min-h-full animate-in fade-in duration-300">
      <style>
        {`
          .shadow-grounded { box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05); }
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 24px;
          }
        `}
      </style>

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-outline-variant pb-md mt-sm">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Analytics Overview</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Comprehensive view of institutional workforce capabilities.</p>
        </div>
        <div className="flex gap-md">
          <button className="px-md py-sm border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-label-caps text-label-caps hover:bg-surface-container transition-colors flex items-center gap-sm">
            <Filter className="text-[18px]" />
            Filter Data
          </button>
          <button className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-sm">
            <Download className="text-[18px]" />
            Export Report
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="bento-grid">
        {/* KPI Cards (Row 1) */}
        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded">
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Workforce</span>
            <Users className="text-tertiary" />
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">{isLoading ? '...' : analytics?.workforce?.totalUsers || '0'}</div>
          <div className="flex items-center gap-xs mt-sm text-secondary-container">
            <TrendingUp className="text-[16px]" />
            <span className="font-caption text-caption">Active: {analytics?.workforce?.activeLearners || 0}</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded">
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Critical Skill Gaps</span>
            <Gauge className="text-error" />
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">{isLoading ? '...' : analytics?.workforce?.criticalGaps || '0'}</div>
          <div className="flex items-center gap-xs mt-sm text-secondary-container">
            <TrendingUp className="text-[16px]" />
            <span className="font-caption text-caption">Identified priority areas</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded flex flex-col justify-center relative overflow-hidden group cursor-pointer transition-all hover:border-outline">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest to-surface-container-low opacity-50 z-0"></div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">AI Skill Assessment Initiative</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">The rollout of the new AI assessment tool is currently {analytics?.workforce?.coverageRate || 0}% complete across all departments. Review pending evaluations.</p>
            <div className="mt-md w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${analytics?.workforce?.coverageRate || 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Complex Viz: Workforce Readiness Trends */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-lg border-b border-outline-variant pb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Workforce Readiness Trends</h3>
            <div className="flex gap-sm">
              <span className="px-sm py-xs bg-surface-container rounded font-caption text-caption text-on-surface cursor-pointer">1M</span>
              <span className="px-sm py-xs bg-primary-container text-on-primary-container rounded font-caption text-caption cursor-pointer">6M</span>
              <span className="px-sm py-xs bg-surface-container rounded font-caption text-caption text-on-surface cursor-pointer">1Y</span>
            </div>
          </div>
          {/* Interactive Line Chart Canvas Area */}
          <div className="flex-1 relative w-full h-full min-h-[250px] bg-surface-bright rounded border border-outline-variant border-dashed flex items-center justify-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, #8e7068 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #8e7068 40px)" }}></div>
            <TrendingUp className="text-outline-variant text-[48px]" />
            <span className="font-body-md text-body-md text-outline ml-sm">Workforce Competency Growth Trajectory (6 Months)</span>
          </div>
        </div>

        {/* Top Skill Gaps (Horizontal Bar Chart) */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded min-h-[400px] flex flex-col">
          <div className="border-b border-outline-variant pb-sm mb-lg">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Top Skill Gaps</h3>
            <p className="font-caption text-caption text-on-surface-variant">Prioritized by institutional impact</p>
          </div>
          <div className="flex-1 flex flex-col justify-around gap-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-on-surface-variant">Loading...</div>
            ) : analytics?.skills?.topGaps?.length > 0 ? (
              analytics.skills.topGaps.slice(0, 4).map((gap: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between font-label-caps text-label-caps mb-xs uppercase">
                    <span className="text-on-surface">{gap.name}</span>
                    <span className={gap.avgGap > 2 ? 'text-error' : 'text-secondary-container'}>
                      {gap.avgGap > 2 ? 'High Priority' : 'Med Priority'}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-4 rounded-sm overflow-hidden flex">
                    <div className="bg-tertiary-container h-full" style={{ width: `${Math.max(0, 100 - (gap.avgGap * 20))}%` }}></div>
                    <div className={gap.avgGap > 2 ? 'bg-error-container h-full border-l border-surface-container-lowest' : 'bg-secondary-fixed-dim h-full border-l border-surface-container-lowest'} style={{ width: `${Math.min(100, gap.avgGap * 20)}%` }}></div>
                  </div>
                  <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-xs">
                    <span>Avg Gap: {gap.avgGap.toFixed(1)} lvls</span>
                    <span>Affected: {gap.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-on-surface-variant p-md bg-surface-container rounded-lg">No critical skill gaps identified yet.</div>
            )}
          </div>
        </div>

        {/* Competency Heatmap (Departmental) */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded">
          <div className="flex justify-between items-end mb-lg border-b border-outline-variant pb-sm">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Competency Heatmap</h3>
              <p className="font-caption text-caption text-on-surface-variant">Cross-departmental capability matrix</p>
            </div>
            <div className="flex items-center gap-sm font-caption text-caption">
              <span className="flex items-center gap-xs"><div className="w-3 h-3 bg-surface-container rounded-sm"></div> Low</span>
              <span className="flex items-center gap-xs"><div className="w-3 h-3 bg-secondary-fixed rounded-sm"></div> Med</span>
              <span className="flex items-center gap-xs"><div className="w-3 h-3 bg-primary-container rounded-sm"></div> High</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant w-1/4 uppercase">Department</th>
                  <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant text-center uppercase">Leadership</th>
                  <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant text-center uppercase">Technical</th>
                  <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant text-center uppercase">Communication</th>
                  <th className="font-label-caps text-label-caps text-on-surface-variant p-sm border-b border-outline-variant text-center uppercase">Policy Analysis</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-sm text-center text-on-surface-variant">Loading...</td>
                  </tr>
                ) : analytics?.workforce?.departments?.length > 0 ? (
                  analytics.workforce.departments.slice(0, 5).map((dept: any, index: number) => (
                    <tr key={index} className="hover:bg-surface-container-low transition-colors group border-b border-outline-variant border-dashed">
                      <td className="p-sm font-body-md text-body-md text-on-surface">{dept._id || 'Unassigned'}</td>
                      <td className="p-sm text-center"><div className="w-full h-8 bg-surface-container rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">N/A</div></td>
                      <td className="p-sm text-center"><div className="w-full h-8 bg-surface-container rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">N/A</div></td>
                      <td className="p-sm text-center"><div className="w-full h-8 bg-surface-container rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">N/A</div></td>
                      <td className="p-sm text-center"><div className="w-full h-8 bg-surface-container rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">N/A</div></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-sm text-center text-on-surface-variant bg-surface-container rounded">No department data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
