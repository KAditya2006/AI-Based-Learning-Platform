import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { adminAIApi, GeneratedQuestion } from '../../api/adminAI';
import { Check, X, BookOpen } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export const AIQuestionReview = () => {
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const loadQueue = async () => {
    try {
      const q = await adminAIApi.getReviewQueue();
      setQuestions(q);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 10000); // Poll for new questions
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') await adminAIApi.approveQuestion(id);
      else await adminAIApi.rejectQuestion(id);
      await loadQueue();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex h-32 items-center justify-center"><Spinner /></div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Question Review Queue</h1>
        <p className="text-neutral-500">Human-in-the-loop review for AI-generated assessment items.</p>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-neutral-500">
            <BookOpen size={48} className="mx-auto mb-4 text-neutral-300" />
            <p>The review queue is empty.</p>
            <p className="text-sm">Head to the AI Assessment Studio to generate more questions.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <Card key={q._id} className="border-primary-200">
              <CardHeader className="bg-primary-50 py-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-primary-700">Draft #{idx + 1} • {q.difficulty}</span>
                  <span className="bg-primary-200 text-primary-800 text-xs px-2 py-1 rounded">AWAITING REVIEW</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h3 className="text-lg font-medium mb-4">{q.text}</h3>
                <div className="space-y-2 mb-4">
                  {q.options.map(opt => (
                    <div 
                      key={opt.id} 
                      className={`p-3 rounded border ${opt.id === q.correctOptionId ? 'bg-success-50 border-success-200 font-medium' : 'bg-white border-neutral-200'}`}
                    >
                      <span className="inline-block w-6 text-neutral-400">{opt.id.toUpperCase()}.</span> {opt.text}
                      {opt.id === q.correctOptionId && <span className="ml-2 text-success-600 text-sm">(Correct Answer)</span>}
                    </div>
                  ))}
                </div>
                <div className="bg-neutral-50 p-3 text-sm rounded border border-neutral-200 text-neutral-600">
                  <strong>AI Explanation:</strong> {q.explanation}
                </div>
              </CardContent>
              <CardFooter className="bg-neutral-50 border-t border-neutral-100 justify-end gap-3 py-3">
                <Button variant="outline" className="text-error-600 hover:bg-error-50" onClick={() => handleAction(q._id, 'reject')}>
                  <X size={16} className="mr-2" /> Reject & Discard
                </Button>
                <Button className="bg-success-600 hover:bg-success-700 text-white" onClick={() => handleAction(q._id, 'approve')}>
                  <Check size={16} className="mr-2" /> Approve & Publish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
