import { Play, Pause } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { learningApi } from '../../api/learning';
import type { LearningResource, Enrollment } from '../../api/learning';
import { LearningAssistant } from './LearningAssistant';
import { ArrowLeft, Bookmark, Captions, CheckCircle, ChevronLeft, ChevronRight, ClipboardList, Lock, Maximize, MessageSquare, PlayCircle, Settings, Volume2 } from 'lucide-react';


export const LearningPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const handleMarkComplete = async () => {
    if (!id || !enrollment) return;
    setUpdating(true);
    try {
      const updated = await learningApi.updateProgress(id, 100);
      setEnrollment(updated);
      setTimeout(() => navigate(`/learning/${id}`), 1500);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-surface flex items-center justify-center animate-pulse">
        <div className="w-full max-w-4xl h-[60vh] bg-surface-variant rounded-lg"></div>
      </div>
    );
  }

  if (!resource || !enrollment) {
    return <div className="p-xl text-center text-error font-body-lg">Enrollment not found.</div>;
  }

  const isCompleted = enrollment.progressPercentage === 100;

  const modules = resource.modules || [];

  return (
    <div className="bg-surface text-on-surface font-body-lg h-screen flex flex-col overflow-hidden animate-in fade-in duration-300">
      <style>
        {`
          .material-symbols-outlined.fill { font-variation-settings: 'FILL' 1; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e2bfb5; border-radius: 4px; }
        `}
      </style>
      {/* Top Navigation (Minimal for Focus Mode) */}
      <header className="bg-surface dark:bg-surface-dim w-full sticky top-0 h-14 border-b border-outline-variant dark:border-outline flex justify-between items-center px-lg z-50">
        <div className="flex items-center gap-md">
          <button onClick={() => navigate(`/learning/${id}`)} aria-label="Exit Learning Mode" className="text-on-surface-variant hover:text-primary transition-colors duration-200">
            <ArrowLeft />
          </button>
          <div className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim font-bold tracking-tight">
            SkillIntel
          </div>
          <div className="h-6 w-px bg-outline-variant mx-sm"></div>
          <h1 className="font-body-lg text-body-lg text-on-surface-variant hidden md:block truncate max-w-md">{resource.title}</h1>
        </div>
        
        <div className="flex items-center gap-sm">
          <button 
            onClick={() => setShowAssistant(!showAssistant)} 
            className={`p-sm rounded-full transition-colors duration-200 ${showAssistant ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'}`}
            title="AI Assistant"
          >
            <MessageSquare />
          </button>
          <button className="text-on-surface-variant hover:text-primary p-sm rounded-full hover:bg-surface-container-low transition-colors duration-200">
            <Bookmark />
          </button>
          <button className="text-on-surface-variant hover:text-primary p-sm rounded-full hover:bg-surface-container-low transition-colors duration-200 hidden sm:block">
            <Settings />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Video Player Section (Left/Main) */}
        <section className="flex-1 flex flex-col bg-surface-container-lowest relative">
          
          {/* Video Container */}
          <div className="flex-1 bg-black relative flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-variant to-outline-variant opacity-20"></div>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`absolute z-10 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 active:scale-95 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-opacity duration-300`}
            >
              {isPlaying ? <Pause className="fill-current text-[32px]" /> : <Play className="fill-current text-[32px]" />}
            </button>
            
            {/* Custom Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-lg bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-sm">
              <div className="w-full h-1 bg-white/30 rounded-full cursor-pointer relative group/progress">
                <div className="absolute top-0 left-0 h-full bg-primary rounded-full" style={{ width: `${enrollment.progressPercentage}%` }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ left: `${enrollment.progressPercentage}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-white mt-sm">
                <div className="flex items-center gap-md">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-primary transition-colors">
                    {isPlaying ? <Pause className="fill-current" /> : <Play className="fill-current" />}
                  </button>
                  <button className="hover:text-primary transition-colors">
                    <Volume2 />
                  </button>
                  <span className="font-caption text-caption">04:12 / 12:45</span>
                </div>
                <div className="flex items-center gap-md">
                  <button className="hover:text-primary transition-colors">
                    <Captions />
                  </button>
                  <button className="hover:text-primary transition-colors">
                    <Maximize />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Details & Actions */}
          <div className="p-lg bg-surface border-t border-outline-variant flex-shrink-0 flex items-start justify-between">
            <div className="max-w-3xl">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">{resource.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">{resource.description}</p>
            </div>
            
            <div className="flex gap-sm shrink-0 ml-4">
              {isCompleted ? (
                 <div className="px-md py-sm bg-[#d4edda] text-[#155724] rounded border border-[#c3e6cb] font-label-caps text-label-caps flex items-center gap-2">
                   <CheckCircle className="fill text-[16px]" /> COMPLETED
                 </div>
              ) : (
                <>
                  <button className="hidden sm:block px-md py-sm bg-surface-container-lowest border border-primary text-primary rounded-[4px] font-label-caps text-label-caps hover:bg-surface-container-low transition-colors">
                    Download Transcript
                  </button>
                  <button 
                    onClick={handleMarkComplete}
                    disabled={updating}
                    className="px-md py-sm bg-primary text-white rounded-[4px] font-label-caps text-label-caps hover:bg-surface-tint transition-colors flex items-center gap-xs disabled:opacity-70"
                  >
                    {updating ? 'SAVING...' : 'Take Quiz'} <ClipboardList className="text-[16px]" />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Sidebar Navigation (Right) */}
        <aside className="w-80 bg-surface-container-low border-l border-outline-variant flex flex-col flex-shrink-0 relative overflow-hidden">
          
          {/* Assistant Overlay */}
          {showAssistant && (
            <div className="absolute inset-0 bg-surface z-20 flex flex-col">
              <LearningAssistant onClose={() => setShowAssistant(false)} />
            </div>
          )}

          {/* Sidebar Header */}
          <div className="p-lg border-b border-outline-variant">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Module Progress</h3>
            <div className="flex items-center gap-sm">
              <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '37.5%' }}></div>
              </div>
              <span className="font-caption text-caption text-on-surface-variant">3 of 8</span>
            </div>
          </div>
          
          {/* Module List */}
          <div className="flex-1 overflow-y-auto p-sm custom-scrollbar">
            {modules.map((mod: any) => (
              <div key={mod.id}>
                {mod.status === 'completed' && (
                  <button className="w-full text-left p-md flex items-start gap-md rounded-lg hover:bg-surface-container-highest transition-colors mb-sm">
                    <div className="mt-1 text-primary"><CheckCircle className="fill text-[20px]" /></div>
                    <div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{mod.id}. {mod.title}</div>
                      <div className="font-body-md text-body-md text-on-surface line-clamp-2">{mod.subtitle}</div>
                      <div className="font-caption text-caption text-on-surface-variant mt-xs">{mod.duration}</div>
                    </div>
                  </button>
                )}
                
                {mod.status === 'active' && (
                  <div className="w-full text-left p-md flex items-start gap-md rounded-lg bg-surface-container-highest border border-outline-variant shadow-[0px_1px_3px_rgba(26,22,20,0.05)] mb-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    <div className="mt-1 text-primary"><PlayCircle className="text-[20px]" /></div>
                    <div>
                      <div className="font-label-caps text-label-caps text-primary mb-xs">{mod.id}. {mod.title}</div>
                      <div className="font-body-md text-body-md text-on-surface font-semibold line-clamp-2">{mod.subtitle}</div>
                      <div className="font-caption text-caption text-primary mt-xs font-semibold">{mod.duration} &bull; Playing</div>
                    </div>
                  </div>
                )}
                
                {mod.status === 'upcoming' && (
                  <button className="w-full text-left p-md flex items-start gap-md rounded-lg hover:bg-surface-container-highest transition-colors mb-sm opacity-70 cursor-not-allowed">
                    <div className="mt-1 text-on-surface-variant"><Lock className="text-[20px]" /></div>
                    <div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant mb-xs">{mod.id}. {mod.title}</div>
                      <div className="font-body-md text-body-md text-on-surface line-clamp-2">{mod.subtitle}</div>
                      <div className="font-caption text-caption text-on-surface-variant mt-xs">{mod.duration}</div>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Bottom Navigation */}
          <div className="p-md border-t border-outline-variant bg-surface-container flex justify-between gap-sm">
            <button className="flex-1 flex justify-center items-center gap-xs px-md py-sm bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded-[4px] font-label-caps text-label-caps hover:bg-surface-container-low transition-colors">
              <ChevronLeft className="text-[16px]" /> Prev
            </button>
            <button className="flex-1 flex justify-center items-center gap-xs px-md py-sm bg-surface-container-lowest border border-outline-variant text-on-surface-variant rounded-[4px] font-label-caps text-label-caps hover:bg-surface-container-low transition-colors opacity-50 cursor-not-allowed">
              Next <ChevronRight className="text-[16px]" />
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
