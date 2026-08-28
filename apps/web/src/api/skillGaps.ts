import { fetchClient } from './client';

export interface SkillGap {
  _id: string;
  competency: { _id: string; name: string; domain: string };
  currentLevel: number;
  requiredLevel: number;
  gapSize: number;
  gapClassification: number;
}

export const skillGapsApi = {
  getSkillGaps: () => fetchClient<SkillGap[]>('/skill-gaps'),
  getSkillGapById: (id: string) => fetchClient<SkillGap>(`/skill-gaps/${id}`),
};
