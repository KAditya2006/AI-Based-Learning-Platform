import { IAIProvider, AIChatMessage } from './IAIProvider';

export class MockAIProvider implements IAIProvider {
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async generateMCQs(textChunks: string[], competencyName: string, difficulty: string, count: number) {
    await this.delay(1000); // Simulate processing time
    
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push({
        text: `[Mock Generated] What is a key concept related to ${competencyName}?`,
        options: [
          { id: 'a', text: 'Option A (Incorrect)' },
          { id: 'b', text: `Option B (Correct approach for ${difficulty})` },
          { id: 'c', text: 'Option C (Incorrect)' },
          { id: 'd', text: 'Option D (Incorrect)' }
        ],
        correctOptionId: 'b',
        explanation: `This is a mock explanation generated for a ${difficulty} level question about ${competencyName}.`
      });
    }

    return { questions };
  }

  async generateRecommendations(profileContext: any, availableResources: { id: string; title: string; competency: string }[]) {
    await this.delay(800);
    
    // Just pick the first up to 3 resources
    const recommendations = availableResources.slice(0, 3).map((res, index) => ({
      resourceId: res.id,
      reason: `Based on your skill gap in ${res.competency}, this resource will help you improve.`,
      priority: index === 0 ? 'HIGH' as const : 'MEDIUM' as const
    }));

    return { recommendations };
  }

  async chat(history: AIChatMessage[], contextChunks?: string[]) {
    await this.delay(500);
    const lastUserMessage = history.filter(m => m.role === 'user').pop();
    
    return {
      message: `[Mock Assistant]: I understand you are asking about "${lastUserMessage?.content}". Based on the context provided, here is a helpful explanation...`
    };
  }

  async analyzeCompetency(learnerData: any) {
    await this.delay(800);
    return {
      strengths: ['Data Analysis', 'Basic Statistics'],
      weaknesses: ['Advanced Machine Learning'],
      observations: 'The learner shows strong foundational knowledge but needs to focus on predictive modeling.'
    };
  }
}
