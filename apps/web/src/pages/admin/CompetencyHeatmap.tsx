import useSWR from 'swr';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { adminApi } from '../../api/admin';
import { Skeleton } from '../../components/ui/Skeleton';
import { Activity } from 'lucide-react';

export const CompetencyHeatmap = () => {
  const { data, error, mutate } = useSWR('/admin/intelligence/heatmap', adminApi.getCompetencyHeatmap);

  if (error) {
    return <ErrorState title="Failed to load Competency Heatmap" message={error.message} onRetry={() => mutate()} />;
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
        <Skeleton style={{ height: '40px', width: '300px' }} />
        <Skeleton style={{ height: '400px' }} />
      </div>
    );
  }

  const matrix: Record<string, Record<string, { avgGap: number; criticalGaps: number }>> = {};
  const departments = new Set<string>();
  const competencies = new Set<string>();

  data.forEach((item: any) => {
    departments.add(item.departmentName);
    competencies.add(item.competencyName);
    if (!matrix[item.competencyName]) matrix[item.competencyName] = {};
    matrix[item.competencyName][item.departmentName] = {
      avgGap: item.avgGap,
      criticalGaps: item.criticalGaps
    };
  });

  const deptList = Array.from(departments).sort();
  const compList = Array.from(competencies).sort();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>
          Competency Heatmap
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          Cross-departmental view of skill gaps and maturity.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <Activity size={18} color="var(--primary-600)" />
            <div>
              <CardTitle>Skill Gap Matrix</CardTitle>
              <CardDescription>Hover over cells for detailed gap metrics.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent style={{ padding: 0, overflowX: 'auto' }}>
          {compList.length === 0 ? (
            <p style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
              Insufficient data for this analysis.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', fontWeight: 600, color: 'var(--text-secondary)' }}>Competency</th>
                  {deptList.map(dept => (
                    <th key={dept} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', fontWeight: 600, color: 'var(--text-secondary)' }}>{dept}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compList.map(comp => (
                  <tr key={comp} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-default)' }}>{comp}</td>
                    {deptList.map(dept => {
                      const cell = matrix[comp]?.[dept];
                      let bgColor = 'var(--bg-default)';
                      let textColor = 'var(--text-muted)';
                      let borderColor = 'transparent';
                      
                      if (cell) {
                        if (cell.criticalGaps > 0) {
                          bgColor = 'var(--error-bg)'; textColor = 'var(--error-strong)'; borderColor = 'var(--error-border)';
                        } else if (cell.avgGap > 2) {
                          bgColor = 'var(--warning-bg)'; textColor = 'var(--warning-strong)'; borderColor = 'var(--warning-border)';
                        } else if (cell.avgGap > 0) {
                          bgColor = 'var(--primary-50)'; textColor = 'var(--primary-700)'; borderColor = 'var(--primary-200)';
                        } else {
                          bgColor = 'var(--success-bg)'; textColor = 'var(--success-strong)'; borderColor = 'var(--success-border)';
                        }
                      }
                      
                      return (
                        <td key={dept} style={{ padding: '8px', background: 'var(--bg-default)' }}>
                          {cell ? (
                            <div style={{
                              display: 'flex', flexDirection: 'column', gap: '2px', padding: '8px 12px', borderRadius: '6px',
                              background: bgColor, color: textColor, border: `1px solid ${borderColor}`
                            }}>
                              <span style={{ fontWeight: 700 }}>Avg Gap: {cell.avgGap.toFixed(1)}</span>
                              <span style={{ fontSize: '11px', fontWeight: 600 }}>{cell.criticalGaps} Critical</span>
                            </div>
                          ) : (
                            <div style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
