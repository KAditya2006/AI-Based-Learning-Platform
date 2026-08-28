
import useSWR from 'swr';
import { fetchClient } from '../../api/client';
import type { WorkforceMember } from '../../api/admin';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

export const Workforce = () => {
  const { data: workforce, error, isLoading } = useSWR<WorkforceMember[]>('/admin/users', fetchClient);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Workforce Directory</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage organizational members and their competency profiles.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Personnel</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {isLoading && <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Spinner /></div>}
          {error && <div style={{ padding: 'var(--space-6)', color: 'var(--color-error-text)' }}>Failed to load workforce data.</div>}
          
          {workforce && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Department</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workforce.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
                        No users found in the system.
                      </TableCell>
                    </TableRow>
                  )}
                  {workforce.map(member => (
                    <TableRow key={member._id}>
                      <TableCell style={{ fontWeight: 500 }}>
                        {member.firstName || member.lastName 
                          ? `${member.firstName || ''} ${member.lastName || ''}`
                          : 'Pending Profile'}
                      </TableCell>
                      <TableCell>{member.user?.email}</TableCell>
                      <TableCell>{member.department?.name || '-'}</TableCell>
                      <TableCell>{member.designation?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="success">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <a href="#" style={{ fontSize: '0.875rem' }}>View Profile</a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
