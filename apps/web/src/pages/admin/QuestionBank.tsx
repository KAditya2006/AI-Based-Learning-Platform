import React, { useEffect, useState } from 'react';
import { assessmentApi } from '../../api/assessments';
import type { Question } from '../../api/assessments';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { Plus, Edit2, HelpCircle } from 'lucide-react';

export const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await assessmentApi.getQuestions();
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Question Bank</h1>
          <p className="text-neutral-500">Manage assessment questions and map them to competencies.</p>
        </div>
        <Button>
          <Plus size={16} className="mr-2" /> Add Question
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Spinner /></div>
          ) : questions.length === 0 ? (
            <div className="text-center p-8 text-neutral-500 border-2 border-dashed rounded-md bg-neutral-50">
              <HelpCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>No questions found in the bank.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-sm font-medium text-neutral-500">
                    <th className="pb-3 pr-4 w-1/2">Question Text</th>
                    <th className="pb-3 pr-4">Competency</th>
                    <th className="pb-3 pr-4">Difficulty</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {questions.map(q => (
                    <tr key={q._id} className="border-b last:border-0 hover:bg-neutral-50">
                      <td className="py-3 pr-4">
                        <p className="line-clamp-2 font-medium">{q.text}</p>
                      </td>
                      <td className="py-3 pr-4">
                        {q.competency?.name || 'Unmapped'}
                      </td>
                      <td className="py-3 pr-4">{q.difficulty}</td>
                      <td className="py-3 pr-4">
                        <Badge variant={q.status === 'ACTIVE' ? 'success' : 'neutral'}>
                          {q.status}
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
