import React, { useEffect, useState } from 'react';
import { assessmentApi } from '../../api/assessments';
import type { Assessment } from '../../api/assessments';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Plus, Edit2, Target, Search } from 'lucide-react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../../components/ui/Table';

export const AssessmentManagement: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await assessmentApi.getAssessments();
        setAssessments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>Assessment Management</h1>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Configure competency tests and exams.</p>
        </div>
        <Button leftIcon={<Plus size={16} />}>Create Assessment</Button>
      </div>

      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
            <div>
              <CardTitle>Assessments</CardTitle>
              <CardDescription>{assessments.length} configured tests.</CardDescription>
            </div>
            <div style={{ width: '280px' }}>
              <Input placeholder="Search assessments..." leftIcon={<Search size={15} />} />
            </div>
          </div>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 'var(--sp-12)', display: 'flex', justifyContent: 'center' }}><Spinner /></div>
          ) : assessments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-12)', color: 'var(--text-muted)' }}>
              <Target size={32} style={{ margin: '0 auto var(--sp-2)', opacity: 0.5 }} />
              <p>No assessments found.</p>
            </div>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Title</TableHeader>
                    <TableHeader>Competency</TableHeader>
                    <TableHeader>Questions</TableHeader>
                    <TableHeader>Pass Score</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader style={{ textAlign: 'right' }}>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessments.map(a => (
                    <TableRow key={a._id}>
                      <TableCell style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.title}</TableCell>
                      <TableCell>
                        {a.competency?.name ? <Badge variant="neutral">{a.competency.name}</Badge> : <span style={{ color: 'var(--text-muted)' }}>Unmapped</span>}
                      </TableCell>
                      <TableCell style={{ fontWeight: 600 }}>{a.questions.length}</TableCell>
                      <TableCell>{a.passingScore}%</TableCell>
                      <TableCell>
                        <Badge variant={a.isPublished ? 'success' : 'neutral'} dot>
                          {a.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Button variant="ghost" size="sm" leftIcon={<Edit2 size={14} />}>Edit</Button>
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
