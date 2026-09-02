import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../api/assessments';
import type { Assessment } from '../../api/assessments';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, ChevronRight, Flag, Timer, X } from 'lucide-react';


export const AssessmentPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!id) return;
      try {
        const data = await assessmentApi.getAssessment(id);
        setAssessment(data);
        if (data.durationMinutes) {
          setTimeLeft(data.durationMinutes * 60);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAssessment();
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handlePreSubmit = () => {
    if (!assessment) return;
    if (Object.keys(answers).length < assessment.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleSubmit = async () => {
    if (!id || !assessment) return;
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionId]) => ({ questionId, selectedOptionId }));
      const result = await assessmentApi.submitAssessment(id, formattedAnswers);
      navigate(`/assessments/${id}/result`, { state: { attempt: result.attempt, previousLevel: result.previousLevel, newLevel: result.newLevel } });
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center animate-pulse">
        <div className="w-full max-w-4xl h-[60vh] bg-surface-variant rounded-lg"></div>
      </div>
    );
  }

  if (!assessment) {
    return <div className="p-xl text-center text-error font-body-lg">Assessment not found.</div>;
  }

  const currentQuestion = assessment.questions[currentQuestionIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / assessment.questions.length) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed animate-in fade-in duration-300">
      {/* Distraction-free Header */}
      <header className="w-full sticky top-0 h-14 bg-surface dark:bg-surface-dim border-b border-outline-variant dark:border-outline flex justify-between items-center px-lg max-w-screen-2xl mx-auto z-50">
        <div className="flex items-center gap-md">
          <span className="font-headline-md text-headline-md text-primary dark:text-primary-fixed-dim font-bold tracking-tight">SkillIntel</span>
          <div className="h-6 w-[1px] bg-outline-variant hidden sm:block"></div>
          <span className="font-body-md text-body-md text-on-surface-variant hidden sm:block">{assessment.title}</span>
        </div>
        
        <div className="flex items-center gap-lg">
          {timeLeft !== null && (
            <div className="flex items-center gap-sm bg-surface-container-low px-md py-sm rounded-lg border border-surface-variant">
              <Timer className="text-[20px] text-on-surface-variant" />
              <span className="font-label-caps text-label-caps text-on-surface tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
          <button onClick={() => navigate('/learner/learning')} className="font-label-caps text-label-caps text-on-surface-variant hover:text-error transition-colors flex items-center gap-xs">
            <X className="text-[18px]" />
            Exit
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center py-xl px-md sm:px-lg w-full max-w-4xl mx-auto">
        <div className="w-full flex flex-col gap-xl">
          
          {/* Progress & Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md w-full border-b border-surface-variant pb-md">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant block mb-sm">Scenario Based Analysis</span>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Question {currentQuestionIdx + 1} of {assessment.questions.length}</h2>
            </div>
            <button className="group flex items-center gap-sm px-md py-sm rounded border border-surface-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <Flag className="text-[20px] text-on-surface-variant group-hover:text-primary transition-colors" />
              <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary transition-colors">Flag for review</span>
            </button>
          </div>
          
          {/* Question Area */}
          <div className="w-full max-w-3xl">
            <p className="font-headline-md text-headline-md text-on-surface leading-snug mb-lg">
              {currentQuestion.text}
            </p>
            {/* If there's a context/description for the question, it would go here */}
            {/* <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">Context...</p> */}
            
            {/* Options */}
            <div className="flex flex-col gap-md w-full mt-xl">
              {currentQuestion.options.map(option => {
                const qId = currentQuestion._id || currentQuestion.id || `${currentQuestionIdx}`;
                return (
                  <label key={option.id} className="relative flex items-start p-lg border border-surface-variant bg-surface-container-lowest rounded-lg cursor-pointer hover:border-outline hover:bg-surface-container-low transition-all duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary-fixed/20 shadow-[0px_1px_3px_rgba(26,22,20,0.05)] has-[:checked]:shadow-none group">
                    <div className="flex items-center h-6">
                      <input 
                        type="radio" 
                        name={`question-${qId}`} 
                        className="h-5 w-5 border-outline-variant text-primary focus:ring-primary focus:ring-offset-2 bg-surface-container-lowest cursor-pointer" 
                        checked={answers[qId] === option.id}
                        onChange={() => handleSelectOption(qId, option.id)}
                      />
                    </div>
                    <div className="ml-md">
                      <span className="font-body-lg text-body-lg text-on-surface block group-has-[:checked]:font-semibold group-has-[:checked]:text-on-primary-fixed">
                        {option.text}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="w-full sticky bottom-0 bg-surface border-t border-surface-variant py-md px-lg flex justify-between items-center max-w-screen-2xl mx-auto z-10">
        <button 
          onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIdx === 0}
          className="flex items-center justify-center px-lg py-sm border border-primary text-primary bg-surface-container-lowest rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary-fixed transition-colors font-label-caps text-label-caps min-w-[120px] shadow-[0px_1px_3px_rgba(26,22,20,0.05)] active:shadow-none active:border-outline active:bg-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="text-[18px] mr-sm" />
          Previous
        </button>
        
        <div className="hidden sm:flex gap-sm items-center">
          {/* Custom dot progress indicator based on design */}
          <div className="flex gap-1 items-center">
             {assessment.questions.map((q, idx) => {
                const dotQId = q._id || q.id || `${idx}`;
                return (
                  <div key={idx} className={`rounded-full ${idx === currentQuestionIdx ? 'w-8 h-2 bg-primary' : (answers[dotQId] ? 'w-2 h-2 bg-primary/40' : 'w-2 h-2 bg-surface-variant')}`}></div>
                );
             })}
          </div>
          <span className="font-caption text-caption text-on-surface-variant ml-sm">{Math.round(progress)}% Complete</span>
        </div>
        
        {currentQuestionIdx === assessment.questions.length - 1 ? (
          <button 
            onClick={handlePreSubmit}
            disabled={submitting || answeredCount < assessment.questions.length}
            className="flex items-center justify-center px-lg py-sm bg-primary text-on-primary rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary-container transition-colors font-label-caps text-label-caps min-w-[120px] shadow-[0px_1px_3px_rgba(26,22,20,0.05)] active:shadow-none active:bg-surface-tint disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestionIdx(prev => Math.min(assessment.questions.length - 1, prev + 1))}
            className="flex items-center justify-center px-lg py-sm bg-primary text-on-primary rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:bg-primary-container transition-colors font-label-caps text-label-caps min-w-[120px] shadow-[0px_1px_3px_rgba(26,22,20,0.05)] active:shadow-none active:bg-surface-tint"
          >
            Next
            <ChevronRight className="text-[18px] ml-sm" />
          </button>
        )}
      </footer>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Assessment"
        description="Are you sure you want to submit your answers? You cannot change them after submission."
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={handleSubmit} isLoading={submitting}>Confirm Submit</Button>
          </>
        }
      >
        <p className="text-body-md text-on-surface-variant">
          You have answered all {assessment.questions.length} questions. Your results will be calculated immediately and your competency profile will be updated.
        </p>
      </Modal>
    </div>
  );
};
