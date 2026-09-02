import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Award, Badge, Building2, CheckCircle, Download, Flag, Pencil, Radar } from 'lucide-react';


export const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const displayName = user?.email?.split('@')[0] || 'Official';
  const role = user?.role === 'admin' ? 'System Administrator' : 'Senior Statistician';

  return (
    <div className="pt-xl px-lg max-w-5xl mx-auto pb-xl animate-in fade-in duration-300">
      {/* Profile Identity Card */}
      <section className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0px_1px_3px_rgba(26,22,20,0.05)] mb-xl flex flex-col md:flex-row items-center md:items-start gap-lg relative overflow-hidden">
        {/* Decorative Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-lg overflow-hidden border-2 border-surface-variant bg-surface">
          <img 
            alt="Official Photo" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSYstFmqA7XUy9iVGVcA4EelAgETV8XefcDJG2IDhe6guNs6tVLV3WudyY2NRNbp2KADxrlSzWRb_bvcWMWVtuFgd5GiNDohy9XxarYVRL9vkWwmB1FTbwV0EurjtU9NTVcTQkDKcM4kFRTuCa8Cz_yNao9hW6KWbSQK2Hj2mD76lbb7KlyA1KjOTDDj3Wg4fRI9jdMtt6IvSl7ZLDPW7N7FUS3KJTxlEipXfLsxOg7DvpavXS5tj4bQ"
          />
        </div>
        <div className="flex-1 text-center md:text-left mt-md md:mt-0">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-xs capitalize">{displayName}</h2>
          <p className="font-headline-sm text-headline-sm text-on-surface-variant mb-md">{role}</p>
          <div className="flex flex-col md:flex-row gap-md md:gap-xl mb-md">
            <div className="flex items-center justify-center md:justify-start gap-sm">
              <Building2 className="text-outline" />
              <span className="font-body-lg text-body-lg text-on-surface">Department of Data Analysis</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-sm">
              <Badge className="text-outline" />
              <span className="font-body-lg text-body-lg text-on-surface">ID: ST-99482-B</span>
            </div>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl border-l-2 border-outline-variant pl-md italic">
            Focus on predictive modeling, demographic trend analysis, and structural equation modeling for policy development. Dedicated to clear, data-driven institutional planning.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-row md:flex-col gap-sm mt-md md:mt-0">
          <button className="bg-primary text-on-primary px-md py-sm rounded flex items-center justify-center gap-xs font-label-caps text-label-caps hover:opacity-90 active:scale-95 transition-all">
            <Download className="text-[18px]" />
            EXPORT CV
          </button>
          <button onClick={() => navigate('/profile/edit')} className="bg-surface-container-lowest border border-primary text-primary px-md py-sm rounded flex items-center justify-center gap-xs font-label-caps text-label-caps hover:bg-surface-container transition-all">
            <Pencil className="text-[18px]" />
            EDIT PROFILE
          </button>
        </div>
      </section>

      {/* Bento Grid Layout for Competencies & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
        {/* Competency Radar / Overview (Left Column, span 1) */}
        <section className="md:col-span-1 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
          <div className="flex items-center justify-between border-b border-surface-variant pb-sm mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <Radar className="text-primary" />
              Core Competencies
            </h3>
          </div>
          <div className="flex-1 flex flex-col gap-md justify-center">
            {/* Skill Bars */}
            <div>
              <div className="flex justify-between font-label-caps text-label-caps mb-xs">
                <span className="text-on-surface">Statistical Inference</span>
                <span className="text-primary font-bold">Expert</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[95%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-label-caps text-label-caps mb-xs">
                <span className="text-on-surface">Predictive Modeling</span>
                <span className="text-primary font-bold">Advanced</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[80%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-label-caps text-label-caps mb-xs">
                <span className="text-on-surface">Data Visualization</span>
                <span className="text-primary font-bold">Advanced</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between font-label-caps text-label-caps mb-xs">
                <span className="text-on-surface">Policy Integration</span>
                <span className="text-on-surface-variant">Proficient</span>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container w-[65%]"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-lg pt-md border-t border-surface-variant">
            <p className="font-label-caps text-label-caps text-on-surface-variant mb-sm">Tags</p>
            <div className="flex flex-wrap gap-sm">
              <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-caption text-caption">Python</span>
              <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-caption text-caption">R</span>
              <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-caption text-caption">SQL</span>
              <span className="bg-[#FCDCCC] text-[#1A1614] px-sm py-[2px] rounded font-caption text-caption">Tableau</span>
            </div>
          </div>
        </section>
        
        {/* Milestones & Recent Achievements (Right Column, span 2) */}
        <section className="md:col-span-2 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col">
          <div className="flex items-center justify-between border-b border-surface-variant pb-sm mb-lg">
            <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
              <Flag className="text-primary" />
              Learning Milestones
            </h3>
            <button className="text-primary font-label-caps text-label-caps hover:underline uppercase">View All</button>
          </div>
          
          {/* Timeline Layout */}
          <div className="relative border-l-2 border-surface-variant ml-sm space-y-lg flex-1">
            {/* Item 1 */}
            <div className="relative pl-lg">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-surface-container-lowest"></div>
              <div className="bg-surface p-md rounded-lg border border-outline-variant">
                <div className="flex justify-between items-start mb-xs">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Advanced Bayesian Networks Certification</h4>
                  <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded font-caption text-caption">Q3 2023</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-sm">Completed intensive 12-week institutional training program focused on probabilistic graphical models for complex decision analysis.</p>
                <span className="inline-flex items-center gap-xs text-primary font-label-caps text-label-caps">
                  <Award className="text-[16px]" />
                  Verified Credential
                </span>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="relative pl-lg">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-variant border-2 border-surface-container-lowest"></div>
              <div className="bg-surface p-md rounded-lg border border-outline-variant">
                <div className="flex justify-between items-start mb-xs">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Leadership in Data Governance Seminar</h4>
                  <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded font-caption text-caption">Q1 2023</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-sm">Attended symposium on ethical data handling and policy formulation across inter-departmental workflows.</p>
                <span className="inline-flex items-center gap-xs text-on-surface-variant font-label-caps text-label-caps">
                  <CheckCircle className="text-[16px]" />
                  Completed
                </span>
              </div>
            </div>
            
            {/* Item 3 */}
            <div className="relative pl-lg">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-surface-variant border-2 border-surface-container-lowest"></div>
              <div className="bg-surface p-md rounded-lg border border-outline-variant opacity-70">
                <div className="flex justify-between items-start mb-xs">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface">Foundations of Structural Equation Modeling</h4>
                  <span className="bg-surface-variant text-on-surface-variant px-sm py-xs rounded font-caption text-caption">2021</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant">Initial competency assessment and foundational training established.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
