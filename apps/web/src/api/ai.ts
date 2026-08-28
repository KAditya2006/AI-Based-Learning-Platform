import { fetchClient } from './client';

export interface Recommendation {
  _id: string;
  source: string;
  title: string;
  resourceId?: string;
  externalId?: string;
  reason: string;
  expectedOutcome?: string;
  estimatedEffortMinutes?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const aiApi = {
  getRecommendations: () => {
    return fetchClient<Recommendation[]>('/ai/learner/recommendations');
  },

  chat: (conversationId: string | null, message: string) => {
    return fetchClient<{ conversationId: string; reply: ChatMessage }>('/ai/learner/chat', {
      method: 'POST',
      body: JSON.stringify({ conversationId, message })
    });
  },

  getChatHistory: (conversationId: string) => {
    return fetchClient<ChatMessage[]>(`/ai/learner/chat/${conversationId}`);
  },

  getJobStatus: (jobId: string) => {
    return fetchClient<any>(`/ai/jobs/${jobId}`);
  }
};
