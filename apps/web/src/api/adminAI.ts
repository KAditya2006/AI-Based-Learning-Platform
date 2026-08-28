import { fetchClient } from './client';

export interface GeneratedQuestion {
  _id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  difficulty: string;
  status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED';
  materialId?: any;
  competencyId?: any;
}

export const adminAIApi = {
  generateQuestions: (data: { materialId: string; competencyId: string; difficulty: string; count: number }) => {
    return fetchClient<{ _id: string }>('/ai/admin/generate-mcqs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  getReviewQueue: () => {
    return fetchClient<GeneratedQuestion[]>('/ai/admin/review-queue');
  },

  approveQuestion: (id: string) => {
    return fetchClient<GeneratedQuestion>(`/ai/admin/questions/${id}/approve`, {
      method: 'POST'
    });
  },

  rejectQuestion: (id: string) => {
    return fetchClient<GeneratedQuestion>(`/ai/admin/questions/${id}/reject`, {
      method: 'POST'
    });
  }
};
