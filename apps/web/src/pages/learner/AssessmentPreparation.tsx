import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../api/assessments';
import type { Assessment } from '../../api/assessments';
import { ArrowLeft, ArrowRight, CheckCircle, ClipboardCheck, Gavel, Info, ListOrdered, Move, Timer } from 'lucide-react';


export const AssessmentPreparation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!id) return;
      try {
        const data = await assessmentApi.getAssessment(id);
        setAssessment(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAssessment();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center animate-pulse">
        <div className="w-full max-w-4xl h-[60vh] bg-surface-variant rounded-lg"></div>
      </div>
    );
  }

  if (!assessment) {
    return <div className="p-xl text-center text-error font-body-lg">Assessment not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-lg animate-in fade-in duration-300">
      <style>
        {`
          .glass-panel {
              background: rgba(255, 255, 255, 0.7);
              backdrop-filter: blur(12px);
              border: 1px solid var(--tw-colors-surface-variant, #e7e1dd);
              box-shadow: 0px 1px 3px rgba(26, 22, 20, 0.05);
          }
        `}
      </style>
      
      {/* Main Content */}
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-lg py-xl">
        {/* Breadcrumb & Back */}
        <nav aria-label="Breadcrumb" className="mb-lg">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md">
            <ArrowLeft className="mr-sm text-[20px]" />
            Back to Skills Overview
          </button>
        </nav>

        {/* Assessment Header */}
        <header className="mb-xl">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-lg">
            <div>
              <span className="inline-block px-sm py-xs bg-surface-container-highest text-on-surface-variant rounded-sm font-label-caps text-label-caps mb-sm">
                Assessment
              </span>
              <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">{assessment.title}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Evaluate your capabilities and determine your proficiency level within the institutional framework. This assessment is required for competency verification.
              </p>
            </div>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          {/* Left Column: Metrics & Overview */}
          <div className="md:col-span-4 flex flex-col gap-lg">
            {/* Key Metrics Card */}
            <div className="glass-panel rounded-lg p-lg">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md pb-sm border-b border-surface-variant">Assessment Details</h2>
              
              <ul className="space-y-md">
                <li className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-md">
                    <Timer className="text-primary" />
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">Estimated Time</p>
                    <p className="font-body-lg text-body-lg font-semibold text-on-surface">{assessment.durationMinutes || 45} Minutes</p>
                  </div>
                </li>
                
                <li className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-md">
                    <ListOrdered className="text-primary" />
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">Questions</p>
                    <p className="font-body-lg text-body-lg font-semibold text-on-surface">{assessment.questions?.length || 0} Multiple Choice</p>
                  </div>
                </li>
                
                <li className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mr-md">
                    <Move className="text-primary" />
                  </div>
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant">Target Level</p>
                    <p className="font-body-lg text-body-lg font-semibold text-on-surface">Advanced (Level 4)</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Prerequisite Card */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-lg shadow-sm">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-md">Prerequisites</h3>
              <div className="flex items-center gap-sm">
                <CheckCircle className="text-secondary text-[20px]" />
                <span className="font-body-md text-body-md text-on-surface">Foundations Modules (Completed)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Instructions & Actions */}
          <div className="md:col-span-8 flex flex-col gap-lg">
            {/* Instructions Card */}
            <div className="bg-surface-container-lowest border border-surface-variant rounded-lg p-lg shadow-sm h-full flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md pb-sm border-b border-surface-variant">Instructions & Rules</h2>
              
              <div className="space-y-lg flex-grow">
                <div className="flex gap-md">
                  <Info className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Purpose</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                      The objective is to accurately measure your current competence to tailor future learning pathways.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-md">
                  <Gavel className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Test Conditions</h4>
                    <ul className="list-disc list-inside font-body-md text-body-md text-on-surface-variant mt-sm space-y-sm ml-sm">
                      <li>Ensure you have a stable internet connection.</li>
                      <li>Do not refresh the page or navigate away once started.</li>
                      <li>The timer cannot be paused once the assessment begins.</li>
                      <li>Use of external materials is not permitted.</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-md">
                  <ClipboardCheck className="text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Scoring</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                      A passing score of {assessment.passingScore}% is required to achieve certification. Partial credit is not awarded for incorrect answers.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-xl pt-lg border-t border-surface-variant flex flex-col sm:flex-row justify-end gap-md">
                <button 
                  onClick={() => navigate(-1)}
                  className="px-lg py-md rounded-lg font-body-lg text-body-lg font-semibold border border-primary text-primary hover:bg-surface-container-low transition-colors duration-200 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => navigate(`/assessments/${id}`)}
                  className="px-lg py-md rounded-lg font-body-lg text-body-lg font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 shadow-sm flex items-center justify-center gap-sm w-full sm:w-auto"
                >
                  Start Assessment
                  <ArrowRight className="text-[20px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
