import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '../../contexts/AuthContext';
import { fetchClient } from '../../api/client';
import type { SkillGap } from '../../api/skillGaps';
import { learningApi } from '../../api/learning';
import type { Enrollment } from '../../api/learning';
import type { Assessment } from '../../api/assessments';
import { aiApi } from '../../api/ai';
import { profileApi } from '../../api/profile';
import { BookOpen, Brain, Check, Lock, Play, PlayCircle, Users } from 'lucide-react';


const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: gaps } = useSWR<SkillGap[]>('/skill-gaps', fetchClient);
  const { data: assessments } = useSWR<Assessment[]>('/assessments', fetchClient);
  const { data: recommendationsRes } = useSWR('/ai/learner/recommendations', aiApi.getRecommendations);
  const { data: profile } = useSWR('/profile', profileApi.getProfile);
  const recommendations: any[] = (recommendationsRes as any)?.data || recommendationsRes || [];

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  useEffect(() => { 
    learningApi.getEnrollments().then(data => {
      setEnrollments(data.filter(e => e.status !== 'COMPLETED'));
      setLoadingEnrollments(false);
    }).catch(() => setLoadingEnrollments(false));
  }, []);

  const displayName = profile?.firstName || user?.email?.split('@')[0] || 'Official';
  const activeEnrollment = enrollments[0];

  return (
    <div className="max-w-screen-2xl mx-auto px-lg mt-xl grid grid-cols-1 lg:grid-cols-12 gap-xl animate-in fade-in duration-300 pb-xl">
      
      {/* Left Column: Primary Content (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-xl">
        
        {/* Greeting */}
        <div className="mb-sm">
          <h2 className="font-display-lg text-display-lg text-on-background">{getGreeting()}, {displayName}.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">Here is your daily overview and recommended path forward.</p>
        </div>

        {/* Current Focus Hero Card */}
        {activeEnrollment ? (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col md:flex-row gap-lg items-start md:items-center">
            <div className="flex-1 w-full">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-sm">Current Focus</span>
              <h3 className="font-headline-md text-headline-md text-on-background mb-sm">{activeEnrollment.resource.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md max-w-2xl">
                {activeEnrollment.resource.description || "Continue your learning journey to master this competency."}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-surface-container-high rounded-full h-2 mb-sm overflow-hidden">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${activeEnrollment.progressPercentage}%` }}></div>
              </div>
              <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-lg">
                <span>{activeEnrollment.progressPercentage}% Completed</span>
                <span>{activeEnrollment.resource.provider}</span>
              </div>
              
              <button onClick={() => navigate(`/learning/${activeEnrollment.resource._id}`)} className="bg-primary text-on-primary font-label-caps text-label-caps px-md py-sm rounded hover:opacity-90 transition-opacity active:scale-95">
                RESUME MODULE
              </button>
            </div>
            
            {/* Decorative Graphic/Image for Hero */}
            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0 border border-outline-variant">
              <img 
                className="w-full h-full object-cover" 
                alt="Intelligence Synthesis" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyX_vl7Gppn1p0KHMeAFlG3yFzOPH8rb-g_ywnhVBWTFNeHBGNkEP9dR5IRP-gp_qexebNXC3IJo21CovLC89hZqJ_aKUVcVoVWyJscm64jFcr8ho0K9nGKGIpR_bSW3YWP7VaLmH4qrDj3Pyqt38BUUL9TTOoiTQ562SRpXyGR3hUE4I8INLnkFF5ZmZIGC4dvAcglzqRFHH_J82v8yIHFYnlPT39mH7ra-befzeGbteTDkM0DTgEiw"
              />
            </div>
          </section>
        ) : (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col md:flex-row gap-lg items-start md:items-center">
            <div className="flex-1 w-full">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-sm">Current Focus</span>
              <h3 className="font-headline-md text-headline-md text-on-background mb-sm">No active enrollments</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-lg max-w-2xl">
                Explore the library and enroll in a course to start your learning journey.
              </p>
              <button onClick={() => navigate(`/explore`)} className="bg-primary text-on-primary font-label-caps text-label-caps px-md py-sm rounded hover:opacity-90 transition-opacity active:scale-95">
                EXPLORE LIBRARY
              </button>
            </div>
            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden shrink-0 border border-outline-variant flex items-center justify-center bg-surface-container-high">
              <BookOpen className="text-[64px] text-on-surface-variant opacity-50" />
            </div>
          </section>
        )}

        {/* Competency Journey Timeline */}
        <section>
          <div className="flex items-center justify-between mb-lg border-b border-outline-variant pb-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-background">Competency Journey</h3>
            <span onClick={() => navigate('/progress')} className="font-label-caps text-label-caps text-primary cursor-pointer hover:underline">VIEW FULL MAP</span>
          </div>
          
          <div className="relative pl-sm">
            {/* Vertical Line */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-outline-variant"></div>
            
            {/* Timeline Item: Assessments */}
            <div className="relative flex gap-md mb-lg">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center z-10 shrink-0">
                <Check className="text-primary text-[16px]" />
              </div>
              <div className="pt-1">
                  {assessments && assessments.length > 0 ? (
                    <>
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-sm py-xs rounded">ACTION REQUIRED</span>
                        <span className="font-caption text-caption text-on-surface-variant">Pending Evaluation</span>
                      </div>
                      <h4 className="font-body-lg text-body-lg font-semibold text-on-background">{assessments[0].title}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-xs mb-sm">{assessments[0].description}</p>
                      <button onClick={() => navigate(`/assessments/${assessments[0]._id}/preparation`)} className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-caps text-label-caps">Take Assessment</button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container-high px-sm py-xs rounded border border-outline-variant">UP TO DATE</span>
                      </div>
                      <h4 className="font-body-lg text-body-lg font-semibold text-on-background">No Pending Assessments</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Your competency profile is complete and up to date.</p>
                    </>
                  )}
                </div>
            </div>

            {/* Timeline Item: In Progress (Current) */}
            {gaps && gaps.length > 0 && (
              <div className="relative flex gap-md mb-lg">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10 shrink-0">
                  <Play className="text-on-primary text-[16px]" />
                </div>
                <div className="pt-1 bg-surface-container-low p-md rounded-lg border border-outline-variant w-full shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
                  <div className="flex items-center gap-sm mb-xs">
                    <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container-high border border-outline-variant px-sm py-xs rounded">IN PROGRESS</span>
                  </div>
                  <h4 className="font-body-lg text-body-lg font-semibold text-on-background">{gaps[0].competency.name}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-xs mb-md">Addressing critical skill gaps to reach Level {gaps[0].requiredLevel}.</p>
                  <div className="flex gap-sm">
                    <span className="font-caption text-caption bg-secondary-fixed text-on-secondary-fixed px-sm py-[2px] rounded border border-outline-variant">Skill Gap</span>
                    <span className="font-caption text-caption bg-secondary-fixed text-on-secondary-fixed px-sm py-[2px] rounded border border-outline-variant">Current: {gaps[0].currentLevel}</span>
                  </div>
                </div>
              </div>
            )}


          </div>
        </section>
      </div>

      {/* Right Column: Sidebar (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-xl">
        {/* Personalized Recommendations Panel */}
        <aside className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
          <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
            <Brain className="text-primary" />
            <h3 className="font-headline-sm text-headline-sm text-on-background">Curated For You</h3>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
            Based on your role alignment, these resources are recommended to bridge identified gaps.
          </p>
          
          <div className="flex flex-col gap-md">
            {recommendations.length === 0 ? (
              <div className="p-md text-center text-on-surface-variant text-body-md border border-outline-variant rounded">
                Complete an assessment to get personalized recommendations.
              </div>
            ) : (
              recommendations.slice(0, 3).map((rec: any) => (
                <div 
                  key={rec._id} 
                  onClick={() => rec.resourceId && navigate(`/learning/${rec.resourceId}`)}
                  className={`group block border border-outline-variant rounded p-sm hover:border-primary hover:bg-surface-container-low transition-colors active:translate-y-[1px] ${rec.resourceId ? 'cursor-pointer' : 'cursor-default opacity-70'}`}
                >
                  <div className="flex gap-sm">
                    <div className="w-16 h-16 bg-surface-container-high rounded shrink-0 overflow-hidden flex items-center justify-center">
                       <PlayCircle className="text-on-surface-variant group-hover:text-primary transition-colors text-[32px]" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-caption text-caption text-primary mb-xs uppercase">{rec.source} · {rec.estimatedEffortMinutes || 30} MIN</span>
                      <h4 className="font-body-md text-body-md font-semibold text-on-background group-hover:text-primary transition-colors line-clamp-2">{rec.title}</h4>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button onClick={() => navigate('/recommendations')} className="w-full mt-lg bg-surface-container-lowest border border-primary text-primary font-label-caps text-label-caps py-sm rounded hover:bg-primary-fixed transition-colors">
            VIEW ALL RECOMMENDATIONS
          </button>
        </aside>
      </div>
      
    </div>
  );
};

