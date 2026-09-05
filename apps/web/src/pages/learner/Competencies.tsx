import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { SkillGap } from '../../api/skillGaps';
import type { Assessment } from '../../api/assessments';
import { useAuth } from '../../contexts/AuthContext';
import { Target, TrendingUp } from 'lucide-react';


export const Competencies = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // For the profile, we use skill gaps which represent the user's current vs required levels
  const { data: gaps, error } = useSWR<SkillGap[]>('/skill-gaps', fetchClient);
  const { data: assessments } = useSWR<Assessment[]>('/assessments', fetchClient);

  const displayName = user?.email?.split('@')[0] || 'Learner';
  const roleName = user?.role === 'LEARNER' ? 'Official' : 'Administrator';

  // Map icons based on competency name keywords
  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('data') || n.includes('analysis')) return 'monitoring';
    if (n.includes('policy') || n.includes('drafting')) return 'description';
    if (n.includes('stakeholder') || n.includes('people')) return 'groups';
    if (n.includes('risk') || n.includes('security')) return 'warning';
    return 'target';
  };

  const getStatus = (current: number, required: number) => {
    if (current >= required) return { label: 'Verified', bg: 'bg-[#FCDCCC]', text: 'text-[#1A1614]' };
    return { label: 'In Progress', bg: 'bg-surface-variant', text: 'text-on-surface-variant' };
  };

  return (
    <div className="flex flex-col lg:flex-row gap-xl w-full animate-in fade-in duration-300">
      <style>
        {`
          .card-shadow { box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05); }
          .card-active { box-shadow: none; border-color: var(--tw-colors-outline-variant, #e2bfb5); }
        `}
      </style>
      
      {/* Left Sidebar / Overview */}
      <aside className="w-full lg:w-64 flex flex-col gap-lg shrink-0 mt-xl">
        <div className="bg-surface border border-surface-variant rounded-lg p-md card-shadow">
          <div className="w-full aspect-square rounded-md bg-surface-container flex items-center justify-center mb-md text-display-lg text-primary font-bold border border-outline-variant">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{displayName}</h2>
          <p className="font-body-md text-on-surface-variant">{roleName}</p>
          <div className="mt-md flex flex-wrap gap-sm">
            <span className="bg-[#FCDCCC] text-[#1A1614] font-label-caps px-sm py-xs rounded">Top Performer</span>
            <span className="bg-surface-variant text-on-surface-variant font-label-caps px-sm py-xs rounded">Verified</span>
          </div>
        </div>

        <div className="bg-surface border border-surface-variant rounded-lg p-md card-shadow">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-sm border-b border-surface-variant pb-xs">Priority Development</h3>
          <ul className="flex flex-col gap-sm">
            {gaps?.filter(g => g.currentLevel < g.requiredLevel).slice(0,3).map(gap => (
              <li key={gap._id} className="flex items-start gap-sm">
                <TrendingUp className="text-primary text-[18px] mt-xs shrink-0" />
                <div>
                  <p className="font-body-md font-semibold">{gap.competency.name}</p>
                  <p className="font-caption text-caption text-on-surface-variant">Target: Level {gap.requiredLevel}</p>
                </div>
              </li>
            ))}
            {(!gaps || gaps.filter(g => g.currentLevel < g.requiredLevel).length === 0) && (
              <li className="font-caption text-caption text-on-surface-variant">No priority gaps identified.</li>
            )}
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-xl lg:mt-xl">
        <header>
          <h1 className="font-display-lg text-display-lg text-on-surface">Competency Intelligence Profile</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Detailed breakdown of domain proficiency and verified strengths.</p>
        </header>

        {/* Domain Proficiency Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {error && <div className="col-span-2 p-4 text-error bg-error-container rounded">Failed to load profile data.</div>}
          {!gaps && !error && (
            <div className="col-span-2 text-on-surface-variant">Loading profile...</div>
          )}
          
          {gaps?.map((gap) => {
            const status = getStatus(gap.currentLevel, gap.requiredLevel);
            const progress = Math.min(100, Math.round((gap.currentLevel / gap.requiredLevel) * 100));
            const barColor = gap.currentLevel >= gap.requiredLevel ? 'bg-primary' : 'bg-secondary';
            const iconColor = gap.currentLevel >= gap.requiredLevel ? 'text-primary' : 'text-secondary';
            
            return (
              <div key={gap._id} className="bg-surface border border-surface-variant rounded-lg p-lg card-shadow hover:border-outline-variant transition-colors cursor-pointer active:card-active" onClick={() => navigate(`/competencies/${gap.competency._id}`)}>
                <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                    <Target className={iconColor} />
                    {gap.competency.name}
                  </h3>
                  <span className={`${status.bg} ${status.text} font-label-caps px-sm py-xs rounded`}>{status.label}</span>
                </div>
                <div className="flex flex-col gap-md">
                  <div>
                    <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-xs">
                      <span>Current: L{gap.currentLevel}</span>
                      <span>Target: L{gap.requiredLevel}</span>
                    </div>
                    <div className="w-full bg-surface-variant rounded-full h-2">
                      <div className={`${barColor} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <p className="font-body-md text-on-surface-variant line-clamp-2">
                    Proficiency evaluation for {gap.competency.name}. Target level is set based on role requirements.
                  </p>
                </div>
              </div>
            );
          })}
          
          {gaps?.length === 0 && (
            <div className="col-span-2 text-on-surface-variant py-8 text-center bg-surface-container rounded-lg border border-outline-variant">
              No competency data found for your profile.
            </div>
          )}
        </section>

        {/* Historical Timeline */}
        <section className="bg-surface border border-surface-variant rounded-lg p-lg card-shadow">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md border-b border-surface-variant pb-sm">Assessment History</h2>
          <div className="flex flex-col gap-md border-l-2 border-surface-variant ml-sm pl-md">
            
            {assessments && assessments.length > 0 ? (
              assessments.map((assessment, idx) => (
                <div key={assessment._id || idx} className="relative">
                  <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-2 border-surface ${idx === 0 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                  <p className="font-caption text-caption text-on-surface-variant">{idx === 0 ? 'Recent' : 'Historical'}</p>
                  <p className="font-body-md font-semibold text-on-surface">{assessment.title}</p>
                  <p className="font-body-md text-on-surface-variant">{assessment.description}</p>
                </div>
              ))
            ) : (
              <div className="text-on-surface-variant font-body-md">No assessment history available.</div>
            )}
            
          </div>
        </section>

      </div>
    </div>
  );
};

