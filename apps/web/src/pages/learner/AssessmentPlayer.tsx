import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { assessmentApi } from '../../api/assessments';
import type { Assessment } from '../../api/assessments';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Card, CardContent } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';

export const AssessmentPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const loadAssessment = async () => {
      if (!id) return;
      try {
        const data = await assessmentApi.getAssessment(id);
        setAssessment(data);
      } catch (error) {
        console.error('Failed to load assessment', error);
      } finally {
        setLoading(false);
      }
    };
    loadAssessment();
  }, [id]);

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
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId
      }));
      
      const result = await assessmentApi.submitAssessment(id, formattedAnswers);
      
      navigate(`/assessments/${id}/result`, { state: { attempt: result.attempt, previousLevel: result.previousLevel, newLevel: result.newLevel } });
    } catch (error) {
      console.error('Failed to submit assessment', error);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;
  if (!assessment) return <div className="p-12 text-center">Assessment not found.</div>;

  const currentQuestion = assessment.questions[currentQuestionIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / assessment.questions.length) * 100;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="font-semibold text-lg">{assessment.title}</h1>
            <p className="text-xs text-neutral-500">{assessment.questions.length} Questions • Passing Score: {assessment.passingScore}%</p>
          </div>
        </div>
        <div className="w-64">
          <div className="flex justify-between text-xs text-neutral-600 mb-1">
            <span>Answered {answeredCount} of {assessment.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
            Question {currentQuestionIdx + 1} of {assessment.questions.length}
          </span>
          {assessment.durationMinutes && (
            <div className="flex items-center text-warning-600 bg-warning-50 px-3 py-1 rounded text-sm font-medium">
              <Clock size={16} className="mr-2" /> Time Limit: {assessment.durationMinutes}m
            </div>
          )}
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-6 text-neutral-900 leading-snug">
              {currentQuestion.text}
            </h2>
            
            <div className="space-y-3">
              {currentQuestion.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(currentQuestion._id, option.id)}
                  className={`w-full text-left p-4 rounded border-2 transition-all duration-200 ${
                    answers[currentQuestion._id] === option.id 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                      answers[currentQuestion._id] === option.id ? 'border-primary-600' : 'border-neutral-300'
                    }`}>
                      {answers[currentQuestion._id] === option.id && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                    </div>
                    <span className={answers[currentQuestion._id] === option.id ? 'text-primary-900 font-medium' : 'text-neutral-700'}>
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIdx === assessment.questions.length - 1 ? (
            <Button 
              onClick={handlePreSubmit} 
              disabled={submitting || answeredCount < assessment.questions.length}
            >
              {submitting ? 'Submitting...' : 'Review & Submit'}
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentQuestionIdx(prev => Math.min(assessment.questions.length - 1, prev + 1))}
            >
              Next Question
            </Button>
          )}
        </div>
      </main>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Assessment"
        description="Are you sure you want to submit your answers? You cannot change them after submission."
        footer={
          <>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              Confirm Submit
            </Button>
          </>
        }
      >
        <div className="py-2">
          <p className="text-sm text-neutral-700">
            You have answered all {assessment.questions.length} questions. Your results will be calculated immediately.
          </p>
        </div>
      </Modal>
    </div>
  );
};
