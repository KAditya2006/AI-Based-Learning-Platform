import React, { useEffect, useState } from 'react';
import { learningApi } from '../../api/learning';
import type { LearningResource } from '../../api/learning';
import { Button } from '../../components/ui/Button';
import { Globe, GraduationCap, Landmark, LayoutGrid, List, Lock, Plus } from 'lucide-react';


export const ContentManagement: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await learningApi.getLibrary();
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="p-lg md:p-xl flex-grow overflow-y-auto bg-background font-body-md text-on-surface h-full animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-xl mt-sm">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Learning Assets</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Manage and map institutional training content.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button className="bg-surface-container-lowest border border-primary text-primary px-lg py-2 rounded font-label-caps text-label-caps hover:bg-surface-container-low transition-colors shadow-sm uppercase">
            Import
          </button>
          <button className="bg-primary text-on-primary px-lg py-2 rounded font-label-caps text-label-caps hover:bg-primary-container transition-colors shadow-sm flex items-center gap-xs uppercase">
            <Plus className="text-[16px]" />
            New Asset
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md mb-xl shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-wrap gap-md items-end">
        <div className="flex flex-col gap-xs flex-grow min-w-[200px]">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Source</label>
          <select className="w-full bg-surface-container-lowest border border-outline-variant rounded py-2 px-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer">
            <option>All Sources</option>
            <option>Internal LMS</option>
            <option>Coursera</option>
            <option>Pluralsight</option>
          </select>
        </div>
        <div className="flex flex-col gap-xs flex-grow min-w-[200px]">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Status</label>
          <select className="w-full bg-surface-container-lowest border border-outline-variant rounded py-2 px-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer">
            <option>All Statuses</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Review</option>
          </select>
        </div>
        <div className="flex flex-col gap-xs flex-grow min-w-[200px]">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Competency</label>
          <select className="w-full bg-surface-container-lowest border border-outline-variant rounded py-2 px-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-fixed appearance-none cursor-pointer">
            <option>All Competencies</option>
            <option>Data Analysis</option>
            <option>Leadership</option>
            <option>Cybersecurity</option>
          </select>
        </div>
        <div className="flex items-center gap-xs">
          <button onClick={() => setViewMode('grid')} className={`p-2 border border-outline-variant rounded transition-colors ${viewMode === 'grid' ? 'text-on-surface bg-surface-container' : 'text-on-surface-variant hover:bg-surface-container'}`} title="Grid View">
            <LayoutGrid className="text-[20px]" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 border border-outline-variant rounded transition-colors ${viewMode === 'list' ? 'text-on-surface bg-surface-container' : 'text-on-surface-variant hover:bg-surface-container'}`} title="List View">
            <List className="text-[20px]" />
          </button>
        </div>
      </div>

      {/* Bento Grid / Cards Content */}
      {loading ? (
        <div className="p-8 text-center text-on-surface-variant font-body-md">Loading library assets...</div>
      ) : resources.length === 0 ? (
        <div className="text-center text-on-surface-variant py-xl">
          <GraduationCap className="text-4xl mx-auto mb-2 text-on-surface-variant" />
          <p className="font-headline-sm">No learning assets found.</p>
          <p className="text-sm mt-1">Import or create a new asset to get started.</p>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg' : 'grid-cols-1 gap-md'}`}>
          {resources.map((r) => (
            <div key={r.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-[#D1C9C4] transition-all flex flex-col group cursor-pointer relative overflow-hidden">
              <div className="h-32 bg-surface-container border-b border-outline-variant flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  {r.provider === 'internal' ? <Landmark className="text-[48px] text-primary/40" /> : r.provider === 'coursera' ? <Globe className="text-[48px] text-primary/40" /> : <GraduationCap className="text-[48px] text-primary/40" />}
                </div>
              </div>
              <div className="p-md flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-sm">
                  <span className="bg-primary text-on-primary px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Published</span>
                  <span className="text-on-surface-variant font-caption text-caption flex items-center gap-xs uppercase">
                    <Landmark className="text-[14px]" />
                    {r.provider}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs leading-tight">{r.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">{r.description}</p>
                <div className="mt-auto border-t border-surface-variant pt-sm">
                  <span className="font-caption text-caption text-on-surface-variant mb-xs block uppercase">Mapped Competencies:</span>
                  <div className="flex flex-wrap gap-xs">
                    {(r.competency_ids || r.competencies || []).slice(0,3).map((cid: any, idx: number) => {
                      const name = typeof cid === 'object' ? cid.name : String(cid);
                      return (
                        <span key={idx} className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">{name}</span>
                      );
                    })}
                    {(r.competency_ids || r.competencies || []).length > 3 && (
                       <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">+{(r.competency_ids || r.competencies || []).length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
