import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { learningApi } from '../../api/learning';
import type { LearningResource, Enrollment } from '../../api/learning';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<LearningResource | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const [resData, enrollmentsData] = await Promise.all([
          learningApi.getResource(id),
          learningApi.getEnrollments()
        ]);
        setResource(resData);
        const myEnrollment = enrollmentsData.find(e => e.resource._id === id);
        if (myEnrollment) {
          setEnrollment(myEnrollment);
        }
      } catch (error) {
        console.error('Failed to load resource', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleStart = async () => {
    if (!id) return;
    setEnrolling(true);
    try {
      if (!enrollment) {
        await learningApi.enroll(id);
      }
      navigate(`/learning/${id}/player`);
    } catch (error) {
      console.error('Failed to enroll', error);
      setEnrolling(false);
    }
  };

  if (loading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;
  if (!resource) return <div className="p-12 text-center">Resource not found.</div>;

  const isCompleted = enrollment?.status === 'COMPLETED';
  const hasStarted = enrollment && enrollment.status !== 'COMPLETED';

  return (
    <div className="page-container max-w-4xl mx-auto">
      <Button variant="secondary" className="mb-4 pl-0" onClick={() => navigate('/explore')}>
        <ArrowLeft size={16} className="mr-2" /> Back to Library
      </Button>

      <Card className="mb-6 border-t-4 border-t-primary-600">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="neutral">{resource.type}</Badge>
                <Badge variant="neutral">{resource.difficulty}</Badge>
                <span className="text-sm text-neutral-500">Duration: {resource.durationMinutes} mins</span>
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{resource.title}</h1>
              <p className="text-neutral-600">By {resource.provider} • Source: {resource.source}</p>
            </div>
            
            <div className="text-right">
              {isCompleted ? (
                <div className="flex items-center text-success-600 font-medium bg-success-50 px-4 py-2 rounded-md">
                  <CheckCircle size={20} className="mr-2" /> Completed
                </div>
              ) : (
                <Button size="lg" onClick={handleStart} disabled={enrolling}>
                  <Play size={18} className="mr-2" /> 
                  {hasStarted ? 'Continue Learning' : 'Start Learning'}
                </Button>
              )}
            </div>
          </div>
          
          {hasStarted && (
            <div className="mb-6 p-4 bg-neutral-50 rounded-md border border-neutral-200">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-neutral-700">Your Progress</span>
                <span className="text-neutral-600">{enrollment.progressPercentage}%</span>
              </div>
              <ProgressBar value={enrollment.progressPercentage} />
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">About this Resource</h3>
            <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
