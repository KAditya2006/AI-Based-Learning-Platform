import { fetchClient } from './client';
import type { User } from './auth';
import type { Competency } from './competencies';

export interface WorkforceMember {
  _id?: string;
  id?: string;
  user?: User;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  department?: { name: string } | string;
  designation?: { name: string } | string;
  [key: string]: any;
}

export const adminApi = {
  getWorkforce: () => fetchClient<{items: WorkforceMember[], page: number, totalPages: number, total: number}>('/admin/users'),
  getLearnerDetail: (userId: string) => fetchClient<WorkforceMember>(`/admin/users/${userId}`),
  createCompetency: (data: Partial<Competency>) => 
    fetchClient<Competency>('/competencies', { method: 'POST', body: JSON.stringify(data) }),
  updateCompetency: (id: string, data: Partial<Competency>) => 
    fetchClient<Competency>(`/admin/competencies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAuditLogs: (page = 1) => fetchClient<{items: any[], page: number, totalPages: number, total: number}>(`/admin/audit-logs?page=${page}`),
  
  getAnalytics: () => fetchClient<any>('/admin/analytics'),
  getDepartmentIntelligence: () => fetchClient<any>('/admin/intelligence/departments'),
  getRoleIntelligence: () => fetchClient<any>('/admin/intelligence/roles'),
  getCompetencyHeatmap: () => fetchClient<any>('/admin/intelligence/heatmap'),
  getLearningEffectiveness: () => fetchClient<any>('/admin/intelligence/learning-effectiveness'),
  getInsights: () => fetchClient<any>('/admin/intelligence/insights')
};
