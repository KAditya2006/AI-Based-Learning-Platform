import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Upload, FileText, CheckCircle, Clock } from 'lucide-react';
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
      // Simulate file upload metadata
      const newMat = await materialsApi.uploadMaterial({
        title,
        filename: `${title.replace(/\s/g, '_')}.pdf`,
        mimeType: 'application/pdf',
        sizeBytes: 1048576 // 1MB mock
      });
      // Start processing immediately
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
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Material Ingestion</h1>
          <p className="text-neutral-500">Upload documents for AI processing and chunking.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleUpload} className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Document Title</label>
              <input
                type="text"
                className="w-full border rounded p-2 focus:ring-primary-500"
                placeholder="e.g. National Education Policy 2020"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Select File (Mock)</label>
              <input type="file" className="w-full border rounded p-1.5 bg-neutral-50" disabled />
            </div>
            <Button type="submit" disabled={uploading || !title.trim()}>
              <Upload size={16} className="mr-2" /> {uploading ? 'Uploading...' : 'Upload & Process'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        <h3 className="font-semibold text-lg mt-4">Ingestion Queue</h3>
        {materials.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 border rounded bg-white">No materials uploaded yet.</div>
        ) : (
          materials.map(mat => (
            <div key={mat._id} className="bg-white p-4 rounded shadow-sm border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${mat.processingStatus === 'READY' ? 'bg-success-100 text-success-600' : 'bg-primary-100 text-primary-600'}`}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="font-medium">{mat.title}</h4>
                  <p className="text-xs text-neutral-500">{mat.filename} • {(mat.sizeBytes / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <div>
                {mat.processingStatus === 'READY' ? (
                  <span className="flex items-center text-success-600 text-sm font-medium"><CheckCircle size={16} className="mr-1" /> Chunked & Ready</span>
                ) : mat.processingStatus === 'PROCESSING' ? (
                  <span className="flex items-center text-primary-600 text-sm font-medium"><Clock size={16} className="mr-1 animate-spin" /> Processing AI Embeddings...</span>
                ) : (
                  <span className="text-neutral-500 text-sm">{mat.processingStatus}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
