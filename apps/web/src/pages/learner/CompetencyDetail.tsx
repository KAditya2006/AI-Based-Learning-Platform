import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { Competency } from '../../api/competencies';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Target, ArrowLeft, Layers } from 'lucide-react';

export const CompetencyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: competency, error, isLoading } = useSWR<Competency>(id ? `/competencies/${id}` : null, fetchClient);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
        <Skeleton style={{ width: '100px', height: '32px' }} />
        <Skeleton style={{ height: '120px' }} />
        <Skeleton style={{ height: '300px' }} />
      </div>
    );
  }

  if (error || !competency) return <div style={{ color: 'var(--error-text)' }}>Failed to load competency detail.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/competencies')} leftIcon={<ArrowLeft size={14} />} style={{ marginBottom: 'var(--sp-4)' }}>
          Back to Library
        </Button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--sp-4)', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>
              {competency.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <Badge variant="neutral">
                <Layers size={12} style={{ marginRight: '4px' }} />
                Domain: {competency.domain}
              </Badge>
              <Badge variant={competency.isActive ? 'primary' : 'neutral'}>
                {competency.isActive ? 'Active Framework' : 'Draft'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent style={{ padding: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', gap: 'var(--sp-4)' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', flexShrink: 0,
              background: 'var(--ai-glow-subtle)', border: '1px solid var(--border-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Target size={24} color="var(--accent-lavender)" />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Description
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {competency.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)' }}>
          Proficiency Levels
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {(competency.levels || []).map((level, i) => (
            <Card key={level.level} style={{ animation: `fade-in 300ms ${i * 50}ms both` }}>
              <CardContent style={{ display: 'flex', gap: 'var(--sp-5)', alignItems: 'center' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-elevated)', border: '2px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: 'var(--text-base)', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  {level.level}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Level {level.level}
                  </div>
                  <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {level.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
