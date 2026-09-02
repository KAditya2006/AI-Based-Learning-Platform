import React, { useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import type { WorkforceMember } from '../../api/admin';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, Download, Lock, Search, UserPlus } from 'lucide-react';


export const Workforce = () => {
  const navigate = useNavigate();
  const { data, error, isLoading, mutate } = useSWR<WorkforceMember[]>('/admin/users', adminApi.getWorkforce);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const workforce = data || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(workforce.map(m => m._id || m.id || '')));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  return (
    <div className="flex-1 bg-surface-bright font-body-md text-on-surface h-full overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto p-lg md:p-xl space-y-xl">
        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md mt-sm">
          <div>
            <h2 className="font-display-lg text-display-lg text-on-surface">Officials Management</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">Manage personnel, monitor competency benchmarks, and administer access levels.</p>
          </div>
          <div className="flex gap-md">
            <button className="bg-surface-container-lowest border border-primary text-primary font-label-caps text-label-caps px-md py-sm rounded flex items-center gap-sm hover:bg-surface-container transition-colors uppercase">
              <Download className="text-[18px]" />
              Export Roster
            </button>
            <button className="bg-primary text-on-primary font-label-caps text-label-caps px-md py-sm rounded flex items-center gap-sm hover:bg-secondary transition-colors uppercase">
              <UserPlus className="text-[18px]" />
              Add Official
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-wrap gap-md items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Search Personnel</label>
            <div className="relative">
              <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]" />
              <input 
                className="w-full bg-surface border border-outline-variant rounded pl-xl pr-sm py-xs font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim transition-all" 
                placeholder="Search by name, ID, or role..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Department</label>
            <select className="w-full bg-surface border border-outline-variant rounded px-sm py-xs font-body-md text-body-md hover:border-primary transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim appearance-none cursor-pointer">
              <option>All Departments</option>
              <option>National Accounts Division</option>
              <option>Economic Statistics Wing</option>
              <option>Social Statistics Division</option>
              <option>Field Operations Division</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Access Tier</label>
            <select className="w-full bg-surface border border-outline-variant rounded px-sm py-xs font-body-md text-body-md hover:border-primary transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-fixed-dim appearance-none cursor-pointer">
              <option>All Tiers</option>
              <option>Tier 1 (Public Access)</option>
              <option>Tier 2 (Official)</option>
              <option>Tier 3 (Supervisor)</option>
              <option>Tier 4 (Admin)</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block font-label-caps text-label-caps text-on-surface-variant mb-xs uppercase tracking-wider">Status</label>
            <div className="flex gap-xs">
              <span className="bg-surface-container-high px-sm py-xs rounded font-label-caps text-label-caps text-on-surface cursor-pointer border border-transparent hover:border-outline-variant uppercase">All</span>
              <span className="bg-primary-fixed-dim px-sm py-xs rounded font-label-caps text-label-caps text-on-primary-fixed cursor-pointer border border-primary uppercase">Active</span>
              <span className="bg-surface-container px-sm py-xs rounded font-label-caps text-label-caps text-on-surface-variant cursor-pointer border border-transparent hover:border-outline-variant uppercase">Inactive</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] overflow-hidden">
          {/* Bulk Action Header when items selected */}
          {selectedIds.size > 0 && (
            <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex items-center justify-between animate-in fade-in">
              <span className="font-caption text-caption text-on-surface font-semibold uppercase">{selectedIds.size} officials selected</span>
              <div className="flex gap-sm">
                <button className="text-primary font-label-caps text-label-caps px-2 py-1 rounded hover:bg-surface-container transition-colors uppercase">Assign Path</button>
                <button className="text-primary font-label-caps text-label-caps px-2 py-1 rounded hover:bg-surface-container transition-colors uppercase">Export Selected</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="p-md w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={workforce.length > 0 && selectedIds.size === workforce.length}
                    />
                  </th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Official</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Designation</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Department</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Security Access</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold uppercase tracking-wider">Mastery Status</th>
                  <th className="p-md font-label-caps text-label-caps text-on-surface-variant font-semibold text-right uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant">
                {isLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-on-surface-variant">Loading workforce data...</td></tr>
                ) : workforce.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-on-surface-variant">No workforce members found.</td></tr>
                ) : (
                  workforce.map(member => {
                    const memberName = member.name || (member.firstName ? `${member.firstName} ${member.lastName || ''}`.trim() : 'Official');
                    const memberId = member._id || member.id || '';
                    const memberDept = typeof member.department === 'object' ? member.department?.name : (member.department || 'General');
                    const memberRole = typeof member.designation === 'object' ? member.designation?.name : (member.role || 'Officer');
                    const initials = memberName.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase();

                    return (
                      <tr key={memberId} className="hover:bg-surface-container-lowest transition-colors group cursor-pointer" onClick={(e) => {
                          if((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'BUTTON' && (e.target as HTMLElement).tagName !== 'path' && (e.target as HTMLElement).tagName !== 'svg') {
                            navigate(`/admin/workforce/${memberId}`);
                          }
                        }}>
                        <td className="p-md text-center" onClick={e => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                            checked={selectedIds.has(memberId)}
                            onChange={(e) => handleSelectOne(memberId, e.target.checked)}
                          />
                        </td>
                        <td className="p-md">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface">{memberName}</div>
                              <div className="text-xs text-on-surface-variant font-mono">ID: {memberId.substring(0,8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-md text-on-surface-variant">{memberRole}</td>
                        <td className="p-md text-on-surface-variant">{memberDept}</td>
                        <td className="p-md">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-surface-container-high text-on-surface text-xs font-medium border border-outline-variant font-label-caps uppercase">
                            <Lock className="text-[14px] mr-1" /> {memberRole === 'Admin' ? 'Tier 4' : 'Tier 2'}
                          </span>
                        </td>
                        <td className="p-md">
                          <span className="bg-primary text-on-primary px-sm py-xs rounded font-label-caps text-label-caps uppercase">Certified</span>
                        </td>
                        <td className="p-md text-right opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <button onClick={() => navigate(`/admin/workforce/${memberId}`)} className="text-primary hover:text-secondary p-1 rounded">
                            <ChevronRight className="text-[20px]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-outline-variant p-md bg-surface-container-lowest flex items-center justify-between">
            <span className="font-caption text-caption text-on-surface-variant">Showing 1 to {workforce.length} of {workforce.length} personnel</span>
            <div className="flex gap-sm">
              <button className="p-xs text-on-surface-variant hover:bg-surface-container rounded transition-colors disabled:opacity-50" disabled>
                <ChevronLeft className="text-[20px]" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-container text-on-primary-container font-label-caps text-label-caps">1</button>
              <button className="p-xs text-on-surface-variant hover:bg-surface-container rounded transition-colors" disabled>
                <ChevronRight className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
