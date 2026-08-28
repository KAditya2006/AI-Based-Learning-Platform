import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import type { Competency } from '../../api/competencies';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const CompetencyManagement = () => {
  const navigate = useNavigate();
  const { data: competencies, error, isLoading } = useSWR<Competency[]>('/competencies', fetchClient);

  if (isLoading) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Spinner /></div>;
  if (error) return <div style={{ color: 'var(--color-error-text)' }}>Failed to load competencies.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Competency Framework</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage organizational competencies and proficiency levels.</p>
        </div>
        <Button onClick={() => navigate('/admin/competencies/new')}>+ Create New</Button>
      </div>

      <Card>
        <CardContent style={{ padding: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Domain</TableHeader>
                  <TableHeader>Levels</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {competencies?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No competencies found.
                    </TableCell>
                  </TableRow>
                )}
                {competencies?.map(comp => (
                  <TableRow key={comp._id}>
                    <TableCell style={{ fontWeight: 500 }}>{comp.name}</TableCell>
                    <TableCell>{comp.domain}</TableCell>
                    <TableCell>{comp.levels.length}</TableCell>
                    <TableCell>
                      <Badge variant={comp.isActive ? 'primary' : 'neutral'}>
                        {comp.isActive ? 'Active' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/admin/competencies/${comp._id}`)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
};
