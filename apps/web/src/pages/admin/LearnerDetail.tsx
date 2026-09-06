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

  const memberName = (member.profile?.firstName ? `${member.profile.firstName} ${member.profile.lastName || ''}`.trim() : member.name) || 'Official';
  const memberId = member._id || member.id || id || '';
  const memberDept = member.profile?.departmentName || 'General';
  const memberRole = member.profile?.designationName || member.role || 'Officer';
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
                  <Lock className="text-[14px]" /> {(member as any)?.role === 'ADMIN' ? 'Tier 4 Admin' : 'Tier 2 Learner'}
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
              <span className="text-on-surface-variant">Overall Status</span>
              <span className="font-bold text-primary">{(member as any)?.status || 'ACTIVE'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Email Verified</span>
              <span className="font-bold text-on-surface">{(member as any)?.emailVerified ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-on-surface-variant">Onboarding</span>
              <span className="font-bold text-on-surface">{(member as any)?.profile?.onboardingStatus || 'NOT_STARTED'}</span>
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
              {/* Skills/Competencies */}
              <div className="surface-level-1 rounded-xl p-lg space-y-md">
                <div className="flex justify-between items-center mb-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Self-Reported Skills</h3>
                </div>
                {((member as any)?.profile?.skills || []).length > 0 ? (
                  <div className="space-y-md">
                    {((member as any).profile.skills).map((skill: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1 font-body-md">
                          <span className="font-medium text-on-surface">{skill.skill}</span>
                          <span className="font-bold text-primary">{skill.proficiency}</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2">
                          <div className={`bg-primary h-2 rounded-full`} style={{ width: skill.proficiency === 'Expert' ? '100%' : skill.proficiency === 'Advanced' ? '75%' : skill.proficiency === 'Intermediate' ? '50%' : '25%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-on-surface-variant py-lg">No self-reported skills found.</div>
                )}
              </div>

              {/* Specializations & Badges */}
              <div className="surface-level-1 rounded-xl p-lg">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Verified Specializations</h3>
                <div className="text-center text-on-surface-variant py-lg">
                  No verified specializations yet.
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
