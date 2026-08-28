import { IAIProvider } from './IAIProvider';
import { MockAIProvider } from './MockAIProvider';
import { ExternalAIProvider } from './ExternalAIProvider';
import { AIRequestLog } from '../models';

export class AIService {
  private provider: IAIProvider;
  private providerName: string;

  constructor() {
    this.providerName = process.env.AI_PROVIDER || 'gemini';
    if (this.providerName === 'external') {
      this.provider = new ExternalAIProvider();
    } else if (this.providerName === 'gemini') {
      const { GeminiAIProvider } = require('./GeminiAIProvider');
      this.provider = new GeminiAIProvider();
    } else {
      this.provider = new MockAIProvider();
    }
  }

  private async logRequest(
    operation: string, 
    requesterId: string, 
    jobId: string | undefined,
    execute: () => Promise<any>
  ) {
    const startTime = Date.now();
    try {
      const result = await execute();
      const durationMs = Date.now() - startTime;
      
      await AIRequestLog.create({
        operation,
        requesterId,
        provider: this.providerName,
        modelName: process.env.AI_MODEL || 'mock-model',
        status: 'SUCCESS',
        durationMs,
        jobId
      }).catch(err => console.error('Failed to write AI audit log', err));

      return result;
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      
      await AIRequestLog.create({
        operation,
        requesterId,
        provider: this.providerName,
        modelName: process.env.AI_MODEL || 'mock-model',
        status: 'ERROR',
        durationMs,
        jobId,
        errorDetails: error.message
      }).catch(err => console.error('Failed to write AI audit log', err));

      throw error;
    }
  }

  async generateMCQs(requesterId: string, jobId: string, textChunks: string[], competencyName: string, difficulty: string, count: number) {
    return this.logRequest('generateMCQs', requesterId, jobId, () => 
      this.provider.generateMCQs(textChunks, competencyName, difficulty, count)
    );
  }

  async generateRecommendations(requesterId: string, profileContext: any, availableResources: any[]) {
    return this.logRequest('generateRecommendations', requesterId, undefined, () => 
      this.provider.generateRecommendations(profileContext, availableResources)
    );
  }

  async chat(requesterId: string, history: any[], contextChunks?: string[]) {
    return this.logRequest('chat', requesterId, undefined, () => 
      this.provider.chat(history, contextChunks)
    );
  }

  async analyzeCompetency(requesterId: string, learnerData: any) {
    return this.logRequest('analyzeCompetency', requesterId, undefined, () => 
      this.provider.analyzeCompetency(learnerData)
    );
  }
}

export const aiService = new AIService();
