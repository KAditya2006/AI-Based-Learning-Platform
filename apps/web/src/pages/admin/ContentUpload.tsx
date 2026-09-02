import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Upload, FileText, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { materialsApi, Material } from '../../api/materials';

export const ContentUpload = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');

  const loadMaterials = async () => {
    try {
      const data = await materialsApi.getMaterials();
      setMaterials(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadMaterials();
    const interval = setInterval(loadMaterials, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setUploading(true);
    try {
      const newMat = await materialsApi.uploadMaterial({
        title, filename: `${title.replace(/\s/g, '_')}.pdf`, mimeType: 'application/pdf', sizeBytes: 1048576
      });
      await materialsApi.processMaterial(newMat._id);
      setTitle('');
      await loadMaterials();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--sp-2)' }}>Material Ingestion</h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>Upload documents for AI processing and semantic chunking.</p>
      </div>

      <Card variant="ai">
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <Sparkles size={18} color="var(--accent-lavender)" />
            <CardTitle>AI Document Processing</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px' }}>
              <Input
                label="Document Title"
                placeholder="e.g. National Education Policy 2020"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: '1 1 240px' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Select File</label>
              <input type="file" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-default)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)' }} />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Button type="submit" disabled={uploading || !title.trim()} leftIcon={<Upload size={16} />}>
                {uploading ? 'Processing...' : 'Upload & Parse'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)' }}>Ingestion Queue</h3>
        {materials.length === 0 ? (
          <div style={{ padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
            No materials uploaded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {materials.map(mat => (
              <Card key={mat._id}>
                <CardContent style={{ padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: mat.processingStatus === 'READY' ? 'var(--success-bg)' : 'var(--primary-50)', color: mat.processingStatus === 'READY' ? 'var(--success-strong)' : 'var(--primary-600)' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>{mat.title}</h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>{mat.filename} &bull; {(mat.sizeBytes / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <div>
                    {mat.processingStatus === 'READY' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success-strong)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '4px 10px', background: 'var(--success-bg)', borderRadius: '100px' }}>
                        <CheckCircle size={14} /> Chunked & Ready
                      </span>
                    ) : mat.processingStatus === 'PROCESSING' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary-600)', fontSize: 'var(--text-xs)', fontWeight: 700, padding: '4px 10px', background: 'var(--primary-50)', borderRadius: '100px' }}>
                        <Clock size={14} style={{ animation: 'spin 2s linear infinite' }} /> Processing AI Embeddings...
                      </span>
                    ) : (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{mat.processingStatus}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
