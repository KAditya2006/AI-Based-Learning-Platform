import { Eye, AlertTriangle, TrendingUp } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { SkillGap } from '../../api/skillGaps';

export const SkillGaps = () => {
  const navigate = useNavigate();
  const { data: gaps, error } = useSWR<SkillGap[]>('/skill-gaps', fetchClient);

  if (error) {
    return <div className="p-4 bg-error-container text-error rounded-lg">Failed to load skill gaps.</div>;
  }

  if (!gaps) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-body-md text-on-surface-variant">Loading analysis...</p>
        </div>
      </div>
    );
  }

  const activeGapsCount = gaps.filter(g => g.gapSize > 0).length;
  
  const totalRequired = gaps.reduce((acc, curr) => acc + curr.requiredLevel, 0);
  const totalCurrent = gaps.reduce((acc, curr) => acc + curr.currentLevel, 0);
  const alignment = totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : 100;

  const totalAssessed = gaps.length;

  return (
    <div className="flex-grow w-full max-w-screen-2xl mx-auto py-xl flex flex-col gap-xl animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="flex flex-col gap-sm">
        <h1 className="font-display-lg text-display-lg text-on-surface">Prioritized Skill Gap Analysis</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Review critical readiness gaps and align your proficiency with required institutional standards.</p>
      </header>

      {/* Top-level Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Critical Readiness Gaps</span>
          <div className="flex items-end gap-sm">
            <span className="font-display-lg text-display-lg text-error">{activeGapsCount}</span>
            <span className="font-body-md text-body-md text-on-surface-variant mb-1">High priority</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Overall Proficiency Alignment</span>
          <div className="flex items-end gap-sm">
            <span className="font-display-lg text-display-lg text-on-surface">{alignment}%</span>
            <span className="font-body-md text-body-md text-on-surface-variant mb-1">Target: 100%</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col gap-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant">Total Assessed Skills</span>
          <div className="flex items-end gap-sm">
            <span className="font-display-lg text-display-lg text-on-surface">{totalAssessed}</span>
            <span className="font-body-md text-body-md text-on-surface-variant mb-1">Competencies</span>
          </div>
        </div>
      </section>

      {/* Main Content Area: Multi-column Layout */}
      <div className="flex flex-col lg:flex-row gap-xl items-start">
        {/* Left Column: Filter/Context */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-lg bg-surface-container-lowest border border-outline-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          <h2 className="font-headline-sm text-headline-sm border-b border-outline-variant pb-sm">Filters</h2>
          <div className="flex flex-col gap-sm">
            <label className="font-label-caps text-label-caps text-on-surface-variant">Domain</label>
            <select className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm font-body-md focus:border-primary focus:ring-2 focus:ring-primary-fixed focus:outline-none">
              <option>All Domains</option>
              <option>Data Analysis</option>
              <option>Policy Formulation</option>
            </select>
          </div>
          <div className="flex flex-col gap-sm">
            <label className="font-label-caps text-label-caps text-on-surface-variant">Priority Level</label>
            <div className="flex flex-col gap-xs">
              <label className="flex items-center gap-sm font-body-md cursor-pointer">
                <input defaultChecked className="text-primary rounded border-outline-variant focus:ring-primary-fixed" type="checkbox" /> High
              </label>
              <label className="flex items-center gap-sm font-body-md cursor-pointer">
                <input defaultChecked className="text-primary rounded border-outline-variant focus:ring-primary-fixed" type="checkbox" /> Moderate
              </label>
              <label className="flex items-center gap-sm font-body-md cursor-pointer">
                <input defaultChecked className="text-primary rounded border-outline-variant focus:ring-primary-fixed" type="checkbox" /> Monitoring
              </label>
            </div>
          </div>
        </aside>

        {/* Right Column: Prioritized Gaps List */}
        <section className="flex-grow flex flex-col gap-md w-full">
          {gaps.length === 0 && (
            <div className="p-8 text-center bg-surface-container rounded-lg border border-surface-variant">
              <p className="text-on-surface-variant">You have no assessed skills yet.</p>
            </div>
          )}

          {gaps.sort((a, b) => b.gapSize - a.gapSize).map(gap => {
            let priorityType = 'MONITORING';
            let articleClass = 'border-outline-variant';
            let headerBg = '';
            let iconColor = 'text-on-surface-variant';
            let IconComponent: any = Eye;
            let badgeClass = 'bg-surface-variant text-on-surface-variant';

            if (gap.gapSize >= 2) {
              priorityType = 'HIGH PRIORITY';
              headerBg = 'bg-error-container bg-opacity-20';
              iconColor = 'text-error icon-fill';
              IconComponent = AlertTriangle;
              badgeClass = 'bg-error text-on-error';
            } else if (gap.gapSize === 1) {
              priorityType = 'MODERATE PRIORITY';
              headerBg = 'bg-secondary-container bg-opacity-10';
              iconColor = 'text-secondary';
              IconComponent = TrendingUp;
              badgeClass = 'bg-secondary-container text-on-secondary-container';
            }

            return (
              <article key={gap._id} className={`bg-surface-container-lowest border ${articleClass} rounded-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] overflow-hidden`}>
                <div className={`border-b border-outline-variant p-md ${headerBg} flex justify-between items-center`}>
                  <div className="flex items-center gap-sm">
                    <IconComponent className={iconColor} />
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{gap.competency.name}</h3>
                  </div>
                  <span className={`font-label-caps text-label-caps px-sm py-xs rounded ${badgeClass}`}>
                    {priorityType}
                  </span>
                </div>
                
                <div className="p-md flex flex-col md:flex-row gap-lg justify-between items-start md:items-center">
                  <div className="flex-grow grid grid-cols-2 gap-md w-full md:w-auto">
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Current Level</span>
                      <span className="font-body-lg text-body-lg font-semibold">Level {gap.currentLevel}</span>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Required Level</span>
                      <span className="font-body-lg text-body-lg font-semibold">Level {gap.requiredLevel}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-sm w-full md:w-auto">
                    {gap.gapSize > 0 ? (
                      <>
                        <button 
                          onClick={() => navigate(`/skill-gaps/${gap._id}`)}
                          className="flex-1 md:flex-none bg-surface-container-lowest border border-primary text-primary font-label-caps text-label-caps px-md py-sm rounded hover:bg-surface-container-low transition-colors"
                        >
                          View Gap Details
                        </button>
                        <button 
                          onClick={() => navigate('/learning')}
                          className="flex-1 md:flex-none bg-primary text-on-primary font-label-caps text-label-caps px-md py-sm rounded hover:bg-surface-tint transition-colors"
                        >
                          Find Training
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => navigate(`/skill-gaps/${gap._id}`)}
                        className="flex-1 md:flex-none text-primary font-label-caps text-label-caps px-md py-sm rounded hover:bg-surface-container-low transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};


