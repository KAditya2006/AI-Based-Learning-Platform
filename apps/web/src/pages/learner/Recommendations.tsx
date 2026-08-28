import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { BrainCircuit, PlayCircle, Info } from 'lucide-react';
import { aiApi, Recommendation } from '../../api/ai';
import { useNavigate } from 'react-router-dom';

import { Skeleton } from '../../components/ui/Skeleton';

// (imports)

export const Recommendations = () => {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    aiApi.getRecommendations()
      .then(setRecs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-64 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="w-full h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <BrainCircuit size={32} className="text-primary-600" />
        <div>
          <h1 className="text-2xl font-semibold">AI Recommendations</h1>
          <p className="text-neutral-500">Personalized learning suggestions based on your skill gaps.</p>
        </div>
      </div>

      {recs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-neutral-500">
            <p>You have no current recommendations. Great job maintaining your competencies!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recs.map(rec => (
            <Card key={rec._id} className="flex flex-col border-primary-100 bg-primary-50/10">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={rec.priority === 'HIGH' ? 'error' : 'neutral'}>{rec.priority} Priority</Badge>
                  {rec.source !== 'INTERNAL' && (
                    <Badge variant="warning">{rec.source}</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{rec.title}</CardTitle>
                <CardDescription>
                  {rec.source === 'INTERNAL' 
                    ? 'Internal Platform Course' 
                    : `External Provider Course`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {rec.expectedOutcome && (
                  <div className="mb-3">
                    <strong className="text-sm text-neutral-700">Expected Outcome:</strong>
                    <p className="text-sm text-neutral-600">{rec.expectedOutcome}</p>
                  </div>
                )}
                {rec.estimatedEffortMinutes && (
                  <div className="mb-4">
                    <strong className="text-sm text-neutral-700">Estimated Effort:</strong>
                    <p className="text-sm text-neutral-600">{rec.estimatedEffortMinutes} minutes</p>
                  </div>
                )}
                <div className="bg-white p-3 rounded text-sm text-neutral-700 border border-neutral-200 mb-4 shadow-sm relative">
                  <div className="absolute -top-3 -left-3 bg-white p-1 rounded-full text-primary-500 border border-primary-100">
                    <Info size={16} />
                  </div>
                  <strong className="text-primary-700 block mb-1">AI Contextual Reasoning:</strong>
                  {rec.reason}
                </div>
              </CardContent>
              <CardFooter>
                {rec.source === 'INTERNAL' ? (
                  <Button className="w-full" onClick={() => navigate(`/learning/${rec.resourceId}`)}>
                    <PlayCircle size={16} className="mr-2" /> Start Learning
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" onClick={() => alert(`This would redirect to ${rec.source} portal for course ${rec.externalId}`)}>
                    <PlayCircle size={16} className="mr-2" /> Open External Portal
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
