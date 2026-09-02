import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../api/learning';
import type { LearningResource } from '../../api/learning';
import { BadgeCheck, Bookmark, Clock, Search, Wrench } from 'lucide-react';


export const ExploreLearning: React.FC = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    learningApi.getLibrary()
      .then(setResources)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const priorityResources = filtered.filter(r => r.priority === 'high');
  const recommendedResources = filtered.filter(r => r.priority !== 'high');

  return (
    <div className="flex-1 space-y-xl animate-in fade-in duration-300 w-full max-w-7xl mx-auto py-xl">
      {/* Page Header & Search */}
      <div className="mb-xl">
        <h2 className="font-display-lg text-display-lg text-on-background mb-xs">Learning Discovery Catalogue</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">Explore structured learning paths and institutional content.</p>
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]" />
          <input 
            className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg pl-xl pr-md py-sm font-body-md text-on-surface focus:outline-none focus:border-[#F05A2A] focus:ring-2 focus:ring-[#FCDCCC] transition-all" 
            placeholder="Search competencies, courses, or keywords..." 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-xl">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-lg">
          <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
            <div className="flex items-center justify-between border-b border-surface-variant pb-sm mb-md">
              <h3 className="font-label-caps text-label-caps text-on-surface">Filters</h3>
              <button className="font-caption text-caption text-primary hover:underline">Clear All</button>
            </div>
            
            {/* Filter Group 1 */}
            <div className="mb-md">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-sm">Format</h4>
              <div className="space-y-sm">
                {['COURSE', 'ASSESSMENT', 'DOCUMENT'].map((type) => (
                  <label key={type} className="flex items-center gap-sm font-body-md text-on-surface cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="rounded border-surface-variant text-primary focus:ring-primary h-4 w-4"
                      checked={typeFilter === type}
                      onChange={() => setTypeFilter(typeFilter === type ? '' : type)}
                    />
                    <span className="group-hover:text-primary transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group 2 */}
            <div className="mb-md">
              <h4 className="font-label-caps text-label-caps text-on-surface-variant mb-sm">Proficiency Level</h4>
              <div className="space-y-sm">
                {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((level) => (
                  <label key={level} className="flex items-center gap-sm font-body-md text-on-surface cursor-pointer group">
                    <input type="checkbox" className="rounded border-surface-variant text-primary focus:ring-primary h-4 w-4" />
                    <span className="group-hover:text-primary transition-colors capitalize">{level.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Content Grid */}
        <div className="flex-1 space-y-xl">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-surface-variant rounded-lg animate-pulse"></div>)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-surface-container rounded-xl border border-surface-variant text-on-surface-variant">
              No learning resources found matching your criteria.
            </div>
          ) : (
            <>
              {/* Institutional Priority Section */}
              {priorityResources.length > 0 && (
                <section>
                  <div className="flex items-center gap-sm mb-md">
                    <BadgeCheck className="text-primary" />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Institutional Priority</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
                    {priorityResources.map(resource => (
                      <div 
                        key={resource._id} 
                        onClick={() => navigate(`/learning/${resource._id}`)}
                        className="bg-surface-container-lowest border border-surface-variant rounded-lg overflow-hidden shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col h-full cursor-pointer transition-all hover:border-[#D1C9C4] active:shadow-none active:translate-y-[1px]"
                      >
                        <div className="h-32 bg-surface-container-high relative">
                          <div className="absolute inset-0 p-sm flex items-start justify-end">
                            <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-1 rounded font-label-caps text-[10px]">Priority</span>
                          </div>
                        </div>
                        <div className="p-md flex flex-col flex-1">
                          <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs leading-tight line-clamp-2">{resource.title}</h4>
                          <p className="font-body-md text-body-md text-on-surface-variant mb-md line-clamp-2">{resource.description}</p>
                          <div className="mt-auto flex items-center justify-between text-on-surface-variant">
                            <span className="font-caption text-caption flex items-center gap-xs">
                              <Clock className="text-[16px]" /> {resource.durationMinutes || 60}m
                            </span>
                            <span className="font-caption text-caption capitalize">{(resource.difficulty || 'Intermediate').toLowerCase()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recommended for Your Gaps */}
              {recommendedResources.length > 0 && (
                <section>
                  <div className="flex items-center gap-sm mb-md mt-xl">
                    <Wrench className="text-secondary" />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Recommended for Your Gaps</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
                    {recommendedResources.map(resource => (
                      <div 
                        key={resource._id} 
                        onClick={() => navigate(`/learning/${resource._id}`)}
                        className="bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col cursor-pointer transition-all hover:border-[#D1C9C4] active:shadow-none active:translate-y-[1px]"
                      >
                        <div className="flex justify-between items-start mb-sm">
                          <span className="bg-surface-container text-on-surface px-2 py-1 rounded font-caption text-caption border border-surface-variant">
                            {resource.type}
                          </span>
                          <button className="text-on-surface-variant hover:text-primary" onClick={(e) => { e.stopPropagation(); }}>
                            <Bookmark />
                          </button>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs line-clamp-2">{resource.title}</h4>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-md flex-1 line-clamp-2">{resource.description}</p>
                        <div className="border-t border-surface-variant pt-sm flex justify-between items-center mt-auto">
                          <span className="font-caption text-caption text-on-surface-variant">{resource.provider || 'Self-Paced'}</span>
                          <button className="bg-primary text-on-primary px-3 py-1 rounded font-label-caps text-label-caps hover:bg-surface-tint transition-colors">Start</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
