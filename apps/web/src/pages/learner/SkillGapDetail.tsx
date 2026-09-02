import React from 'react';
import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { SkillGap } from '../../api/skillGaps';
import { ArrowLeft, BadgeCheck, BookOpen, CheckCircle, Circle, Clock, LineChart, UserSearch, Users, Wrench } from 'lucide-react';


export const SkillGapDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: gap, error, isLoading } = useSWR<SkillGap>(id ? `/skill-gaps/${id}` : null, fetchClient);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-screen-2xl mx-auto animate-pulse px-lg py-xl">
        <div className="h-8 bg-surface-variant rounded w-1/4"></div>
        <div className="h-16 bg-surface-variant rounded w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="col-span-8 h-64 bg-surface-variant rounded"></div>
          <div className="col-span-4 h-64 bg-surface-variant rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !gap) return <div className="text-error p-4 bg-error-container rounded m-lg">Failed to load skill gap resolution strategy.</div>;

  return (
    <div className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col gap-xl py-xl animate-in fade-in duration-300">
      {/* Header Section */}
      <section className="flex flex-col gap-sm">
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => navigate('/skill-gaps')}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center"
          >
            <ArrowLeft className="text-body-lg" />
            <span className="ml-xs">Back to Skills</span>
          </button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-background mb-xs">{gap.competency.name}</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
              Strategic learning path to bridge the capability gap from Level {gap.currentLevel} to Level {gap.requiredLevel} for your role requirements.
            </p>
          </div>
          <div className="flex gap-sm">
            <span className="bg-surface-container px-md py-sm rounded-lg font-label-caps text-label-caps text-on-surface-variant border border-outline-variant flex items-center gap-xs">
              <Clock className="text-[16px]" />
              IN PROGRESS
            </span>
            <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-colors shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
              UPDATE STATUS
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
        {/* Left Column: Strategy & Why it Matters (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-xl">
          {/* Why it matters */}
          <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-[#D1C9C4] transition-all">
            <div className="border-b border-surface-variant pb-md mb-md flex items-center gap-sm">
              <LineChart className="text-primary" />
              <h2 className="font-headline-sm text-headline-sm text-on-background">Why It Matters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="flex flex-col gap-sm">
                <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Organizational Impact</h3>
                <p className="text-on-surface">Mastery of this competency directly supports strategic departmental goals and operational excellence.</p>
              </div>
              <div className="flex flex-col gap-sm">
                <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Role Relevance</h3>
                <p className="text-on-surface">Required capability for progression. Currently identified as a critical dependency for your assigned projects.</p>
              </div>
            </div>
          </section>

          {/* Evidence Required Checklist */}
          <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-[#D1C9C4] transition-all">
            <div className="border-b border-surface-variant pb-md mb-md flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <BadgeCheck className="text-primary" />
                <h2 className="font-headline-sm text-headline-sm text-on-background">Evidence Required</h2>
              </div>
              <span className="font-caption text-caption text-on-surface-variant">1 of 3 Completed</span>
            </div>
            
            <div className="flex flex-col">
              {/* Checklist Item 1 (Completed) */}
              <div className="flex items-start gap-md py-md border-b border-surface-container-high">
                <div className="mt-xs text-primary">
                  <CheckCircle />
                </div>
                <div className="flex-1">
                  <h4 className="font-body-lg text-body-lg text-on-background font-semibold">Foundational Training Module</h4>
                  <p className="font-caption text-caption text-on-surface-variant mt-xs">Completed via corporate training portal on Oct 12, 2023.</p>
                </div>
              </div>
              
              {/* Checklist Item 2 */}
              <div className="flex items-start gap-md py-md border-b border-surface-container-high">
                <div className="mt-xs text-outline">
                  <Circle />
                </div>
                <div className="flex-1">
                  <h4 className="font-body-lg text-body-lg text-on-background font-semibold">Practical Application Project</h4>
                  <p className="font-caption text-caption text-on-surface-variant mt-xs">Submit a fully documented project demonstrating applied capability in this area.</p>
                  <button className="mt-md px-md py-xs border border-primary text-primary rounded-lg font-label-caps text-label-caps hover:bg-surface-container-low transition-colors">
                    UPLOAD ARTIFACT
                  </button>
                </div>
              </div>
              
              {/* Checklist Item 3 */}
              <div className="flex items-start gap-md py-md">
                <div className="mt-xs text-outline">
                  <Circle />
                </div>
                <div className="flex-1">
                  <h4 className="font-body-lg text-body-lg text-on-background font-semibold">Peer Review Assessment</h4>
                  <p className="font-caption text-caption text-on-surface-variant mt-xs">Present the submitted artifact to your supervisor and successfully defend decisions.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Metrics & Planning (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-xl">
          {/* Estimated Effort */}
          <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-[#D1C9C4] transition-all">
            <div className="border-b border-surface-variant pb-md mb-md flex items-center gap-sm">
              <Clock className="text-primary" />
              <h2 className="font-headline-sm text-headline-sm text-on-background">Estimated Effort</h2>
            </div>
            <div className="mb-lg">
              <div className="font-display-lg text-display-lg text-on-background mb-xs">80 <span className="font-body-lg text-body-lg text-on-surface-variant font-normal">hrs total</span></div>
              <div className="w-full bg-surface-container-high rounded-full h-2 mt-sm overflow-hidden">
                <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <p className="font-caption text-caption text-on-surface-variant mt-sm text-right">~28 hrs completed</p>
            </div>
            <div className="flex flex-col gap-sm">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase border-b border-surface-container-high pb-xs">Breakdown</h3>
              <div className="flex justify-between items-center py-xs">
                <span className="text-on-surface flex items-center gap-xs">
                  <BookOpen className="text-[16px] text-outline" /> Formal Training
                </span>
                <span className="font-semibold text-on-background">40 hrs</span>
              </div>
              <div className="flex justify-between items-center py-xs">
                <span className="text-on-surface flex items-center gap-xs">
                  <Wrench className="text-[16px] text-outline" /> Applied Project
                </span>
                <span className="font-semibold text-on-background">30 hrs</span>
              </div>
              <div className="flex justify-between items-center py-xs">
                <span className="text-on-surface flex items-center gap-xs">
                  <Users className="text-[16px] text-outline" /> Mentorship/Review
                </span>
                <span className="font-semibold text-on-background">10 hrs</span>
              </div>
            </div>
          </section>
          
          {/* Resource Link */}
          <section className="bg-surface-container-low border border-surface-variant rounded-xl p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
            <h3 className="font-headline-sm text-headline-sm text-on-background mb-sm">Need Guidance?</h3>
            <p className="font-caption text-caption text-on-surface-variant mb-md">Connect with a senior official who has already mastered this competency.</p>
            <button className="w-full bg-transparent border border-primary text-primary px-lg py-sm rounded-lg font-label-caps text-label-caps hover:bg-surface-container transition-colors flex justify-center items-center gap-sm">
              <UserSearch className="text-[18px]" />
              FIND MENTOR
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
