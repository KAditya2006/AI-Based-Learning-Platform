import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';
import { adminApi } from '../../api/admin';
import type { Competency } from '../../api/competencies';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const CompetencyDetailAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const { data: competency, error, isLoading } = useSWR<Competency>(
    !isNew && id ? `/competencies/${id}` : null, 
    fetchClient
  );

  const [formData, setFormData] = useState<Partial<Competency>>({
    name: '',
    description: '',
    domain: '',
    isActive: false,
    levels: [
      { level: 1, description: '' },
      { level: 2, description: '' },
      { level: 3, description: '' },
      { level: 4, description: '' },
      { level: 5, description: '' }
    ]
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (competency && !isNew) {
      setFormData(competency);
    }
  }, [competency, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isNew) {
        await adminApi.createCompetency(formData);
      } else if (id) {
        await adminApi.updateCompetency(id, formData);
      }
      navigate('/admin/competencies');
    } catch (err) {
      console.error('Failed to save competency', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLevelChange = (index: number, value: string) => {
    const newLevels = [...(formData.levels || [])];
    if (newLevels[index]) {
      newLevels[index].description = value;
    }
    setFormData({ ...formData, levels: newLevels });
  };

  if (!isNew && isLoading) return <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Spinner /></div>;
  if (!isNew && error) return <div style={{ color: 'var(--color-error-text)' }}>Failed to load competency.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '800px' }}>
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/competencies')} style={{ marginBottom: 'var(--space-4)' }}>
          &larr; Back to Framework
        </Button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{isNew ? 'Create Competency' : 'Edit Competency'}</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input 
              label="Competency Name" 
              required
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <Input 
              label="Domain (e.g., Technical, Behavioral, Leadership)" 
              required
              value={formData.domain || ''}
              onChange={e => setFormData({ ...formData, domain: e.target.value })}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
              <textarea 
                required
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                style={{ 
                  width: '100%', minHeight: '100px', padding: 'var(--space-3)', 
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                  fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <label htmlFor="isActive" style={{ fontSize: '0.875rem' }}>Active (Visible to Learners)</label>
            </div>
          </CardContent>

          <CardHeader>
            <CardTitle>Proficiency Levels</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {formData.levels?.map((level, index) => (
              <Input
                key={index}
                label={`Level ${level.level}`}
                required
                value={level.description}
                onChange={e => handleLevelChange(index, e.target.value)}
              />
            ))}
          </CardContent>

          <CardFooter style={{ justifyContent: 'flex-end' }}>
            <Button type="submit" isLoading={isSaving}>Save Competency</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
