import { fetchClient } from './client';

export interface Question {
  _id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId?: string; // Only returned for Admin
  explanation?: string; // Only returned for Admin or post-submission
  competency: any;
  difficulty: string;
  source: string;
  status: string;
}

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  competency: any;
  passingScore: number;
  durationMinutes?: number;
  attemptPolicy: string;
  questions: Question[];
  isPublished: boolean;
}

export interface AssessmentAttempt {
  _id: string;
  learner: string;
  assessment: string;
  answers: { questionId: string; selectedOptionId: string }[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt: string;
}

export const assessmentApi = {
  getAssessments: (competencyId?: string) => 
    fetchClient<Assessment[]>(`/quiz/assessments${competencyId ? `?competency=${competencyId}` : ''}`),
    
  getAssessment: (id: string) => 
    fetchClient<Assessment>(`/quiz/assessments/${id}`),
    
  submitAssessment: (id: string, answers: { questionId: string; selectedOptionId: string }[]) => 
    fetchClient<{ attempt: AssessmentAttempt, previousLevel: number, newLevel: number }>(`/quiz/assessments/${id}/submit`, { method: 'POST', data: { answers } }),
    
  // Admin
  createAssessment: (data: Partial<Assessment>) =>
    fetchClient<Assessment>('/quiz/assessments', { method: 'POST', data }),
    
  updateAssessment: (id: string, data: Partial<Assessment>) =>
    fetchClient<Assessment>(`/quiz/assessments/${id}`, { method: 'PUT', data }),
    
  getQuestions: () => 
    fetchClient<Question[]>('/quiz/questions'),
    
  createQuestion: (data: Partial<Question>) =>
    fetchClient<Question>('/quiz/questions', { method: 'POST', data })
};
