import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learningApi } from '../../api/learning';
import type { LearningResource, Enrollment } from '../../api/learning';
import { BarChart, Bookmark, ChevronRight, Clock, GraduationCap, Medal, Play, Share2 } from 'lucide-react';


export const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [resData, enrollmentsData] = await Promise.all([ learningApi.getResource(id), learningApi.getEnrollments() ]);
        setResource(resData);
        setEnrollment(enrollmentsData.find(e => e.resource._id === id) || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleStart = async () => {
    if (!id) return;
    setEnrolling(true);
    try {
      if (!enrollment) await learningApi.enroll(id);
      navigate(`/learning/${id}/player`);
    } catch (error) {
      console.error(error);
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-5 animate-pulse max-w-screen-2xl mx-auto w-full px-lg py-xl">
        <div className="w-32 h-8 bg-surface-variant rounded"></div>
        <div className="h-64 bg-surface-variant rounded-lg"></div>
      </div>
    );
  }

  if (!resource) return <div className="text-error font-body-lg text-center mt-xl">Resource not found.</div>;

  const isCompleted = enrollment?.status === 'COMPLETED';
  const hasStarted = enrollment && enrollment.status !== 'COMPLETED';

  return (
    <div className="flex-grow w-full max-w-screen-2xl mx-auto flex flex-col gap-xl px-lg py-xl pb-[120px] animate-in fade-in duration-300">
      {/* Breadcrumbs & Actions */}
      <div className="flex justify-between items-center w-full">
        <nav className="flex items-center gap-sm font-caption text-caption text-on-surface-variant">
          <button onClick={() => navigate('/explore')} className="hover:text-primary transition-colors cursor-pointer">Learning</button>
          <ChevronRight className="text-[16px]" />
          <span className="hover:text-primary transition-colors cursor-pointer capitalize">{(resource.type || 'Course').toLowerCase()}</span>
          <ChevronRight className="text-[16px]" />
          <span className="text-on-surface font-semibold max-w-[200px] truncate" title={resource.title}>{resource.title}</span>
        </nav>
        <div className="flex gap-md">
          <button className="text-primary hover:bg-surface-container-low px-sm py-xs rounded flex items-center gap-xs font-label-caps text-label-caps transition-colors">
            <Bookmark className="text-[18px]" />
            Save
          </button>
          <button className="text-primary hover:bg-surface-container-low px-sm py-xs rounded flex items-center gap-xs font-label-caps text-label-caps transition-colors">
            <Share2 className="text-[18px]" />
            Share
          </button>
        </div>
      </div>

      {/* Hero / Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Left: Title & Abstract */}
        <div className="lg:col-span-8 flex flex-col gap-md">
          <div className="flex gap-sm mb-xs">
            <span className="bg-surface-container-high px-sm py-xs rounded font-label-caps text-label-caps text-on-surface-variant uppercase">{resource.type || 'COURSE'}</span>
            <span className="bg-primary/10 text-primary px-sm py-xs rounded font-label-caps text-label-caps uppercase">MANDATORY</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface leading-tight">{resource.title}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-3xl whitespace-pre-wrap">
            {resource.description}
          </p>
          
          {/* Competency Alignment Tags */}
          {resource.competencies && resource.competencies.length > 0 && (
            <div className="mt-lg">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-sm">COMPETENCY ALIGNMENT</h3>
              <div className="flex flex-wrap gap-sm">
                {resource.competencies.map((comp: any) => (
                  <span key={comp._id || comp} className="bg-[#FCDCCC] text-[#1A1614] px-md py-sm rounded border border-outline-variant font-body-md text-body-md">
                    {comp.name || 'Competency'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Metadata & Action Card */}
        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] sticky top-[80px]">
            <div className="grid grid-cols-2 gap-md mb-lg pb-md border-b border-surface-variant">
              <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
                  <Clock className="text-[16px]" /> DURATION
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface mt-xs">{resource.durationMinutes || 60} Mins</div>
              </div>
              <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
                  <BarChart className="text-[16px]" /> LEVEL
                </div>
                <div className="font-headline-sm text-headline-sm text-on-surface mt-xs capitalize">{(resource.difficulty || 'Intermediate').toLowerCase()}</div>
              </div>
              <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
                  <GraduationCap className="text-[16px]" /> FORMAT
                </div>
                <div className="font-body-md text-body-md text-on-surface mt-xs capitalize">{(resource.type || 'Online').toLowerCase()}</div>
              </div>
              <div>
                <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs">
                  <Medal className="text-[16px]" /> CREDITS
                </div>
                <div className="font-body-md text-body-md text-on-surface mt-xs">3.0 CEUs</div>
              </div>
            </div>
            
            {isCompleted ? (
              <div className="w-full bg-surface-container text-on-surface font-label-caps text-label-caps py-md rounded mb-sm text-center border border-surface-variant">
                COMPLETED
              </div>
            ) : (
              <button 
                onClick={handleStart}
                disabled={enrolling}
                className="w-full bg-[#F05A2A] text-white font-label-caps text-label-caps py-md rounded hover:bg-primary-container transition-colors mb-sm flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {enrolling ? 'LOADING...' : hasStarted ? 'CONTINUE LEARNING' : 'ENROLL NOW'} {enrolling ? '' : <Play className="text-[18px]" />}
              </button>
            )}
            
            <p className="font-caption text-caption text-on-surface-variant text-center">Next cohort begins October 15, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};
