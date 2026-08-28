import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Users, BookOpen, Brain, TrendingUp } from 'lucide-react';
import { adminApi } from '../../api/admin';
import useSWR from 'swr';
import { ErrorState } from '../../components/ui/ErrorState';

export const AdminDashboard = () => {
  const { data: workforceData, error: workforceError } = useSWR('/admin/analytics', adminApi.getAnalytics);
  const { data: effectivenessData, error: effectError } = useSWR('/admin/intelligence/learning-effectiveness', adminApi.getLearningEffectiveness);
  const { data: insightsData, error: insightsError } = useSWR('/admin/intelligence/insights', adminApi.getInsights);

  const error = workforceError || effectError || insightsError;

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Intelligence Overview</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Organizational overview and macro-level analytics.</p>
        </div>
        <ErrorState title="Failed to load analytics" message={error.message || 'There was an issue fetching dashboard analytics.'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const workforce = workforceData?.workforce || { totalUsers: 0, departments: [], roles: [] };
  const effectiveness = effectivenessData || { totalEnrollments: 0, completionRate: 0, averageAssessmentScore: 0 };
  const insights = insightsData || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Intelligence Overview</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Organizational overview and macro-level analytics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Users size={18} /> Active Personnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>
              {!workforceData ? '...' : workforce.totalUsers}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <BookOpen size={18} /> Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>
              {!effectivenessData ? '...' : effectiveness.totalEnrollments}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Completion Rate: {effectiveness.completionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <TrendingUp size={18} /> Avg Assessment Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>
              {!effectivenessData ? '...' : `${effectiveness.averageAssessmentScore.toFixed(1)}%`}
            </h2>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Brain size={18} /> Active Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.length === 0 ? (
               <p style={{ color: 'var(--color-text-muted)' }}>No critical insights currently detected.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {insights.map((insight: any) => (
                  <li key={insight._id} style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 'var(--space-1)',
                    padding: 'var(--space-3)', 
                    backgroundColor: insight.severity === 'CRITICAL' ? 'var(--color-danger-50)' : 'var(--color-warning-50)', 
                    border: `1px solid ${insight.severity === 'CRITICAL' ? 'var(--color-danger-200)' : 'var(--color-warning-200)'}`,
                    borderRadius: 'var(--radius-sm)' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, color: insight.severity === 'CRITICAL' ? 'var(--color-danger-700)' : 'var(--color-warning-700)' }}>
                        [{insight.type}] {insight.title}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Scope: {insight.scope}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem' }}>{insight.explanation}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
