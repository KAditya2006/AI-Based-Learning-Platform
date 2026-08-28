import { IAIProvider, AIChatMessage } from './IAIProvider';

export class ExternalAIProvider implements IAIProvider {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
    this.apiKey = process.env.AI_API_KEY || '';
    this.model = process.env.AI_MODEL || 'gpt-4o';
  }

  private async callAPI(systemPrompt: string, userPrompt: string, maxTokens: number = 2000) {
    if (!this.apiKey) {
      throw new Error('AI_API_KEY is not configured for ExternalAIProvider.');
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" },
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`External AI API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  async generateMCQs(textChunks: string[], competencyName: string, difficulty: string, count: number) {
    const systemPrompt = `You are an expert assessment creator. Generate exactly ${count} multiple-choice questions for the competency "${competencyName}" at a "${difficulty}" level based on the provided text. Return ONLY valid JSON matching this schema: { "questions": [ { "text": "string", "options": [{ "id": "a|b|c|d", "text": "string" }], "correctOptionId": "a|b|c|d", "explanation": "string" } ] }`;
    const userPrompt = `Context text:\n\n${textChunks.join('\n\n---\n\n')}`;
    
    return this.callAPI(systemPrompt, userPrompt);
  }

  async generateRecommendations(profileContext: any, availableResources: { id: string; title: string; competency: string }[]) {
    const systemPrompt = `You are an AI learning advisor. Analyze the user profile and skill gaps to recommend the best resources from the provided list. Return JSON matching: { "recommendations": [ { "resourceId": "string", "reason": "string", "priority": "LOW|MEDIUM|HIGH" } ] }`;
    const userPrompt = `Profile: ${JSON.stringify(profileContext)}\n\nAvailable Resources: ${JSON.stringify(availableResources)}`;
    
    return this.callAPI(systemPrompt, userPrompt);
  }

  async chat(history: AIChatMessage[], contextChunks?: string[]) {
    if (!this.apiKey) throw new Error('AI_API_KEY is not configured.');

    let systemPrompt = 'You are a helpful contextual learning assistant for government officials.';
    if (contextChunks && contextChunks.length > 0) {
      systemPrompt += `\n\nUse this context to answer questions:\n${contextChunks.join('\n---\n')}`;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        max_tokens: 1000
      })
    });

    if (!response.ok) throw new Error('External AI Chat API Error');
    const data = await response.json();
    return { message: data.choices[0].message.content };
  }

  async analyzeCompetency(learnerData: any) {
    const systemPrompt = `You are a skill intelligence analyst. Analyze the learner data and provide insights. Return JSON: { "strengths": ["string"], "weaknesses": ["string"], "observations": "string" }`;
    return this.callAPI(systemPrompt, JSON.stringify(learnerData));
  }
}
