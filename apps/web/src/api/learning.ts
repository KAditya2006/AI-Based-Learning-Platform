import { fetchClient } from './client';

export interface LearningResource {
  _id: string;
  title: string;
  description: string;
  provider: string;
  source: string;
  type: string;
  durationMinutes: number;
  difficulty: string;
  competencies: any[];
  externalUrl?: string;
  isActive: boolean;
}

export interface Enrollment {
  _id: string;
  learner: string;
  resource: LearningResource;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';
  progressPercentage: number;
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
}

export const learningApi = {
  getLibrary: (competencyId?: string) => 
    fetchClient<LearningResource[]>(`/learning/library${competencyId ? `?competency=${competencyId}` : ''}`),
  
  getResource: (id: string) => 
    fetchClient<LearningResource>(`/learning/resources/${id}`),
    
  getEnrollments: () => 
    fetchClient<Enrollment[]>('/learning/enrollments'),
    
  enroll: (id: string) => 
    fetchClient<Enrollment>(`/learning/resources/${id}/enroll`, { method: 'POST' }),
    
  updateProgress: (id: string, progressPercentage: number) => 
    fetchClient<Enrollment>(`/learning/resources/${id}/progress`, { method: 'PUT', data: { progressPercentage } }),

  getPath: () => 
    fetchClient<any>('/learning/path'),
    
  generatePath: () => 
    fetchClient<any>('/learning/path/generate', { method: 'POST' }),
    
  // Admin
  createResource: (data: Partial<LearningResource>) =>
    fetchClient<LearningResource>('/learning/resources', { method: 'POST', data }),
    
  updateResource: (id: string, data: Partial<LearningResource>) =>
    fetchClient<LearningResource>(`/learning/resources/${id}`, { method: 'PUT', data })
};
