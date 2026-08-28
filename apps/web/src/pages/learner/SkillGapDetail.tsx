import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { SkillGap } from '../../api/skillGaps';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Skeleton } from '../../components/ui/Skeleton';

export const SkillGapDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: gap, error, isLoading } = useSWR<SkillGap>(id ? `/skill-gaps/${id}` : null, fetchClient);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="w-24 h-8 mb-4" />
          <Skeleton className="w-1/2 h-8 mb-2" />
          <Skeleton className="w-1/4 h-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="w-full h-[300px]" />
          <Skeleton className="w-full h-[300px]" />
        </div>
      </div>
    );
  }

  if (error || !gap) return <div className="text-danger-500 p-4 bg-danger-50 border border-danger-200 rounded">Failed to load skill gap detail.</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="mb-4">
          &larr; Back to Dashboard
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">{gap.competency?.name || 'Unknown Competency'}</h1>
          <Badge variant={gap.gapSize > 0 ? 'warning' : 'success'}>
            {gap.gapSize > 0 ? `Gap: ${gap.gapSize} Levels` : 'Met'}
          </Badge>
        </div>
        <p className="text-neutral-500 mt-1">
          Domain: {gap.competency?.domain || 'N/A'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gap Analysis</CardTitle>
            <CardDescription>Comparison of your current skill vs role requirement</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-neutral-500">Current Proficiency</span>
                <span className="text-sm font-semibold">Level {gap.currentLevel}</span>
              </div>
              <ProgressBar value={gap.currentLevel} max={5} />
              <p className="text-sm text-neutral-400 mt-2">
                Based on your self-assessments and verified experiences.
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-neutral-500">Required by Role</span>
                <span className="text-sm font-semibold">Level {gap.requiredLevel}</span>
              </div>
              <ProgressBar value={gap.requiredLevel} max={5} />
              <p className="text-sm text-neutral-400 mt-2">
                Required for your current designation to perform efficiently.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Intelligence Insights</CardTitle>
            <CardDescription>Why this gap matters for your career progression</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="p-4 bg-primary-50 text-primary-900 rounded-md border border-primary-100">
              <h4 className="font-semibold text-sm mb-1">Impact on Role</h4>
              <p className="text-sm opacity-90">
                Enhancing your {gap.competency?.name} will significantly improve your ability to handle complex projects and increases your alignment with upcoming departmental objectives.
              </p>
            </div>
            
            <div className="p-4 bg-neutral-50 text-neutral-700 rounded-md border border-neutral-200">
              <h4 className="font-semibold text-sm mb-1">Estimated Effort</h4>
              <p className="text-sm opacity-90">
                ~15 hours of focused learning and 1 assessment required to bridge this gap.
              </p>
            </div>

            <div className="mt-2">
              <Button onClick={() => navigate('/recommendations')} className="w-full justify-center">
                View AI Learning Recommendations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
