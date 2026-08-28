import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BookOpen, ExternalLink, PlayCircle, Loader2 } from 'lucide-react';
import { learningApi } from '../../api/learning';
import { Skeleton } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';

export const LearningPath = () => {
  const [path, setPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    try {
      const data = await learningApi.getPath();
      setPath(data);
    } catch (error) {
      console.error('Failed to fetch path', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const newPath = await learningApi.generatePath();
      setPath(newPath);
    } catch (error) {
      console.error('Failed to generate path', error);
      alert('Failed to generate path. Ensure you have assessments and gaps.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <Skeleton className="w-64 h-10" />
          <Skeleton className="w-40 h-10" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="w-1/2 h-8 mb-4" />
            <Skeleton className="w-3/4 h-4 mb-8" />
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <Skeleton className="w-full h-24 rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <BookOpen style={{ color: 'var(--color-primary-600)' }} size={24} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>My Learning Path</h1>
          </div>
          <p style={{ color: 'var(--color-text-secondary)' }}>Your structured journey to master required competencies.</p>
        </div>
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
          Generate New Path
        </Button>
      </div>

      {!path || !path.sequence || path.sequence.length === 0 ? (
        <Card style={{ border: '1px dashed var(--color-border)', backgroundColor: 'var(--color-background)' }}>
          <CardContent style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
            <BookOpen style={{ color: 'var(--color-text-muted)' }} size={48} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
              No Active Learning Path
            </h3>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>
              Click 'Generate New Path' to ask the AI engine to build a custom learning sequence for your skill gaps.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">{path.title}</h2>
              <p className="text-neutral-600 mb-6">{path.description}</p>
              
              <div className="space-y-4 relative">
                {/* Vertical connecting line */}
                <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-neutral-200"></div>
                
                {path.sequence.map((step: any, index: number) => (
                  <div key={index} className="flex gap-4 relative z-10">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold border-4 border-white shadow-sm">
                      {step.stepIndex}
                    </div>
                    <Card className="flex-grow">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-neutral-100 text-neutral-600">
                              {step.source}
                            </span>
                            <h4 className="font-medium text-text-primary">{step.title}</h4>
                            {step.externalId && (
                              <Badge variant="neutral" className="ml-2">External</Badge>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 mt-1 mb-2">{step.reasoning}</p>
                          <p className="text-sm text-text-muted">{step.type} • {step.duration} mins</p>
                        </div>
                        <div>
                          {step.source === 'INTERNAL' ? (
                            <Button variant="outline" size="sm" onClick={() => window.location.href = `/learning/${step.resourceId}`}>
                              <PlayCircle size={16} className="mr-2" /> Start
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => alert(`Redirect to external portal: ${step.externalId}`)}>
                              <ExternalLink size={16} className="mr-2" /> Open External
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
