import { GoogleGenAI } from '@google/genai';
import { IAIProvider, AIChatMessage } from './IAIProvider';
import { z } from 'zod';

const mcqSchema = z.object({
  questions: z.array(z.object({
    text: z.string(),
    options: z.array(z.object({
      id: z.string(),
      text: z.string()
    })),
    correctOptionId: z.string(),
    explanation: z.string()
  }))
});

const recommendationsSchema = z.object({
  recommendations: z.array(z.object({
    resourceId: z.string(),
    reason: z.string(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH'])
  }))
});

const competencyInsightsSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  observations: z.string()
});

export class GeminiAIProvider implements IAIProvider {
  private ai: GoogleGenAI;
  private model: string;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } else {
      this.ai = {} as GoogleGenAI;
    }
    this.model = process.env.AI_MODEL || 'gemini-2.5-flash';
  }

  private async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiAIProvider] AI call failed, retrying... (${i + 1}/${maxRetries})`);
        await new Promise(res => setTimeout(res, 2000 * (i + 1))); // exponential backoff
      }
    }
    console.error(JSON.stringify({
      level: 'ERROR',
      service: 'GeminiAIProvider',
      message: 'AI call failed after max retries',
      error: lastError instanceof Error ? lastError.message : String(lastError)
    }));
    throw lastError;
  }

  async generateMCQs(textChunks: string[], competencyName: string, difficulty: string, count: number) {
    const prompt = `You are an expert assessment creator. Generate exactly ${count} multiple-choice questions for the competency "${competencyName}" at a "${difficulty}" level based on the provided text. 
Return ONLY valid JSON matching this schema: 
{ "questions": [ { "text": "string", "options": [{ "id": "a|b|c|d", "text": "string" }], "correctOptionId": "a|b|c|d", "explanation": "string" } ] }

Context text:
${textChunks.join('\n\n---\n\n')}`;

    try {
      const response = await this.withRetry(() => this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      }));
      const parsed = JSON.parse(response.text || '{}');
      return mcqSchema.parse(parsed);
    } catch (err) {
      console.error(JSON.stringify({ level: 'ERROR', service: 'GeminiAIProvider', method: 'generateMCQs', error: err instanceof Error ? err.message : String(err) }));
      return { questions: [] };
    }
  }

  async generateRecommendations(profileContext: any, availableResources: { id: string; title: string; competency: string }[]) {
    const prompt = `You are an AI learning advisor. Analyze the user profile and skill gaps to recommend the best resources from the provided list. 
Return ONLY valid JSON matching: 
{ "recommendations": [ { "resourceId": "string", "reason": "string", "priority": "LOW|MEDIUM|HIGH" } ] }

Profile: ${JSON.stringify(profileContext)}

Available Resources: ${JSON.stringify(availableResources)}`;

    try {
      const response = await this.withRetry(() => this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      }));
      const parsed = JSON.parse(response.text || '{}');
      return recommendationsSchema.parse(parsed);
    } catch (err) {
      console.error(JSON.stringify({ level: 'ERROR', service: 'GeminiAIProvider', method: 'generateRecommendations', error: err instanceof Error ? err.message : String(err) }));
      return { recommendations: [] };
    }
  }

  async chat(history: AIChatMessage[], contextChunks?: string[]) {
    let systemInstruction = 'You are a helpful contextual learning assistant for government officials.';
    if (contextChunks && contextChunks.length > 0) {
      systemInstruction += `\n\nUse this context to answer questions:\n${contextChunks.join('\n---\n')}`;
    }

    // Convert history format to Gemini format
    const contents = history.map(msg => {
      // system messages are not allowed in contents array for gemini, so we filter them out and use systemInstruction
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      };
    }).filter(msg => msg.role !== 'system');

    try {
      const response = await this.withRetry(() => this.ai.models.generateContent({
        model: this.model,
        contents,
        config: {
          systemInstruction,
        }
      }));
      return { message: response.text || '' };
    } catch (err) {
      console.error(JSON.stringify({ level: 'ERROR', service: 'GeminiAIProvider', method: 'chat', error: err instanceof Error ? err.message : String(err) }));
      return { message: 'I am currently experiencing technical difficulties. Please try again later.' };
    }
  }

  async analyzeCompetency(learnerData: any) {
    const prompt = `You are a skill intelligence analyst. Analyze the learner data and provide insights. 
Return ONLY valid JSON matching: 
{ "strengths": ["string"], "weaknesses": ["string"], "observations": "string" }

Learner Data: ${JSON.stringify(learnerData)}`;

    try {
      const response = await this.withRetry(() => this.ai.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      }));
      const parsed = JSON.parse(response.text || '{}');
      return competencyInsightsSchema.parse(parsed);
    } catch (err) {
      console.error(JSON.stringify({ level: 'ERROR', service: 'GeminiAIProvider', method: 'analyzeCompetency', error: err instanceof Error ? err.message : String(err) }));
      return { strengths: [], weaknesses: [], observations: 'Data unavailable due to AI service error.' };
    }
  }
}
