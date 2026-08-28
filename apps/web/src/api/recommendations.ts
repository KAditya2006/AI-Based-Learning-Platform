import { fetchClient } from './client';

export interface Recommendation {
  _id: string;
  title: string;
  description: string;
  type: 'COURSE' | 'ARTICLE' | 'WORKSHOP';
  source: string;
  durationMinutes: number;
  competencyId: string;
  skillGapId?: string;
  difficulty: string;
}

export const recommendationsApi = {
  // Stub for future AI integration
  getForUser: () => fetchClient<Recommendation[]>('/recommendations'),
};
