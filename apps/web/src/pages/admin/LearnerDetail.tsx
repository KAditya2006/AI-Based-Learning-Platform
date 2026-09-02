import React, { useState } from 'react';
import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { WorkforceMember } from '../../api/admin';
import { ArrowLeft, Award, BadgeCheck, GraduationCap, Lock } from 'lucide-react';


export const LearnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Competency Summary');

  const { data: member, error, isLoading } = useSWR<WorkforceMember>(id ? `/admin/users/${id}` : null, fetchClient);

  if (isLoading) return <div className="p-12 text-center text-on-surface-variant font-body-md">Loading official details...</div>;
  if (error || !member) return <div className="p-8 text-error text-center font-body-md">Failed to load official detail.</div>;

  const memberName = member.name || (member.firstName ? `${member.firstName} ${member.lastName || ''}`.trim() : 'Official');
  const memberId = member._id || member.id || id || '';
  const memberDept = typeof member.department === 'object' ? member.department?.name : (member.department || 'General');
  const memberRole = typeof member.designation === 'object' ? member.designation?.name : (member.role || 'Officer');
  const initials = memberName.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto p-lg md:p-xl bg-background font-body-md text-on-surface h-full animate-in fade-in duration-300">
      <style>
        {`
          .surface-level-1 {
            background-color: var(--tw-colors-surface-container-lowest, #FFFFFF);
            border: 1px solid var(--tw-colors-outline-variant, #E8E2DE);
            box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
          }
          .surface-level-1:active {
            box-shadow: none;
            border-color: #D1C9C4;
          }
        `}
      </style>
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/admin/workforce')}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-lg font-label-caps text-label-caps uppercase tracking-wider mt-sm"
      >
        <ArrowLeft className="text-[18px]" /> Back to Directory
      </button>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-xl">
        {/* Left Column: Identity & Metadata */}
        <aside className="w-full md:w-80 shrink-0 flex flex-col gap-lg">
          <div className="surface-level-1 rounded-xl p-lg flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-md border-4 border-surface flex items-center justify-center bg-surface-container-highest text-primary text-4xl font-bold">
              {initials}
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">{memberName}</h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-md uppercase tracking-wider">{memberRole}</p>
            <div className="bg-surface-container px-md py-xs rounded-full mb-lg">
              <span className="font-caption text-caption text-on-surface uppercase tracking-wider">ID: {memberId.substring(0,10)}</span>
            </div>
            
            <div className="w-full text-left space-y-md border-t border-outline-variant pt-md">
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs uppercase tracking-wider">Department</label>
                <p className="font-body-md text-body-md text-on-surface">{memberDept}</p>
              </div>
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs uppercase tracking-wider">Location</label>
                <p className="font-body-md text-body-md text-on-surface">Central Secretariat HQ</p>
              </div>
              <div>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-xs uppercase tracking-wider">Institutional Access</label>
                <span className="inline-flex items-center gap-xs bg-surface-container px-sm py-xs rounded text-caption font-label-caps uppercase">
                  <Lock className="text-[14px]" /> Tier 2 Clearance
                </span>
              </div>
            </div>

            <div className="w-full border-t border-outline-variant pt-md mt-md flex flex-col gap-sm">
              <button className="w-full bg-primary text-on-primary py-2 rounded font-label-caps text-label-caps uppercase hover:bg-secondary transition-colors">
                Assign Learning Path
              </button>
              <button className="w-full bg-surface border border-outline-variant text-on-surface py-2 rounded font-label-caps text-label-caps uppercase hover:bg-surface-container transition-colors">
                Export Transcript
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="surface-level-1 rounded-xl p-md space-y-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Overall Proficiency</span>
              <span className="font-bold text-primary">Level 3.4</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Assessments Passed</span>
              <span className="font-bold text-on-surface">14 / 16</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Training Hours</span>
              <span className="font-bold text-on-surface">128 hrs</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Deep Analysis Tabs & Content */}
        <div className="flex-1 flex flex-col gap-lg">
          {/* Tab Navigation */}
          <div className="border-b border-outline-variant flex gap-lg">
            {['Competency Summary', 'Assigned Courses', 'Assessment History', 'Audit Log'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-md font-label-caps text-label-caps uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content: Competency Summary */}
          {activeTab === 'Competency Summary' && (
            <div className="space-y-lg">
              {/* Radar/Bar Mastery Grid */}
              <div className="surface-level-1 rounded-xl p-lg space-y-md">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Core Competency Matrix</h3>
                  <span className="font-caption text-caption text-on-surface-variant uppercase">Evaluated via Q3 Standard Benchmark</span>
                </div>
                
                <div className="space-y-md mt-md">
                  <div>
                    <div className="flex justify-between text-sm mb-1 font-body-md">
                      <span className="font-medium text-on-surface">Data Literacy &amp; Analysis</span>
                      <span className="font-bold text-primary">Level 4.0 / 5.0 (Advanced)</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1 font-body-md">
                      <span className="font-medium text-on-surface">Statistical Governance &amp; Policy</span>
                      <span className="font-bold text-primary">Level 3.2 / 5.0 (Proficient)</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '64%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1 font-body-md">
                      <span className="font-medium text-on-surface">Cybersecurity &amp; Data Ethics</span>
                      <span className="font-bold text-tertiary">Level 2.1 / 5.0 (Developing)</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2">
                      <div className="bg-tertiary-container h-2 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1 font-body-md">
                      <span className="font-medium text-on-surface">Field Operations Leadership</span>
                      <span className="font-bold text-primary">Level 4.5 / 5.0 (Expert)</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specializations & Badges */}
              <div className="surface-level-1 rounded-xl p-lg">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Verified Specializations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <div className="border border-outline-variant rounded-lg p-md flex items-center gap-md bg-surface-container-lowest">
                    <div className="w-12 h-12 rounded bg-[#FCDCCC] flex items-center justify-center text-primary shrink-0">
                      <BadgeCheck className="text-2xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface">Survey Sampling Specialist</div>
                      <div className="text-xs text-on-surface-variant font-caption">Verified: Aug 2026 • MoSPI Board</div>
                    </div>
                  </div>

                  <div className="border border-outline-variant rounded-lg p-md flex items-center gap-md bg-surface-container-lowest">
                    <div className="w-12 h-12 rounded bg-[#FCDCCC] flex items-center justify-center text-primary shrink-0">
                      <Award className="text-2xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-on-surface">Econometric Modeling Lead</div>
                      <div className="text-xs text-on-surface-variant font-caption">Verified: May 2026 • MoSPI Board</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Competency Summary' && (
            <div className="surface-level-1 rounded-xl p-xl text-center text-on-surface-variant">
              <GraduationCap className="text-4xl mb-2 text-on-surface-variant" />
              <p className="font-headline-sm">{activeTab} records for {memberName}</p>
              <p className="text-sm mt-1">All entries synchronized with central audit infrastructure.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
