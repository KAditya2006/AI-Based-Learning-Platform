import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertTriangle, FileText, TrendingUp, Users } from 'lucide-react';


export const CompetencyInsights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.email?.split('@')[0] || 'Official';
  const role = user?.role === 'admin' ? 'System Administrator' : 'Senior Policy Analyst';

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full mx-auto gap-xl animate-in fade-in duration-300 min-h-screen">
      {/* Left Sidebar / Overview */}
      <aside className="w-64 hidden lg:flex flex-col gap-lg">
        <div className="bg-surface border border-surface-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          <img 
            className="w-full aspect-square rounded-md object-cover mb-md" 
            alt="Learner Profile Avatar" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS1ECGb9FJApE-YYTpHZltwD5cqu0I1WTT5mjnhHUy3YZpZY20q_6_SdLq-YtYHxT5RFatPMoEpEfeO5GjtWwW4bjTjowPzy5dNbuFKNa88qd1uGq1xz9X1erZMXHJfq4JFviDnQY5TVweBVM0GRvEZihL0Hx9vkSlx7exiSFIPMRaEN5-DHm2TBmT_2v9XLXZW4Opjra9Cv8Dsr2mNqxKEEVTpTDPmPl4y7eGysRNxUnY73j8Z2m2Bg"
          />
          <h2 className="font-headline-sm text-headline-sm text-on-surface capitalize">{displayName}</h2>
          <p className="font-body-md text-on-surface-variant">{role}</p>
          <div className="mt-md flex flex-wrap gap-sm">
            <span className="bg-[#FCDCCC] text-[#1A1614] font-label-caps text-label-caps px-sm py-xs rounded">Data Pro</span>
            <span className="bg-surface-variant text-on-surface-variant font-label-caps text-label-caps px-sm py-xs rounded">Top 10%</span>
          </div>
        </div>
        
        <div className="bg-surface border border-surface-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-sm border-b border-surface-variant pb-xs">Priority Development</h3>
          <ul className="flex flex-col gap-sm">
            <li className="flex items-start gap-sm">
              <TrendingUp className="text-primary text-[18px] mt-xs" />
              <div>
                <p className="font-body-md text-body-md font-semibold text-on-surface">Stakeholder Mgmt</p>
                <p className="font-caption text-caption text-on-surface-variant">Target: Level 4</p>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-xl">
        <header>
          <h1 className="font-display-lg text-display-lg text-on-surface">Competency Intelligence Profile</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Detailed breakdown of domain proficiency and verified strengths.</p>
        </header>

        {/* Domain Proficiency Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Skill Card 1 */}
          <div className="bg-surface border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-[#D1C9C4] transition-colors">
            <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <Activity className="text-primary" />
                Data Analysis
              </h3>
              <span className="bg-[#FCDCCC] text-[#1A1614] font-label-caps text-label-caps px-sm py-xs rounded">Verified</span>
            </div>
            <div className="flex flex-col gap-md">
              <div>
                <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-xs">
                  <span>Current: L4</span>
                  <span>Target: L5</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Demonstrates advanced capability in statistical modeling and interpreting complex datasets for policy implications.</p>
            </div>
          </div>

          {/* Skill Card 2 */}
          <div className="bg-surface border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-[#D1C9C4] transition-colors">
            <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <FileText className="text-primary" />
                Policy Formulation
              </h3>
              <span className="bg-[#FCDCCC] text-[#1A1614] font-label-caps text-label-caps px-sm py-xs rounded">Verified</span>
            </div>
            <div className="flex flex-col gap-md">
              <div>
                <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-xs">
                  <span>Current: L5</span>
                  <span>Target: L5</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Expert level in drafting and reviewing comprehensive policy documents aligned with organizational strategy.</p>
            </div>
          </div>

          {/* Skill Card 3 */}
          <div className="bg-surface border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-[#D1C9C4] transition-colors">
            <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <Users className="text-secondary" />
                Stakeholder Mgmt
              </h3>
              <span className="bg-surface-variant text-on-surface-variant font-label-caps text-label-caps px-sm py-xs rounded">In Progress</span>
            </div>
            <div className="flex flex-col gap-md">
              <div>
                <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-xs">
                  <span>Current: L2</span>
                  <span>Target: L4</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Requires further development in managing competing interests among external partners.</p>
            </div>
          </div>

          {/* Skill Card 4 */}
          <div className="bg-surface border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] hover:border-[#D1C9C4] transition-colors">
            <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                <AlertTriangle className="text-primary" />
                Risk Assessment
              </h3>
              <span className="bg-[#FCDCCC] text-[#1A1614] font-label-caps text-label-caps px-sm py-xs rounded">Verified</span>
            </div>
            <div className="flex flex-col gap-md">
              <div>
                <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-xs">
                  <span>Current: L3</span>
                  <span>Target: L4</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Competent in identifying and mitigating project-level risks using standard frameworks.</p>
            </div>
          </div>
        </section>

        {/* Historical Timeline */}
        <section className="bg-surface border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md border-b border-surface-variant pb-sm">Assessment History</h2>
          <div className="flex flex-col gap-md border-l-2 border-surface-variant ml-sm pl-md">
            <div className="relative">
              <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-surface"></div>
              <p className="font-caption text-caption text-on-surface-variant">Q3 2023</p>
              <p className="font-body-md text-body-md font-semibold text-on-surface">Data Analysis Certification Completed</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Achieved Level 4 proficiency via standardized organizational assessment.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-surface-variant border-2 border-surface"></div>
              <p className="font-caption text-caption text-on-surface-variant">Q1 2023</p>
              <p className="font-body-md text-body-md font-semibold text-on-surface">Initial Benchmark Assessment</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Established baseline for core competencies.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
