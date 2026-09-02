import React from 'react';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Download, Filter, Gauge, TrendingUp, Users } from 'lucide-react';


export const AdminAnalytics = () => {
  const { data: analytics } = useSWR('/admin/analytics', fetchClient);

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
          <div className="font-display-lg text-display-lg text-on-surface">{(analytics as any)?.totalLearners || '14,285'}</div>
          <div className="flex items-center gap-xs mt-sm text-secondary-container">
            <TrendingUp className="text-[16px]" />
            <span className="font-caption text-caption">+2.4% from last quarter</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded">
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Avg. Readiness Score</span>
            <Gauge className="text-tertiary" />
          </div>
          <div className="font-display-lg text-display-lg text-on-surface">76/100</div>
          <div className="flex items-center gap-xs mt-sm text-secondary-container">
            <TrendingUp className="text-[16px]" />
            <span className="font-caption text-caption">+1.1 pts from last quarter</span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-grounded flex flex-col justify-center relative overflow-hidden group cursor-pointer transition-all hover:border-outline">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest to-surface-container-low opacity-50 z-0"></div>
          <div className="relative z-10">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">AI Skill Assessment Initiative</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">The rollout of the new AI assessment tool is currently 65% complete across all departments. Review pending evaluations.</p>
            <div className="mt-md w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
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
            {/* Bar 1 */}
            <div>
              <div className="flex justify-between font-label-caps text-label-caps mb-xs uppercase">
                <span className="text-on-surface">Data Analysis</span>
                <span className="text-error">High Priority</span>
              </div>
              <div className="w-full bg-surface-container h-4 rounded-sm overflow-hidden flex">
                <div className="bg-tertiary-container h-full" style={{ width: '40%' }}></div>
                <div className="bg-error-container h-full border-l border-surface-container-lowest" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-xs">
                <span>Current: 40%</span>
                <span>Target: 100%</span>
              </div>
            </div>
            {/* Bar 2 */}
            <div>
              <div className="flex justify-between font-label-caps text-label-caps mb-xs uppercase">
                <span className="text-on-surface">Cloud Architecture</span>
                <span className="text-secondary-container">Med Priority</span>
              </div>
              <div className="w-full bg-surface-container h-4 rounded-sm overflow-hidden flex">
                <div className="bg-tertiary-container h-full" style={{ width: '65%' }}></div>
                <div className="bg-secondary-fixed-dim h-full border-l border-surface-container-lowest" style={{ width: '35%' }}></div>
              </div>
              <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-xs">
                <span>Current: 65%</span>
                <span>Target: 100%</span>
              </div>
            </div>
            {/* Bar 3 */}
            <div>
              <div className="flex justify-between font-label-caps text-label-caps mb-xs uppercase">
                <span className="text-on-surface">Project Management</span>
                <span className="text-on-surface-variant">Low Priority</span>
              </div>
              <div className="w-full bg-surface-container h-4 rounded-sm overflow-hidden flex">
                <div className="bg-tertiary-container h-full" style={{ width: '85%' }}></div>
                <div className="bg-surface-variant h-full border-l border-surface-container-lowest" style={{ width: '15%' }}></div>
              </div>
              <div className="flex justify-between font-caption text-caption text-on-surface-variant mt-xs">
                <span>Current: 85%</span>
                <span>Target: 100%</span>
              </div>
            </div>
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
                <tr className="hover:bg-surface-container-low transition-colors group border-b border-outline-variant border-dashed">
                  <td className="p-sm font-body-md text-body-md text-on-surface">Economic Statistics Wing</td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-primary-container rounded-sm flex items-center justify-center text-on-primary-container font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">88</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-secondary-fixed rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">72</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-surface-container rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">55</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-secondary-fixed rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">68</div></td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group border-b border-outline-variant border-dashed">
                  <td className="p-sm font-body-md text-body-md text-on-surface">Data Informatics Division</td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-secondary-fixed rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">70</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-primary-container rounded-sm flex items-center justify-center text-on-primary-container font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">95</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-surface-container rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">45</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-secondary-fixed rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">62</div></td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="p-sm font-body-md text-body-md text-on-surface">National Accounts Division</td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-primary-container rounded-sm flex items-center justify-center text-on-primary-container font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">82</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-surface-container rounded-sm flex items-center justify-center text-on-surface font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">30</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-primary-container rounded-sm flex items-center justify-center text-on-primary-container font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">92</div></td>
                  <td className="p-sm text-center"><div className="w-full h-8 bg-primary-container rounded-sm flex items-center justify-center text-on-primary-container font-caption text-caption opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer">85</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
