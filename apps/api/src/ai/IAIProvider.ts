export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface IAIProvider {
  /**
   * Generates multiple-choice questions from the given text chunks.
   */
  generateMCQs(
    textChunks: string[],
    competencyName: string,
    difficulty: string,
    count: number
  ): Promise<{
    questions: {
      text: string;
      options: { id: string; text: string }[];
      correctOptionId: string;
      explanation: string;
    }[];
  }>;

  /**
   * Generates learning recommendations based on learner profile and skill gaps.
   */
  generateRecommendations(
    profileContext: any,
    availableResources: { id: string; title: string; competency: string }[]
  ): Promise<{
    recommendations: {
      resourceId: string;
      reason: string;
      priority: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
  }>;

  /**
   * Interacts with the contextual AI assistant.
   */
  chat(
    history: AIChatMessage[],
    contextChunks?: string[]
  ): Promise<{
    message: string;
  }>;

  /**
   * Analyzes competencies to find strengths and weaknesses.
   */
  analyzeCompetency(
    learnerData: any
  ): Promise<{
    strengths: string[];
    weaknesses: string[];
    observations: string;
  }>;
}
