import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { BrainCircuit, CheckCircle, AlertTriangle } from 'lucide-react';
import { fetchClient } from '../../api/client';

export const CompetencyInsights = () => {
  const [insights, setInsights] = useState<{ strengths: string[]; weaknesses: string[]; observations: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We fetch from a new endpoint we will create, or simulate a fetch
    fetchClient<any>('/ai/learner/competency-insights')
      .then(setInsights)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <BrainCircuit size={32} className="text-primary-600" />
        <div>
          <h1 className="text-2xl font-semibold">AI Competency Insights</h1>
          <p className="text-neutral-500">Intelligent analysis of your skill profile.</p>
        </div>
      </div>

      {!insights ? (
        <Card>
          <CardContent className="p-8 text-center text-neutral-500">
            <p>No insights available at this time.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-success-200">
            <CardHeader className="bg-success-50">
              <CardTitle className="text-success-800 flex items-center gap-2">
                <CheckCircle size={20} /> Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                {insights.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-warning-200">
            <CardHeader className="bg-warning-50">
              <CardTitle className="text-warning-800 flex items-center gap-2">
                <AlertTriangle size={20} /> Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                {insights.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-primary-100">
            <CardHeader className="bg-primary-50">
              <CardTitle className="text-primary-800">AI Observation</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-neutral-700 leading-relaxed">
              {insights.observations}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
