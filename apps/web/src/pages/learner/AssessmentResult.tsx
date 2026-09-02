import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import type { AssessmentAttempt } from '../../api/assessments';
import { AlertCircle, BookOpen, CheckCircle, Clock, Download } from 'lucide-react';


export const AssessmentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state?.attempt as AssessmentAttempt | undefined;
  
  // Use mock data if attempt is not found, or base on attempt data
  if (!attempt) return <div className="p-xl text-center">No assessment result found. Please complete an assessment first.</div>;
  const score = Math.round(attempt.percentage);
  const isPass = attempt.passed;
  const levelText = score >= 80 ? 'Advanced' : (score >= 60 ? 'Intermediate' : 'Novice');

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-lg animate-in fade-in duration-300">
      <style>
        {`
          .bento-card {
            box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
            transition: all 0.2s ease-in-out;
          }
          .bento-card:active {
            box-shadow: none;
            border-color: var(--tw-colors-outline-variant, #e2bfb5);
          }
        `}
      </style>
      
      {/* Main Content */}
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-lg py-xl space-y-xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md pb-md border-b border-outline-variant">
          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-xs">
              Assessment Result
            </span>
            <h1 className="font-display-lg text-display-lg text-on-background">
              Strategic Leadership Assessment
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
              Completed on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • Proctored Session
            </p>
          </div>
          <button className="bg-surface-container-lowest border border-outline-variant text-primary px-lg py-sm rounded hover:bg-surface-container-low transition-colors duration-200 font-label-caps text-label-caps flex items-center gap-sm">
            <Download className="text-[18px]" />
            Export Report
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          
          {/* Overall Proficiency Card */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-surface-variant rounded-lg p-lg bento-card flex flex-col justify-between h-full">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-xs">Overall Proficiency</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">Compared to institutional average</p>
            </div>
            
            <div className="flex items-end gap-sm mb-md mt-lg">
              <span className={`text-6xl font-display-lg font-bold ${isPass ? 'text-primary' : 'text-error'}`}>{score}%</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-2">{levelText}</span>
            </div>
            
            <div className="w-full bg-surface-container-high rounded-full h-2 mb-sm overflow-hidden">
              <div className={`h-2 rounded-full ${isPass ? 'bg-primary' : 'bg-error'}`} style={{ width: `${score}%` }}></div>
            </div>
            
            <div className="flex justify-between font-caption text-caption text-on-surface-variant">
              <span>Novice</span>
              <span>Expert</span>
            </div>
          </div>

          {/* Competency Breakdown Card */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-surface-variant rounded-lg p-lg bento-card">
            <h2 className="font-headline-sm text-headline-sm text-on-background mb-md pb-sm border-b border-outline-variant">Competency Breakdown</h2>
            <div className="space-y-md">
              <div className="flex items-center gap-md">
                <div className="w-1/3 font-body-md text-body-md text-on-background font-semibold">Strategic Planning</div>
                <div className="flex-grow">
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div className="w-12 text-right font-body-md text-body-md text-primary font-bold">90%</div>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-1/3 font-body-md text-body-md text-on-background font-semibold">Team Alignment</div>
                <div className="flex-grow">
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="w-12 text-right font-body-md text-body-md text-primary font-bold">85%</div>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-1/3 font-body-md text-body-md text-on-background font-semibold">Change Management</div>
                <div className="flex-grow">
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div className="bg-outline h-1.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="w-12 text-right font-body-md text-body-md text-on-surface-variant">65%</div>
              </div>
              <div className="flex items-center gap-md">
                <div className="w-1/3 font-body-md text-body-md text-on-background font-semibold">Decision Making</div>
                <div className="flex-grow">
                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div className="bg-outline h-1.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div className="w-12 text-right font-body-md text-body-md text-on-surface-variant">70%</div>
              </div>
            </div>
          </div>

          {/* Verified Strengths */}
          <div className="md:col-span-6 bg-surface-container-lowest border border-surface-variant rounded-lg p-lg bento-card">
            <div className="flex items-center gap-sm mb-md pb-sm border-b border-outline-variant">
              <CheckCircle className="text-primary" />
              <h2 className="font-headline-sm text-headline-sm text-on-background">Verified Strengths</h2>
            </div>
            <ul className="space-y-sm list-none font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-start gap-sm">
                <span className="text-primary mt-1">•</span>
                <span>Demonstrated exceptional understanding of long-term strategic alignment.</span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="text-primary mt-1">•</span>
                <span>Effectively utilized communication frameworks to align cross-functional teams.</span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="text-primary mt-1">•</span>
                <span>High accuracy in evaluating strategic risks.</span>
              </li>
            </ul>
          </div>

          {/* Identified Gaps */}
          <div className="md:col-span-6 bg-surface-container-lowest border border-surface-variant rounded-lg p-lg bento-card">
            <div className="flex items-center gap-sm mb-md pb-sm border-b border-outline-variant">
              <AlertCircle className="text-outline" />
              <h2 className="font-headline-sm text-headline-sm text-on-background">Identified Gaps</h2>
            </div>
            <ul className="space-y-sm list-none font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-start gap-sm">
                <span className="text-outline mt-1">•</span>
                <span>Responses indicated a lack of familiarity with agile change management methodologies.</span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="text-outline mt-1">•</span>
                <span>Struggled with selecting appropriate intervention strategies during conflict.</span>
              </li>
              <li className="flex items-start gap-sm">
                <span className="text-outline mt-1">•</span>
                <span>Delegation prioritization could be improved.</span>
              </li>
            </ul>
          </div>

          {/* Recommended Path Section */}
          <div className="md:col-span-12 bg-surface-container-low border border-surface-variant rounded-lg p-lg mt-md flex flex-col md:flex-row items-center justify-between gap-lg">
            <div className="flex-grow">
              <span className="bg-[#FCDCCC] text-[#1A1614] px-2 py-1 rounded font-label-caps text-label-caps mb-sm inline-block">Action Required</span>
              <h3 className="font-headline-md text-headline-md text-on-background mb-xs">Change Management Advanced Module</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Based on your assessment results, we recommend this focused module to address identified gaps in change management and conflict resolution. Completing this path will solidify your overall leadership competency.
              </p>
              <div className="flex gap-sm mt-md font-caption text-caption text-on-surface-variant">
                <span className="flex items-center gap-xs"><Clock className="text-[16px]" /> 4 Hours</span>
                <span className="flex items-center gap-xs"><BookOpen className="text-[16px]" /> 3 Modules</span>
              </div>
            </div>
            <button onClick={() => navigate('/learner/learning')} className="bg-primary text-white border-none rounded px-xl py-md font-label-caps text-label-caps whitespace-nowrap hover:bg-primary-container transition-colors duration-200">
              Enroll in Pathway
            </button>
          </div>
          
          <div className="md:col-span-12 flex justify-center mt-xl">
             <Button variant="secondary" size="lg" onClick={() => navigate('/learner/dashboard')}>
                Return to Dashboard
             </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
