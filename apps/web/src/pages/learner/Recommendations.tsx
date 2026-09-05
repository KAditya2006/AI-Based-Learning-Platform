import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { aiApi } from '../../api/ai';
import { ArrowRight, Bookmark, Clock, GraduationCap, PieChart, Sliders, Sparkles, Star, Users } from 'lucide-react';

export const Recommendations = () => {
  const navigate = useNavigate();
  const { data: response, error } = useSWR('/ai/learner/recommendations', aiApi.getRecommendations);
  const recommendations: any[] = (response as any)?.data || response;

  if (error) return <div className="p-xl text-center text-error">Failed to load recommendations.</div>;
  if (!recommendations) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-body-md text-on-surface-variant">Generating personalized recommendations...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-grow px-lg max-w-screen-2xl mx-auto w-full py-xl space-y-xl font-body-md text-on-surface bg-background min-h-screen animate-in fade-in duration-300">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md pb-md border-b border-outline-variant">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Development Recommendations</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            AI-driven learning paths personalized for your career trajectory. Based on your recent competency assessment.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-lg">
        {recommendations.length === 0 ? (
          <div className="md:col-span-12 p-lg text-center text-on-surface-variant bg-surface-container rounded-lg border border-outline-variant">
            No recommendations available yet. Complete an assessment to generate your personalized learning path.
          </div>
        ) : (
          recommendations.map((rec: any) => (
            <div key={rec._id} className="md:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0px_1px_3px_rgba(26,22,20,0.05)] flex flex-col md:flex-row gap-lg">
              <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                <Sparkles className="text-on-primary-fixed text-3xl" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">{rec.title}</h2>
                    <span className={`px-sm py-xs rounded font-label-caps text-label-caps ${
                      rec.priority === 'CRITICAL' || rec.priority === 'HIGH' ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {rec.priority} PRIORITY
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-md">{rec.reason}</p>
                </div>
                <div className="flex items-center gap-md">
                  <span className="flex items-center gap-xs text-on-surface-variant font-caption text-caption">
                    <Clock className="w-4 h-4" /> {rec.estimatedEffortMinutes || 60} mins
                  </span>
                  <span className="flex items-center gap-xs text-on-surface-variant font-caption text-caption">
                    <Star className="w-4 h-4" /> {rec.source}
                  </span>
                </div>
              </div>
              <div className="flex items-end shrink-0">
                <button 
                  onClick={() => rec.resourceId && navigate(`/learning/${rec.resourceId}`)}
                  disabled={!rec.resourceId}
                  className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-caps text-label-caps flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
                >
                  Start Learning <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};
