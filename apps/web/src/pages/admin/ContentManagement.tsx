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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {/* Default Preview Item 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-[#D1C9C4] transition-all flex flex-col group cursor-pointer relative overflow-hidden">
            <div className="h-32 bg-surface-container border-b border-outline-variant flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Data Analytics" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzvjgqSZpI458Zw7DBPZoWNpY3-EuibG8hngRxPmn9epsT9AScElsqazyTmdPtArtDk8t88kgbsVo3zHoAB-_kTVRWmf2JX_Z4KON534HnVF0F33whYC01rYT93PqJpHelZzqQKezUUyJjQ9z2vV_tq7hKKqgsb8CpaNy_h2BMB_ELkEi0hD3g-BduDBQg409I_Ou1_z4oKTuFHRHpr6MhHMlvIROtFrEH7WWAsMfx5WpLnW0Df6B3bA" />
            </div>
            <div className="p-md flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-sm">
                <span className="bg-primary text-on-primary px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Published</span>
                <span className="text-on-surface-variant font-caption text-caption flex items-center gap-xs uppercase">
                  <Landmark className="text-[14px]" /> Internal LMS
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs leading-tight">Advanced Data Interpretation for Public Policy</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">A comprehensive guide to interpreting large datasets to inform governmental policy decisions.</p>
              <div className="mt-auto border-t border-surface-variant pt-sm">
                <span className="font-caption text-caption text-on-surface-variant mb-xs block uppercase">Mapped Competencies:</span>
                <div className="flex flex-wrap gap-xs">
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Data Analysis</span>
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Policy Making</span>
                </div>
              </div>
            </div>
          </div>

          {/* Default Preview Item 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-[#D1C9C4] transition-all flex flex-col group cursor-pointer relative overflow-hidden">
            <div className="h-32 bg-surface-container border-b border-outline-variant flex items-center justify-center overflow-hidden">
              <img className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Strategic Leadership" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD28quiCq_IqjEjNPLHnrPdRqHNX0C-HA0pO2LMypxibcTs_2QSR0o2_-DwAnibU7_5od9fDTIBWkRCUTm0yDDPMqq9jF4Ip0aaXML4BNUpYcXFJEiVBYlgtIXZoazoJhx84Q413SIP9kqLmA2tNnIUSHE-7eszq5oy8OdvpRPv23T6hgKpbAbGu6794pANoHgyiZlHD1-mAVjyig8qMLrrprVH2k-QStVhzqJ_doTDtZgO7sHmL9tBMQ" />
            </div>
            <div className="p-md flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-sm">
                <span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Draft</span>
                <span className="text-on-surface-variant font-caption text-caption flex items-center gap-xs uppercase">
                  <Globe className="text-[14px]" /> MoSPI Portal
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs leading-tight">Strategic Leadership in Statistical Coordination</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">Developing frameworks for institutional coordination across state and central departments.</p>
              <div className="mt-auto border-t border-surface-variant pt-sm">
                <span className="font-caption text-caption text-on-surface-variant mb-xs block uppercase">Mapped Competencies:</span>
                <div className="flex flex-wrap gap-xs">
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Leadership</span>
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Coordination</span>
                </div>
              </div>
            </div>
          </div>

          {/* Default Preview Item 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:shadow-none hover:border-[#D1C9C4] transition-all flex flex-col group cursor-pointer relative overflow-hidden">
            <div className="h-32 bg-surface-container border-b border-outline-variant flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <Lock className="text-[48px] text-primary/40" />
              </div>
            </div>
            <div className="p-md flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-sm">
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Review</span>
                <span className="text-on-surface-variant font-caption text-caption flex items-center gap-xs uppercase">
                  <Landmark className="text-[14px]" /> Internal LMS
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs leading-tight">Cybersecurity and Data Protection Protocols</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">Updated compliance training for managing sensitive governmental data networks.</p>
              <div className="mt-auto border-t border-surface-variant pt-sm">
                <span className="font-caption text-caption text-on-surface-variant mb-xs block uppercase">Mapped Competencies:</span>
                <div className="flex flex-wrap gap-xs">
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Cybersecurity</span>
                  <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-0.5 rounded font-label-caps text-[10px] uppercase">Compliance</span>
                </div>
              </div>
            </div>
          </div>
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
