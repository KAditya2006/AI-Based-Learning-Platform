import React from 'react';
import { Button } from '../../components/ui/Button';
import { AlertCircle, Calendar, CheckCircle, ChevronLeft, ChevronRight, Download, Filter, Settings, User } from 'lucide-react';


export const AuditLogs = () => {
  return (
    <div className="flex-1 p-lg md:p-xl bg-surface-bright overflow-y-auto font-body-md text-on-surface h-full animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto space-y-xl">
        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mt-sm">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-surface">System Activity Trail</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Comprehensive overview of all administrative and system-level actions.</p>
          </div>
          <div className="flex gap-md">
            <button className="bg-surface-container-lowest border border-primary text-primary font-label-caps text-label-caps px-md py-sm rounded flex items-center gap-sm hover:bg-surface-container transition-colors uppercase tracking-wider">
              <Download className="text-[18px]" />
              Export CSV
            </button>
            <button className="bg-primary text-on-primary font-label-caps text-label-caps px-md py-sm rounded flex items-center gap-sm hover:bg-secondary transition-colors uppercase tracking-wider">
              <Filter className="text-[18px]" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-wrap gap-md items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]" />
              <input className="w-full bg-surface border border-outline-variant rounded pl-xl pr-sm py-xs font-body-md text-body-md cursor-pointer hover:border-primary transition-colors focus:outline-none" readOnly type="text" value="Last 7 Days"/>
            </div>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Actor Type</label>
            <select className="w-full bg-surface border border-outline-variant rounded px-sm py-xs font-body-md text-body-md hover:border-primary transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim appearance-none cursor-pointer">
              <option>All Actors</option>
              <option>Admin</option>
              <option>System</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Security Category</label>
            <select className="w-full bg-surface border border-outline-variant rounded px-sm py-xs font-body-md text-body-md hover:border-primary transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim appearance-none cursor-pointer">
              <option>All Categories</option>
              <option>Authentication</option>
              <option>Data Access</option>
              <option>Configuration</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Status</label>
            <div className="flex gap-xs">
              <span className="bg-surface-container-high px-sm py-xs rounded font-label-caps text-label-caps text-on-surface cursor-pointer border border-transparent hover:border-outline-variant uppercase">All</span>
              <span className="bg-primary-fixed-dim px-sm py-xs rounded font-label-caps text-label-caps text-on-primary-fixed cursor-pointer border border-primary uppercase">Success</span>
              <span className="bg-error-container px-sm py-xs rounded font-label-caps text-label-caps text-on-error-container cursor-pointer border border-transparent hover:border-error uppercase">Failure</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Timestamp</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Actor</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Action</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Resource</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Status</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold text-right uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md divide-y divide-outline-variant/50">
                {/* Row 1 */}
                <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="p-md text-on-surface-variant whitespace-nowrap">2026-09-02 10:32:01 IST</td>
                  <td className="p-md">
                    <div className="flex items-center gap-sm">
                      <User className="text-[18px] text-tertiary" />
                      <span className="text-on-surface font-medium">Director General (Admin)</span>
                    </div>
                  </td>
                  <td className="p-md text-on-surface">Updated Role Mapping</td>
                  <td className="p-md text-on-surface-variant font-mono text-[13px]">usr_8f92a1b</td>
                  <td className="p-md">
                    <span className="inline-flex items-center gap-xs bg-primary-fixed-dim text-on-primary-fixed px-2 py-1 rounded font-label-caps text-[10px] uppercase">
                      <CheckCircle className="text-[14px]" />
                      Success
                    </span>
                  </td>
                  <td className="p-md text-right">
                    <button className="text-primary hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight />
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="p-md text-on-surface-variant whitespace-nowrap">2026-09-02 09:15:22 IST</td>
                  <td className="p-md">
                    <div className="flex items-center gap-sm">
                      <Settings className="text-[18px] text-on-surface-variant" />
                      <span className="text-on-surface font-medium">System (Auto-Sync)</span>
                    </div>
                  </td>
                  <td className="p-md text-on-surface">Data Ingestion Started</td>
                  <td className="p-md text-on-surface-variant font-mono text-[13px]">dataset_skills_q3</td>
                  <td className="p-md">
                    <span className="inline-flex items-center gap-xs bg-primary-fixed-dim text-on-primary-fixed px-2 py-1 rounded font-label-caps text-[10px] uppercase">
                      <CheckCircle className="text-[14px]" />
                      Success
                    </span>
                  </td>
                  <td className="p-md text-right">
                    <button className="text-primary hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight />
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer bg-error-container/10">
                  <td className="p-md text-on-surface-variant whitespace-nowrap">2026-09-02 08:45:10 IST</td>
                  <td className="p-md">
                    <div className="flex items-center gap-sm">
                      <User className="text-[18px] text-tertiary" />
                      <span className="text-on-surface font-medium">Unknown IP</span>
                    </div>
                  </td>
                  <td className="p-md text-on-surface">Failed Login Attempt</td>
                  <td className="p-md text-on-surface-variant font-mono text-[13px]">auth_endpoint</td>
                  <td className="p-md">
                    <span className="inline-flex items-center gap-xs bg-error-container text-on-error-container px-2 py-1 rounded font-label-caps text-[10px] uppercase">
                      <AlertCircle className="text-[14px]" />
                      Failure
                    </span>
                  </td>
                  <td className="p-md text-right">
                    <button className="text-primary hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight />
                    </button>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                  <td className="p-md text-on-surface-variant whitespace-nowrap">2026-09-02 07:20:05 IST</td>
                  <td className="p-md">
                    <div className="flex items-center gap-sm">
                      <User className="text-[18px] text-tertiary" />
                      <span className="text-on-surface font-medium">Statistical Officer (Admin)</span>
                    </div>
                  </td>
                  <td className="p-md text-on-surface">Exported Compliance Report</td>
                  <td className="p-md text-on-surface-variant font-mono text-[13px]">rep_annual_2026</td>
                  <td className="p-md">
                    <span className="inline-flex items-center gap-xs bg-primary-fixed-dim text-on-primary-fixed px-2 py-1 rounded font-label-caps text-[10px] uppercase">
                      <CheckCircle className="text-[14px]" />
                      Success
                    </span>
                  </td>
                  <td className="p-md text-right">
                    <button className="text-primary hover:text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-outline-variant p-md bg-surface-container-lowest flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant">Showing 1 to 4 of 2,543 entries</span>
            <div className="flex gap-sm">
              <button className="p-xs text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-50" disabled>
                <ChevronLeft className="text-[20px]" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary-container font-label-caps text-label-caps">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface font-label-caps text-label-caps transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-container text-on-surface font-label-caps text-label-caps transition-colors">3</button>
              <button className="p-xs text-on-surface-variant hover:bg-surface-container rounded transition-colors">
                <ChevronRight className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
