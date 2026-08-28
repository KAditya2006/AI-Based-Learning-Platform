import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Brain, Settings2, Play } from 'lucide-react';
import { adminAIApi } from '../../api/adminAI';
import { materialsApi, Material } from '../../api/materials';
import { useNavigate } from 'react-router-dom';
import { fetchClient } from '../../api/client';

export const AIAssessmentStudio = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    materialId: '',
    competencyId: '',
    difficulty: 'INTERMEDIATE',
    count: 3
  });

  useEffect(() => {
    materialsApi.getMaterials().then(m => setMaterials(m.filter(x => x.processingStatus === 'READY')));
    fetchClient<any[]>('/admin/competencies').then(setCompetencies);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      await adminAIApi.generateQuestions(formData);
      alert('Generation job started! Check the Review Queue in a few seconds.');
      navigate('/admin/ai-review');
    } catch (error) {
      console.error(error);
      alert('Failed to start generation');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary-100 text-primary-700 rounded-lg">
          <Brain size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">AI Assessment Studio</h1>
          <p className="text-neutral-500">Generate high-quality multiple-choice questions from ingested materials.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-neutral-100">
          <CardTitle className="flex items-center gap-2">
            <Settings2 size={18} /> Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Material</label>
                <select 
                  className="w-full border rounded p-2"
                  value={formData.materialId}
                  onChange={e => setFormData({ ...formData, materialId: e.target.value })}
                  required
                >
                  <option value="">Select a processed document...</option>
                  {materials.map(m => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500">Only fully ingested and chunked materials appear here.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Competency</label>
                <select 
                  className="w-full border rounded p-2"
                  value={formData.competencyId}
                  onChange={e => setFormData({ ...formData, competencyId: e.target.value })}
                  required
                >
                  <option value="">Select competency focus...</option>
                  {competencies.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <select 
                  className="w-full border rounded p-2"
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Question Count</label>
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  className="w-full border rounded p-2"
                  value={formData.count}
                  onChange={e => setFormData({ ...formData, count: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <Button type="submit" disabled={generating} className="bg-primary-600">
                <Play size={16} className="mr-2" /> {generating ? 'Queuing AI Job...' : 'Generate Questions'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
