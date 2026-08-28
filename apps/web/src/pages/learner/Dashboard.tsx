import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { BrainCircuit } from 'lucide-react';
import { ErrorState } from '../../components/ui/ErrorState';
import { fetchClient } from '../../api/client';
import type { SkillGap } from '../../api/skillGaps';
import { learningApi } from '../../api/learning';
import type { Enrollment } from '../../api/learning';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { data: gaps, error, mutate } = useSWR<SkillGap[]>('/skill-gaps', fetchClient);
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [enrollmentsError, setEnrollmentsError] = useState<Error | null>(null);

  const fetchEnrollments = async () => {
    try {
      setLoadingEnrollments(true);
      setEnrollmentsError(null);
      const data = await learningApi.getEnrollments();
      setEnrollments(data.filter(e => e.status !== 'COMPLETED'));
    } catch (err: any) {
      console.error(err);
      setEnrollmentsError(err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-neutral-500">Track your competency growth and learning paths.</p>
      </div>

      {gaps && gaps.some(g => g.gapClassification >= 3) && (
        <Card className="border-warning-200 bg-warning-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning-700">
              <BrainCircuit size={18} /> Learner Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-warning-800">
              We have detected critical skill gaps in your profile. Please navigate to the AI Recommendations tab to find priority learning resources tailored to address these gaps immediately.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identified Skill Gaps</CardTitle>
            <CardDescription>Based on your current role requirements</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {!gaps && !error && (
              <div className="flex flex-col gap-4">
                <Skeleton className="w-full h-[80px]" />
                <Skeleton className="w-full h-[80px]" />
                <Skeleton className="w-full h-[80px]" />
              </div>
            )}
            {error && <ErrorState title="Failed to load skill gaps" message={error.message || 'There was an issue fetching your skill gaps.'} onRetry={() => mutate()} />}
            {gaps?.length === 0 && (
              <div className="text-center py-8 text-neutral-500 border border-dashed rounded bg-neutral-50">
                <p className="mb-2 text-lg">No skill gaps identified</p>
                <p className="text-sm">You are currently meeting all competency requirements for your role.</p>
              </div>
            )}
            
            {gaps?.map(gap => (
              <div key={gap._id} className="flex flex-col gap-2 border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{gap.competency.name}</span>
                  <Badge variant={gap.gapClassification >= 3 ? 'error' : gap.gapClassification === 2 ? 'warning' : gap.gapClassification === 1 ? 'primary' : 'success'}>
                    {gap.gapClassification === 4 ? 'CRITICAL GAP' : gap.gapClassification === 3 ? 'HIGH GAP' : gap.gapClassification === 2 ? 'MODERATE GAP' : gap.gapClassification === 1 ? 'MINOR GAP' : 'NO GAP'} ({gap.gapSize})
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={gap.currentLevel} max={5} />
                  </div>
                  <span className="text-xs text-neutral-500">
                    Lvl {gap.currentLevel} / {gap.requiredLevel}
                  </span>
                </div>
                <div className="mt-2 text-right">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/skill-gaps/${gap._id}`)}>View Plan</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Active Learning</CardTitle>
            <CardDescription>Courses and resources you are currently taking</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {loadingEnrollments ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="w-full h-[120px]" />
                <Skeleton className="w-full h-[120px]" />
              </div>
            ) : enrollmentsError ? (
              <ErrorState title="Failed to load active learning" message={enrollmentsError.message || 'There was an issue fetching your enrollments.'} onRetry={() => fetchEnrollments()} />
            ) : enrollments.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 border border-dashed rounded bg-neutral-50">
                <p className="mb-2 text-lg">No active learning</p>
                <p className="text-sm mb-4">You have no active learning at the moment.</p>
                <Button onClick={() => navigate('/explore')}>Explore Library</Button>
              </div>
            ) : (
              enrollments.map(enrollment => (
                <div key={enrollment._id} className="p-4 border rounded-md">
                  <div className="flex justify-between mb-2">
                    <Badge variant="primary">{enrollment.resource.type}</Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{enrollment.resource.title}</h4>
                  <p className="text-xs text-neutral-500 mb-3">{enrollment.resource.provider}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <ProgressBar value={enrollment.progressPercentage} />
                    </div>
                    <span className="text-xs font-medium">{enrollment.progressPercentage}%</span>
                  </div>
                  
                  <div className="mt-4">
                    <Button size="sm" onClick={() => navigate(`/learning/${enrollment.resource._id}`)}>
                      Continue Learning
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
