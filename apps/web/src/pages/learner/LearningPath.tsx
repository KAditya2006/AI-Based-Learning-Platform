import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningApi } from '../../api/learning';
import { Activity, ArrowRight, Check, Clock, Code, Database, Dumbbell, LineChart, Lock, Map, Medal, RefreshCw, Sparkles, Users } from 'lucide-react';


export const LearningPath = () => {
  const navigate = useNavigate();
  const [path, setPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const fetchPath = async () => {
    try {
      setLoading(true);
      const data = await learningApi.getPath();
      setPath(data);
    } catch {
      setPath(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError('');
    try {
      const newPath = await learningApi.generatePath();
      setPath(newPath);
    } catch {
      setGenError('Failed to generate path. Ensure you have completed assessments and identified skill gaps.');
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => { fetchPath(); }, []);

  if (loading) {
    return (
      <div className="flex-grow px-lg max-w-screen-2xl mx-auto w-full py-xl space-y-xl animate-pulse">
        <div className="h-24 bg-surface-variant rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-variant rounded-lg"></div>)}
          </div>
          <div className="lg:col-span-4 h-64 bg-surface-variant rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!path || !path.sequence?.length) {
    return (
      <div className="flex-grow px-lg max-w-screen-2xl mx-auto w-full py-xl animate-in fade-in duration-300">
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-xl flex flex-col items-center justify-center text-center shadow-[0px_1px_3px_rgba(26,22,20,0.05)] min-h-[400px]">
          <Map className="text-surface-variant text-[96px] mb-md" />
          <h2 className="font-display-lg text-display-lg text-on-surface mb-sm">No learning path yet</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-lg">
            Click 'Generate Path' to let the AI engine build a personalized learning sequence based on your skill gaps.
          </p>
          {genError && <div className="text-error font-body-md mb-md">{genError}</div>}
          <button 
            onClick={handleGenerate} 
            disabled={generating}
            className="bg-primary text-on-primary font-label-caps text-label-caps px-xl py-sm rounded-lg hover:bg-surface-tint transition-colors flex items-center gap-2 disabled:opacity-70 shadow-[0px_1px_3px_rgba(26,22,20,0.05)]"
          >
            <Sparkles className="text-[18px]" /> {generating ? 'Generating...' : 'Generate My Path'}
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = path.progress || 0;

  return (
    <div className="flex-grow px-lg max-w-screen-2xl mx-auto w-full py-xl space-y-xl animate-in fade-in duration-300">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md pb-md border-b border-surface-variant">
        <div className="space-y-sm">
          <div className="flex items-center gap-2">
            <span className="bg-[#FCDCCC] text-[#1A1614] font-label-caps text-label-caps px-2 py-1 rounded">Strategic Path</span>
            <span className="text-on-surface-variant font-caption text-caption">&bull; Advanced Level</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface">{path.title}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            {path.description}
          </p>
        </div>
        <div className="flex items-center gap-md">
          <div className="text-right">
            <div className="font-headline-sm text-headline-sm text-primary">{completionPercentage}%</div>
            <div className="font-caption text-caption text-on-surface-variant">Path Completion</div>
          </div>
          <div className="w-32 h-2 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Left Column: Timeline */}
        <div className="lg:col-span-8 space-y-lg">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">Learning Modules</h2>
            <button 
              onClick={handleGenerate} 
              disabled={generating}
              className="text-primary hover:bg-surface-container-low font-label-caps text-label-caps px-sm py-xs rounded flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`text-[16px] ${generating ? 'animate-spin' : ''}`} /> {generating ? 'Regenerating...' : 'Regenerate Path'}
            </button>
          </div>
          
          <div className="relative pl-8">
            {/* Vertical Timeline Line */}
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-surface-variant">
              <div className="absolute top-0 w-full bg-primary" style={{ height: `${completionPercentage}%` }}></div>
            </div>

            {path.sequence.map((step: any, idx: number) => {
              const isCompleted = false;
const isInProgress = false;
const isUpcoming = true;

              return (
                <div key={idx} className={`relative mb-xl group ${isUpcoming ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                  {/* Timeline Node */}
                  {isCompleted && (
                    <div className="absolute -left-9 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-4 border-background z-10">
                      <Check className="text-on-primary text-[14px]" />
                    </div>
                  )}
                  {isInProgress && (
                    <div className="absolute -left-9 top-1 w-6 h-6 rounded-full bg-background border-4 border-primary z-10"></div>
                  )}
                  {isUpcoming && (
                    <div className="absolute -left-9 top-1 w-6 h-6 rounded-full bg-surface-variant border-4 border-background z-10"></div>
                  )}

                  <div className={`bg-surface-container-lowest rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)] transition-all ${
                    isCompleted ? 'border border-surface-variant hover:border-[#D1C9C4]' :
                    isInProgress ? 'border-2 border-primary relative overflow-hidden hover:border-primary' :
                    'border border-surface-variant'
                  }`}>
                    {isInProgress && <div className="absolute left-0 bottom-0 top-0 bg-primary/5 w-[60%] z-0"></div>}
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-sm pb-sm border-b border-surface-variant/50">
                        <div className="flex items-center gap-2">
                          {isCompleted ? <Activity className="text-primary" /> :
                           isInProgress ? <LineChart className="text-primary" /> :
                           <Dumbbell className="text-on-surface-variant" />}
                          <h3 className={`font-headline-sm text-headline-sm ${isUpcoming ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                            {step.title}
                          </h3>
                        </div>
                        <span className={`font-label-caps text-label-caps px-2 py-1 rounded ${
                          isCompleted ? 'bg-[#F05A2A] text-white' :
                          isInProgress ? 'bg-surface-variant text-on-surface' :
                          'bg-surface border border-surface-variant text-on-surface-variant'
                        }`}>
                          {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Upcoming'}
                        </span>
                      </div>
                      
                      <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                        {step.reasoning}
                      </p>
                      
                      {isCompleted && (
                        <div className="flex gap-2">
                          <span className="bg-[#FCDCCC] text-[#1A1614] font-caption text-caption px-2 py-0.5 rounded uppercase">{step.source}</span>
                          {step.duration && <span className="bg-[#FCDCCC] text-[#1A1614] font-caption text-caption px-2 py-0.5 rounded">{step.duration} mins</span>}
                        </div>
                      )}
                      
                      {isInProgress && (
                        <div className="flex items-center gap-4 mt-sm">
                          <div className="flex-grow">
                            <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-1">
                              <span>Module Progress</span>
                              <span>60%</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/learning/${step.resourceId}`)}
                            className="bg-[#F05A2A] text-white hover:bg-primary-container font-label-caps text-label-caps px-4 py-2 rounded transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      )}
                      
                      {isUpcoming && (
                        <div className="mt-md flex items-center gap-2 text-on-surface-variant font-caption text-caption">
                          <Lock className="text-[16px]" />
                          <span>Complete previous module to unlock</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Meta info and Resources */}
        <div className="lg:col-span-4 space-y-lg">
          {/* Path Details Card */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md pb-sm border-b border-surface-variant/50">Path Details</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="text-primary mt-0.5" />
                <div>
                  <div className="font-body-md text-body-md text-on-surface">Estimated Time</div>
                  <div className="font-caption text-caption text-on-surface-variant">{path.estimatedWeeks ? `${path.estimatedWeeks} Weeks Total` : 'Self-paced'}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Medal className="text-primary mt-0.5" />
                <div>
                  <div className="font-body-md text-body-md text-on-surface">Certification</div>
                  <div className="font-caption text-caption text-on-surface-variant">GovData Analyst Level III</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="text-primary mt-0.5" />
                <div>
                  <div className="font-body-md text-body-md text-on-surface">Cohort</div>
                  <div className="font-caption text-caption text-on-surface-variant">Spring 2024 Planning Dept.</div>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Related Resources */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-[0px_1px_3px_rgba(26,22,20,0.05)]">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md pb-sm border-b border-surface-variant/50">Required Tools</h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded transition-colors group">
                <div className="flex items-center gap-2 text-on-surface">
                  <Database className="text-on-surface-variant group-hover:text-primary transition-colors" />
                  <span className="font-body-md text-body-md">National Demographic Dataset</span>
                </div>
                <ArrowRight className="text-[16px] text-on-surface-variant" />
              </a>
              <a href="#" className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded transition-colors group">
                <div className="flex items-center gap-2 text-on-surface">
                  <Code className="text-on-surface-variant group-hover:text-primary transition-colors" />
                  <span className="font-body-md text-body-md">R Studio Environment Setup</span>
                </div>
                <ArrowRight className="text-[16px] text-on-surface-variant" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
