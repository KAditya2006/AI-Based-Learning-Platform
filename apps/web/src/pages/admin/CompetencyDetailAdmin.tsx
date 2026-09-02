import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import type { Competency } from '../../api/competencies';
import { AlertTriangle, ArrowLeft, Brain, FileText, GraduationCap, Route, Users } from 'lucide-react';


export const CompetencyDetailAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: competency, error, isLoading } = useSWR<Competency>(id && id !== 'new' ? `/competencies/${id}` : null, fetchClient);

  return (
    <div className="flex-grow p-container-margin md:p-xl max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-lg font-body-md text-on-surface bg-surface min-h-screen animate-in fade-in duration-300">
      {/* Header Section (Full Width) */}
      <header className="col-span-1 lg:col-span-12 mb-lg flex flex-col md:flex-row justify-between items-start md:items-end border-b border-surface-variant pb-md gap-md mt-sm">
        <div>
          <button 
            onClick={() => navigate('/admin/competencies')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors font-label-caps text-label-caps uppercase tracking-wider mb-sm cursor-pointer"
          >
            <ArrowLeft className="text-[16px]" /> Back to Framework
          </button>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-xs">Competency Depth Analysis</span>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">{competency?.name || 'Predictive Policy Modeling'}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">{competency?.description || 'Advanced statistical techniques and machine learning models applied to forecast socioeconomic outcomes of proposed legislative frameworks.'}</p>
        </div>
        <div className="mt-md md:mt-0 flex gap-sm">
          <button className="bg-surface-container-lowest border border-primary text-primary px-lg py-sm rounded-lg font-label-caps text-label-caps hover:bg-surface-container-low transition-colors shadow-sm uppercase">Compare Roles</button>
          <button className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-colors shadow-sm uppercase">Request Assessment</button>
        </div>
      </header>

      {/* Left Column: Core Data */}
      <div className="col-span-1 lg:col-span-8 flex flex-col gap-lg">
        {/* Alert Banner */}
        <div className="bg-error-container border-l-4 border-error p-md rounded-r-lg flex items-start gap-md">
          <AlertTriangle className="text-error mt-xs" />
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-error-container mb-xs">Skill Gap Identified</h3>
            <p className="font-body-md text-body-md text-on-error-container">Organizational proficiency in 'Algorithmic Bias Mitigation' within this competency is below the target required for the upcoming national release.</p>
          </div>
        </div>

        {/* Visualization: Current vs Target */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md border-b border-surface-variant pb-sm">Proficiency Index</h2>
          <div className="relative h-64 w-full flex items-end justify-around pb-xl">
            {/* Y Axis Labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-on-surface-variant font-caption text-caption pb-xl pointer-events-none">
              <span>Expert (5)</span>
              <span>Advanced (4)</span>
              <span>Intermediate (3)</span>
              <span>Foundational (2)</span>
              <span>Novice (1)</span>
            </div>
            
            {/* Bars */}
            <div className="flex flex-col items-center group w-1/5 ml-xl">
              <div className="relative w-full h-48 bg-surface-container rounded-t-sm flex items-end">
                <div className="w-full bg-primary-fixed-dim rounded-t-sm opacity-50 absolute bottom-0 border-t-2 border-dashed border-primary" style={{ height: '80%' }} title="Target: 4"></div>
                <div className="w-full bg-primary rounded-t-sm relative z-10 hover:opacity-90 transition-opacity cursor-pointer" style={{ height: '60%' }} title="Current: 3"></div>
              </div>
              <span className="font-label-caps text-label-caps text-center mt-sm">Data Structuring</span>
            </div>

            <div className="flex flex-col items-center group w-1/5">
              <div className="relative w-full h-48 bg-surface-container rounded-t-sm flex items-end">
                <div className="w-full bg-primary-fixed-dim rounded-t-sm opacity-50 absolute bottom-0 border-t-2 border-dashed border-primary" style={{ height: '100%' }} title="Target: 5"></div>
                <div className="w-full bg-primary rounded-t-sm relative z-10 hover:opacity-90 transition-opacity cursor-pointer" style={{ height: '80%' }} title="Current: 4"></div>
              </div>
              <span className="font-label-caps text-label-caps text-center mt-sm">Statistical Simulation</span>
            </div>

            <div className="flex flex-col items-center group w-1/5">
              <div className="relative w-full h-48 bg-surface-container rounded-t-sm flex items-end">
                <div className="w-full bg-primary-fixed-dim rounded-t-sm opacity-50 absolute bottom-0 border-t-2 border-dashed border-primary" style={{ height: '80%' }} title="Target: 4"></div>
                <div className="w-full bg-error rounded-t-sm relative z-10 hover:opacity-90 transition-opacity cursor-pointer" style={{ height: '40%' }} title="Current: 2 (Gap)"></div>
              </div>
              <span className="font-label-caps text-label-caps text-center mt-sm text-error font-semibold">Bias Mitigation</span>
            </div>

            <div className="flex flex-col items-center group w-1/5">
              <div className="relative w-full h-48 bg-surface-container rounded-t-sm flex items-end">
                <div className="w-full bg-primary-fixed-dim rounded-t-sm opacity-50 absolute bottom-0 border-t-2 border-dashed border-primary" style={{ height: '60%' }} title="Target: 3"></div>
                <div className="w-full bg-primary rounded-t-sm relative z-10 hover:opacity-90 transition-opacity cursor-pointer" style={{ height: '60%' }} title="Current: 3"></div>
              </div>
              <span className="font-label-caps text-label-caps text-center mt-sm">Impact Reporting</span>
            </div>
          </div>

          <div className="flex justify-center gap-lg mt-md pt-md border-t border-surface-variant font-caption text-caption text-on-surface-variant">
            <div className="flex items-center gap-xs"><div className="w-3 h-3 bg-primary rounded-sm"></div> Current Level</div>
            <div className="flex items-center gap-xs"><div className="w-3 h-3 bg-primary-fixed-dim border border-primary border-dashed rounded-sm"></div> Target Level</div>
            <div className="flex items-center gap-xs"><div className="w-3 h-3 bg-error rounded-sm"></div> Critical Gap</div>
          </div>
        </div>

        {/* Supporting Evidence */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md border-b border-surface-variant pb-sm">Supporting Evidence</h2>
          <div className="space-y-md">
            <div className="flex justify-between items-center p-md bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
              <div className="flex items-start gap-md">
                <div className="p-sm bg-tertiary-fixed text-on-tertiary-fixed rounded-lg mt-xs">
                  <GraduationCap />
                </div>
                <div>
                  <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Advanced Causal Inference Certification</h4>
                  <p className="font-caption text-caption text-on-surface-variant">Official Training Course • Issued Oct 2023</p>
                </div>
              </div>
              <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded font-label-caps text-label-caps uppercase">Verified</span>
            </div>
            
            <div className="flex justify-between items-center p-md bg-surface-container-low rounded-lg hover:bg-surface-container transition-colors">
              <div className="flex items-start gap-md">
                <div className="p-sm bg-secondary-fixed text-on-secondary-fixed rounded-lg mt-xs">
                  <FileText />
                </div>
                <div>
                  <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">National Statistics Impact Study (Q3)</h4>
                  <p className="font-caption text-caption text-on-surface-variant">Project Deliverable • Peer Reviewed by Directorate</p>
                </div>
              </div>
              <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-xs rounded font-label-caps text-label-caps uppercase">Applied Skill</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Actions & Context */}
      <div className="col-span-1 lg:col-span-4 flex flex-col gap-lg">
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-lg shadow-sm">
          <div className="flex items-center gap-sm mb-md border-b border-surface-variant pb-sm">
            <Route className="text-primary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Path to Mastery</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-md">Recommended actions to close identified gaps and reach Level 4 proficiency across all domains.</p>
          <div className="space-y-sm">
            <div className="p-sm border border-outline-variant rounded-lg flex items-start gap-sm hover:border-primary transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-md flex-shrink-0 text-primary">
                <Brain />
              </div>
              <div>
                <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary">Ethics in Predictive Analytics</h4>
                <p className="font-caption text-caption text-on-surface-variant">Internal Course • 4 Hours</p>
              </div>
            </div>
            <div className="p-sm border border-outline-variant rounded-lg flex items-start gap-sm hover:border-primary transition-colors cursor-pointer group">
              <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-md flex-shrink-0 text-on-surface-variant">
                <Users />
              </div>
              <div>
                <h4 className="font-body-md text-body-md font-semibold text-on-surface group-hover:text-primary">Peer Review Network</h4>
                <p className="font-caption text-caption text-on-surface-variant">Cross-Agency Advisory Session</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-md text-primary font-label-caps text-label-caps hover:bg-surface-container-low py-sm rounded transition-colors uppercase">View Full Pathway</button>
        </div>
      </div>
    </div>
  );
};
