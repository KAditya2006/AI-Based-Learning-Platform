import { fetchClient } from './client';

export interface Material {
  _id: string;
  title: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  processingStatus: 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
  createdAt: string;
}

export const materialsApi = {
  uploadMaterial: (data: { title: string; filename: string; mimeType: string; sizeBytes: number }) => {
    // In a real app we would use FormData to upload the actual file
    // For this POC we simulate it with a JSON payload
    return fetchClient<Material>('/ai/materials', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getMaterials: () => {
    return fetchClient<Material[]>('/ai/materials');
  },

  processMaterial: (id: string) => {
    return fetchClient<any>(`/ai/materials/${id}/process`, {
      method: 'POST'
    });
  },

  getStatus: (id: string) => {
    return fetchClient<Material>(`/ai/materials/${id}`);
  }
};
