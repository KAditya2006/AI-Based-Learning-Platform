import { GeminiAIProvider } from '../GeminiAIProvider';
import { ExternalAIProvider } from '../ExternalAIProvider';
import { MockAIProvider } from '../MockAIProvider';
import { AIService } from '../AIService';

describe('AI Failure Isolation', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService();
  });

  describe('Mock Provider (Fallback)', () => {
    it('should generate valid mock questions when real AI is unavailable', async () => {
      // Force mock
      aiService['provider'] = new MockAIProvider();
      
      const { questions } = await aiService.generateMCQs('req', 'job', ['Some content'], 'Data', 'MEDIUM', 2);
      expect(questions.length).toBe(2);
      expect(questions[0]).toHaveProperty('text');
      expect(questions[0]).toHaveProperty('options');
      expect(questions[0]).toHaveProperty('correctOptionId');
      expect(questions[0]).toHaveProperty('explanation');
    });

    it('should generate valid recommendations', async () => {
      aiService['provider'] = new MockAIProvider();
      
      const { recommendations } = await aiService.generateRecommendations('user', {}, [{ id: '1', title: 'Res 1', competency: 'C1' }]);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty('priority');
      expect(recommendations[0]).toHaveProperty('reason');
    });
  });

  describe('Gemini Provider retry mechanism', () => {
    it('should throw an error after max retries if service is down', async () => {
      const gemini = new GeminiAIProvider();
      const mockFn = jest.fn().mockRejectedValue(new Error('AI Service Down'));
      
      // Temporarily mock setTimeout to skip delays
      const originalSetTimeout = global.setTimeout;
      (global as any).setTimeout = (cb: any) => { cb(); return {} as any; };
      
      try {
        await expect(gemini['withRetry'](mockFn)).rejects.toThrow('AI Service Down');
        expect(mockFn).toHaveBeenCalledTimes(3);
      } finally {
        global.setTimeout = originalSetTimeout;
      }
    });
  });
});
