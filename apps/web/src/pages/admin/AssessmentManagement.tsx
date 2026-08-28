import React, { useEffect, useState } from 'react';
import { assessmentApi } from '../../api/assessments';
import type { Assessment } from '../../api/assessments';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit2, Target } from 'lucide-react';

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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Assessment Management</h1>
          <p className="text-neutral-500">Configure competency tests and exams.</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" /> Create Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessments ({assessments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Spinner /></div>
          ) : assessments.length === 0 ? (
            <div className="text-center p-8 text-neutral-500 border-2 border-dashed rounded-md bg-neutral-50">
              <Target size={32} className="mx-auto mb-2 opacity-50" />
              <p>No assessments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-sm font-medium text-neutral-500">
                    <th className="pb-3 pr-4">Title</th>
                    <th className="pb-3 pr-4">Competency</th>
                    <th className="pb-3 pr-4">Questions</th>
                    <th className="pb-3 pr-4">Pass Score</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {assessments.map(a => (
                    <tr key={a._id} className="border-b last:border-0 hover:bg-neutral-50">
                      <td className="py-3 pr-4 font-medium">{a.title}</td>
                      <td className="py-3 pr-4">{a.competency?.name || 'Unmapped'}</td>
                      <td className="py-3 pr-4">{a.questions.length}</td>
                      <td className="py-3 pr-4">{a.passingScore}%</td>
                      <td className="py-3 pr-4">
                        <Badge variant={a.isPublished ? 'success' : 'neutral'}>
                          {a.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <Button variant="outline" size="sm">
                          <Edit2 size={14} className="mr-1" /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
