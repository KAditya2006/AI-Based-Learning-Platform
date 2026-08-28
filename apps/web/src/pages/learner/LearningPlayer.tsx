import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MessageSquare } from 'lucide-react';
import { learningApi } from '../../api/learning';
import type { LearningResource, Enrollment } from '../../api/learning';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { LearningAssistant } from './LearningAssistant';

export const LearningPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [resData, enrollmentsData] = await Promise.all([
          learningApi.getResource(id),
          learningApi.getEnrollments()
        ]);
        setResource(resData);
        setEnrollment(enrollmentsData.find(e => e.resource._id === id) || null);
      } catch (error) {
        console.error('Failed to load player data', error);
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
      // Wait a moment then redirect back to detail page
      setTimeout(() => navigate(`/learning/${id}`), 1500);
    } catch (error) {
      console.error('Failed to update progress', error);
      setUpdating(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!resource || !enrollment) return <div className="p-12 text-center">Enrollment not found.</div>;

  const isCompleted = enrollment.progressPercentage === 100;

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Player Header */}
      <header className="bg-neutral-950 text-white p-4 flex justify-between items-center border-b border-neutral-800 shadow-md">
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="text-neutral-300 hover:text-white" onClick={() => navigate(`/learning/${id}`)}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="font-semibold text-lg">{resource.title}</h1>
            <p className="text-xs text-neutral-400">{resource.provider}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-64">
            <div className="flex justify-between text-xs text-neutral-400 mb-1">
              <span>Progress</span>
              <span>{enrollment.progressPercentage}%</span>
            </div>
            <ProgressBar value={enrollment.progressPercentage} />
          </div>
          <Button variant="outline" className="text-white border-neutral-700 hover:bg-neutral-800" onClick={() => setShowAssistant(!showAssistant)}>
            <MessageSquare size={16} className="mr-2" /> AI Assistant
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* LMS Course Navigation Sidebar (Left) */}
        <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full text-neutral-300">
          <div className="p-4 border-b border-neutral-800">
            <h3 className="font-semibold text-white">Course Content</h3>
            <p className="text-xs text-neutral-500 mt-1">1 of 4 completed</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-0">
              <button className="w-full text-left px-4 py-3 border-b border-neutral-800 bg-neutral-800/50 flex items-start gap-3">
                <CheckCircle size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">1. Introduction</div>
                  <div className="text-xs text-neutral-500 mt-1">5 mins • Video</div>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border-b border-neutral-800 border-l-2 border-l-primary-500 bg-neutral-800 text-white flex items-start gap-3">
                <div className="w-4 h-4 rounded-full border border-neutral-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">2. Core Concepts</div>
                  <div className="text-xs text-neutral-400 mt-1">15 mins • Interactive</div>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border-b border-neutral-800 hover:bg-neutral-800/50 flex items-start gap-3 opacity-60 cursor-not-allowed">
                <div className="w-4 h-4 rounded-full border border-neutral-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">3. Advanced Techniques</div>
                  <div className="text-xs text-neutral-500 mt-1">20 mins • Reading</div>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border-b border-neutral-800 hover:bg-neutral-800/50 flex items-start gap-3 opacity-60 cursor-not-allowed">
                <div className="w-4 h-4 rounded-full border border-neutral-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium">4. Final Quiz</div>
                  <div className="text-xs text-neutral-500 mt-1">10 mins • Assessment</div>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Content Player */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-white relative bg-black">
          <div className="max-w-4xl w-full bg-neutral-900 rounded-lg p-12 text-center shadow-2xl border border-neutral-800">
            <h2 className="text-2xl font-bold mb-4">Learning Content Simulator</h2>
            <p className="text-neutral-400 mb-8 leading-relaxed max-w-2xl mx-auto">
              This is where the actual SCORM/Video/Interactive content for <strong className="text-white">{resource.title}</strong> would load. 
              For this phase, this serves as the deterministic player container that tracks engagement.
            </p>
            
            <div className="p-6 bg-neutral-950 rounded border border-neutral-800 inline-block text-left mb-8 shadow-inner">
              <h4 className="font-semibold text-primary-400 mb-3 flex items-center gap-2">
                <MessageSquare size={16} /> Resource Metadata
              </h4>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li className="flex justify-between gap-8"><span className="text-neutral-500">Type</span> <span className="text-white">{resource.type}</span></li>
                <li className="flex justify-between gap-8"><span className="text-neutral-500">Difficulty</span> <span className="text-white">{resource.difficulty}</span></li>
                <li className="flex justify-between gap-8"><span className="text-neutral-500">Est. Time</span> <span className="text-white">{resource.durationMinutes} mins</span></li>
              </ul>
            </div>

            <div>
              {isCompleted ? (
                <div className="inline-flex items-center text-success-400 font-medium text-lg bg-success-900/20 px-6 py-3 rounded-full border border-success-900/50">
                  <CheckCircle size={24} className="mr-2" /> Module Completed
                </div>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleMarkComplete} 
                  disabled={updating}
                  className="bg-primary-600 hover:bg-primary-700 text-white min-w-[200px]"
                >
                  {updating ? 'Saving Progress...' : 'Mark as Complete'}
                </Button>
              )}
            </div>
          </div>
        </main>

        {/* AI Assistant Sidebar (Right) */}
        {showAssistant && (
          <aside className="w-80 h-full border-l border-neutral-800 bg-white text-neutral-900 flex flex-col">
            <LearningAssistant onClose={() => setShowAssistant(false)} />
          </aside>
        )}
      </div>
    </div>
  );
};
