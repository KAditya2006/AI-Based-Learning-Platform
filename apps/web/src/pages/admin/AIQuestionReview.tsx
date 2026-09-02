import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { adminAIApi, GeneratedQuestion } from '../../api/adminAI';
import { Check, X, BookOpen, BrainCircuit } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';

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
    const interval = setInterval(loadQueue, 10000);
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

  if (loading) return <div style={{ height: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>
          AI Question Review Queue
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
          Human-in-the-loop review for AI-generated assessment items.
        </p>
      </div>

      {questions.length === 0 ? (
        <div style={{ padding: 'var(--sp-12)', textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <BookOpen size={48} style={{ margin: '0 auto var(--sp-4)', color: 'var(--text-muted)' }} />
          <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-1)' }}>The review queue is empty.</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Head to the AI Assessment Studio to generate more questions.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
          {questions.map((q, idx) => (
            <Card key={q._id} variant="ai">
              <CardHeader style={{ background: 'var(--primary-50)', padding: '12px 20px', borderBottom: '1px solid var(--primary-100)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)', color: 'var(--primary-800)', fontWeight: 600 }}>Draft #{idx + 1} &bull; {q.difficulty}</span>
                  <Badge variant="warning">AWAITING REVIEW</Badge>
                </div>
              </CardHeader>
              <CardContent style={{ padding: 'var(--sp-6)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)', lineHeight: 1.5 }}>{q.text}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                  {q.options.map(opt => {
                    const isCorrect = opt.id === q.correctOptionId;
                    return (
                      <div key={opt.id} style={{ 
                        padding: '12px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                        background: isCorrect ? 'var(--success-bg)' : 'var(--bg-default)', 
                        border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--border)'}` 
                      }}>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: isCorrect ? 'var(--success-strong)' : 'var(--text-muted)' }}>
                          {opt.id.toUpperCase()}.
                        </span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: isCorrect ? 600 : 400 }}>{opt.text}</span>
                        {isCorrect && <Badge variant="success" style={{ marginLeft: 'auto' }}>Correct Answer</Badge>}
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: 'var(--sp-4)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px' }}>
                    <BrainCircuit size={16} color="var(--accent-lavender)" /> AI Explanation
                  </div>
                  {q.explanation}
                </div>
              </CardContent>
              <CardFooter style={{ background: 'var(--bg-subtle)', borderTop: '1px solid var(--border)', padding: '12px 20px', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
                <Button variant="outline" style={{ color: 'var(--error-strong)', borderColor: 'var(--error-border)' }} onClick={() => handleAction(q._id, 'reject')} leftIcon={<X size={16} />}>
                  Reject & Discard
                </Button>
                <Button style={{ background: 'var(--success-600)' }} onClick={() => handleAction(q._id, 'approve')} leftIcon={<Check size={16} />}>
                  Approve & Publish
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
