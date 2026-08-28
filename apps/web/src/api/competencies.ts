import { fetchClient } from './client';

export interface CompetencyLevel {
  level: number;
  description: string;
}

export interface Competency {
  _id: string;
  name: string;
  description: string;
  domain: string;
  levels: CompetencyLevel[];
  isActive: boolean;
}

export const competenciesApi = {
  getAll: () => fetchClient<Competency[]>('/competencies'),
  getById: (id: string) => fetchClient<Competency>(`/competencies/${id}`),
};
