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
              Assessment Completed
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

        {/* Overall Proficiency Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
          <div className="md:col-span-12 bg-surface-container-lowest border border-surface-variant rounded-lg p-lg bento-card flex flex-col justify-between h-full">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-xs">Overall Score</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">Your calculated score for this assessment.</p>
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

          {/* Recommended Action Section */}
          <div className="md:col-span-12 bg-surface-container-low border border-surface-variant rounded-lg p-lg flex flex-col md:flex-row items-center justify-between gap-lg">
            <div className="flex-grow">
              <h3 className="font-headline-md text-headline-md text-on-background mb-xs">Next Steps</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Your assessment has been officially recorded. Your new competency level will now factor into your skill gap analysis. Visit your dashboard to see your updated learning recommendations.
              </p>
            </div>
            <button onClick={() => navigate('/dashboard')} className="bg-primary text-white border-none rounded px-xl py-md font-label-caps text-label-caps whitespace-nowrap hover:bg-primary-container transition-colors duration-200">
              Go to Dashboard
            </button>
          </div>
          
          <div className="md:col-span-12 flex justify-center mt-xl">
             <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
             </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
