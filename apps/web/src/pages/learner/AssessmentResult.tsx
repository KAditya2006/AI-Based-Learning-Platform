import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import type { AssessmentAttempt } from '../../api/assessments';

export const AssessmentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const attempt = location.state?.attempt as AssessmentAttempt | undefined;

  if (!attempt) {
    return (
      <div className="p-12 text-center">
        <p>No result found.</p>
        <Button className="mt-4" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="page-container max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-8">
        {attempt.passed ? (
          <div className="inline-flex items-center justify-center w-24 h-24 bg-success-100 text-success-600 rounded-full mb-6">
            <CheckCircle size={48} />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center w-24 h-24 bg-danger-100 text-danger-600 rounded-full mb-6">
            <XCircle size={48} />
          </div>
        )}
        
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          {attempt.passed ? 'Assessment Passed!' : 'Assessment Failed'}
        </h1>
        <p className="text-lg text-neutral-600">
          You scored <span className="font-semibold text-neutral-900">{Math.round(attempt.percentage)}%</span>
        </p>
      </div>

      <Card className="w-full mb-8">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg border-b pb-3 mb-4">Attempt Summary</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-neutral-600">Total Questions</span>
              <span className="font-medium text-neutral-900">{attempt.answers.length}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-600">Correct Answers</span>
              <span className="font-medium text-success-600">{attempt.score}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-neutral-600">Score</span>
              <span className="font-medium text-neutral-900">{attempt.percentage.toFixed(1)}%</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-primary-50 text-primary-800 p-4 rounded-md mb-8 w-full text-center">
        <p className="font-medium mb-1">Competency Updated</p>
        <p className="text-sm">
          Your skill level has been updated from <span className="font-bold">Level {location.state?.previousLevel || 1}</span> to <span className="font-bold">Level {location.state?.newLevel || 1}</span>. 
          Your skill gaps and learning path have been dynamically recalculated.
        </p>
      </div>

      <div className="flex gap-4">
        {!attempt.passed && (
          <Button variant="outline" onClick={() => navigate(`/assessments/${id}`)}>
            Try Again
          </Button>
        )}
        <Button onClick={() => navigate('/dashboard')}>
          Continue to Dashboard <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
