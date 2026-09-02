import { IntegrationProvider, ExternalLearningResource, ProviderMode } from '../IntegrationProvider';
import { logger } from '../../utils/logger';
import axios from 'axios';

export class IGOTProvider extends IntegrationProvider {
  private mode: ProviderMode = (process.env.IGOT_PROVIDER_MODE?.toUpperCase() as ProviderMode) || 'MOCK';
  private baseUrl: string = process.env.IGOT_BASE_URL || 'https://api.igot.gov.in';
  private timeout: number = parseInt(process.env.IGOT_TIMEOUT || '5000', 10);
  private apiKey: string = process.env.IGOT_API_KEY || '';

  getProviderId(): string {
    return 'IGOT';
  }

  getMode(): ProviderMode {
    return this.mode;
  }

  async healthCheck(): Promise<boolean> {
    if (this.mode === 'DISABLED') return false;
    if (this.mode === 'MOCK') return true;
    
    try {
      await axios.get(`${this.baseUrl}/health`, {
        timeout: this.timeout,
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      return true;
    } catch (error: any) {
      logger.error('IGOT health check failed', { 
        error: error.message,
        code: error.code
      });
      return false;
    }
  }

  async fetchCatalog(): Promise<ExternalLearningResource[]> {
    if (this.mode === 'DISABLED') {
      throw new Error('IGOT Provider is disabled.');
    }
    
    if (this.mode === 'MOCK') {
      return this.getMockCatalog();
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/catalog`, {
        timeout: this.timeout,
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          externalId: item.id || item.externalId,
          title: item.title,
          description: item.description || '',
          durationMinutes: item.duration || 120,
          provider: 'IGOT',
          competencyTags: item.tags || [],
          url: item.url || `${this.baseUrl}/courses/${item.id}`,
          type: item.type || 'COURSE',
          difficulty: item.difficulty || 'BEGINNER'
        }));
      }
      return [];
    } catch (error: any) {
      logger.error('IGOT catalog fetch failed', { 
        error: error.message,
        code: error.code
      });
      throw error;
    }
  }

  async getResourceDetails(externalId: string): Promise<ExternalLearningResource | null> {
    if (this.mode === 'DISABLED') return null;
    const catalog = await this.fetchCatalog();
    return catalog.find(c => c.externalId === externalId) || null;
  }

  // Backwards compatibility for AILearnerService (deprecated)
  async searchCatalog(competency: string): Promise<ExternalLearningResource[]> {
    if (this.mode === 'DISABLED') return [];
    const catalog = await this.fetchCatalog();
    return catalog.filter(c => 
      c.competencyTags.some(tag => tag.toLowerCase().includes(competency.toLowerCase()))
    );
  }

  private getMockCatalog(): ExternalLearningResource[] {
    return [
      {
        externalId: 'igot-101',
        title: 'Introduction to Data Privacy in Government',
        description: 'Learn the basics of data privacy and handling PII in government systems.',
        durationMinutes: 120,
        provider: 'IGOT',
        competencyTags: ['Data Privacy', 'Security', 'Compliance'],
        url: 'https://igot.gov.in/courses/101',
        type: 'COURSE',
        difficulty: 'BEGINNER'
      },
      {
        externalId: 'igot-102',
        title: 'Advanced Statistical Methods',
        description: 'Advanced course on statistical surveying and sampling.',
        durationMinutes: 300,
        provider: 'IGOT',
        competencyTags: ['Statistical Analysis', 'Survey Design', 'Mathematics'],
        url: 'https://igot.gov.in/courses/102',
        type: 'COURSE',
        difficulty: 'ADVANCED'
      },
      {
        externalId: 'igot-103',
        title: 'Public Administration Leadership',
        description: 'Leadership principles for mid-level public administrators.',
        durationMinutes: 180,
        provider: 'IGOT',
        competencyTags: ['Leadership', 'Management', 'Communication'],
        url: 'https://igot.gov.in/courses/103',
        type: 'COURSE',
        difficulty: 'INTERMEDIATE'
      }
    ];
  }
}

// Deprecated mock export for backwards compatibility
export class MockIGOTProvider extends IGOTProvider {}

