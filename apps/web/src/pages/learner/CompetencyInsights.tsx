import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import { Activity, AlertTriangle, FileText, TrendingUp, Users } from 'lucide-react';

export const CompetencyInsights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.email?.split('@')[0] || 'Official';
  const role = user?.role === 'admin' ? 'System Administrator' : 'Learner';

  const { data: response, error } = useSWR('/ai/learner/competency-insights', fetchClient);
  const insights = (response as any)?.data || response;

  if (error) return <div className="p-xl text-center text-error">Failed to load insights.</div>;
  if (!insights) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-body-md text-on-surface-variant">Analyzing competency data...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full mx-auto gap-xl animate-in fade-in duration-300 min-h-screen">
      <div className="flex-1 max-w-4xl mx-auto py-xl">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">AI Competency Insights</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl">Deep analysis of your professional capabilities.</p>
        
        <div className="bg-surface border border-surface-variant rounded-lg p-xl shadow-sm">
          <pre className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
            {typeof insights === 'string' ? insights : JSON.stringify(insights, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

