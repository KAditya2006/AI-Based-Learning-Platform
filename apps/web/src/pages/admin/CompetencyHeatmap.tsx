import useSWR from 'swr';
import { Card, CardContent } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { adminApi } from '../../api/admin';

export const CompetencyHeatmap = () => {
  const { data, error, mutate } = useSWR('/admin/intelligence/heatmap', adminApi.getCompetencyHeatmap);

  if (error) {
    return <ErrorState title="Failed to load Competency Heatmap" message={error.message} onRetry={() => mutate()} />;
  }

  if (!data) {
    return <div>Loading heatmap...</div>;
  }

  // Process data to matrix
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Competency Heatmap</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Cross-departmental view of skill gaps and maturity.</p>
      </div>

      <Card>
        <CardContent style={{ padding: 0, overflowX: 'auto' }}>
          {compList.length === 0 ? (
            <p style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Insufficient data for this analysis.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr>
                  <th style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>Competency</th>
                  {deptList.map(dept => (
                    <th key={dept} style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>{dept}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compList.map(comp => (
                  <tr key={comp} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 500 }}>{comp}</td>
                    {deptList.map(dept => {
                      const cell = matrix[comp]?.[dept];
                      let bgColor = 'transparent';
                      let textColor = 'inherit';
                      if (cell) {
                        if (cell.criticalGaps > 0) {
                          bgColor = 'var(--color-danger-100)';
                          textColor = 'var(--color-danger-700)';
                        } else if (cell.avgGap > 2) {
                          bgColor = 'var(--color-warning-100)';
                          textColor = 'var(--color-warning-700)';
                        } else if (cell.avgGap > 0) {
                          bgColor = 'var(--color-primary-50)';
                          textColor = 'var(--color-primary-700)';
                        } else {
                          bgColor = 'var(--color-success-50)';
                          textColor = 'var(--color-success-700)';
                        }
                      }
                      
                      return (
                        <td key={dept} style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: bgColor, color: textColor }}>
                          {cell ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: 600 }}>Avg Gap: {cell.avgGap.toFixed(1)}</span>
                              <span style={{ fontSize: '0.75rem' }}>{cell.criticalGaps} Critical</span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>-</span>
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
