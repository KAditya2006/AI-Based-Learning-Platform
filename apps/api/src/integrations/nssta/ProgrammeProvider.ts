import { IntegrationProvider, ExternalLearningResource, ProviderMode } from '../IntegrationProvider';
import { logger } from '../../utils/logger';
import axios from 'axios';

export class ProgrammeProvider extends IntegrationProvider {
  private mode: ProviderMode = (process.env.NSSTA_PROVIDER_MODE?.toUpperCase() as ProviderMode) || 'MOCK';
  private baseUrl: string = process.env.NSSTA_BASE_URL || 'https://api.nssta.gov.in';
  private timeout: number = parseInt(process.env.NSSTA_TIMEOUT || '5000', 10);
  private apiKey: string = process.env.NSSTA_API_KEY || '';

  getProviderId(): string {
    return 'NSSTA';
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
      logger.error('NSSTA health check failed', { 
        error: error.message,
        code: error.code
      });
      return false;
    }
  }

  async fetchCatalog(): Promise<ExternalLearningResource[]> {
    if (this.mode === 'DISABLED') {
      throw new Error('NSSTA Provider is disabled.');
    }
    
    if (this.mode === 'MOCK') {
      return this.getMockCatalog();
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/programmes`, {
        timeout: this.timeout,
        headers: { 'Authorization': `Bearer ${this.apiKey}` }
      });
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any) => ({
          externalId: item.id || item.externalId,
          title: item.title,
          description: item.description || '',
          durationMinutes: item.durationMinutes || (5 * 24 * 60),
          provider: 'NSSTA',
          competencyTags: item.tags || [],
          url: item.url || `${this.baseUrl}/programmes/${item.id}`,
          type: item.type || 'COURSE',
          difficulty: item.difficulty || 'INTERMEDIATE'
        }));
      }
      return [];
    } catch (error: any) {
      logger.error('NSSTA catalog fetch failed', { 
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
  async searchProgrammes(competency: string, role?: string): Promise<ExternalLearningResource[]> {
    if (this.mode === 'DISABLED') return [];
    const catalog = await this.fetchCatalog();
    return catalog.filter(p => {
      const matchesComp = p.competencyTags.some(tag => tag.toLowerCase().includes(competency.toLowerCase()));
      // Skipping role filter for now as it's not strictly necessary for AI matching context
      return matchesComp;
    });
  }

  private getMockCatalog(): ExternalLearningResource[] {
    return [
      {
        externalId: 'nssta-p1',
        title: 'NSSTA Induction Programme for ISS Officers',
        description: 'Comprehensive induction training covering official statistics, economics, and administration.',
        durationMinutes: 90 * 24 * 60, // 90 days
        provider: 'NSSTA',
        competencyTags: ['Official Statistics', 'Public Administration', 'Leadership'],
        url: 'https://nssta.gov.in/programmes/p1',
        type: 'COURSE',
        difficulty: 'BEGINNER'
      },
      {
        externalId: 'nssta-p2',
        title: 'Specialized Training in Big Data Analytics',
        description: 'Short term training on using big data tools (Hadoop, Spark) for statistical analysis.',
        durationMinutes: 5 * 24 * 60,
        provider: 'NSSTA',
        competencyTags: ['Big Data', 'Data Science', 'Machine Learning', 'Statistical Analysis'],
        url: 'https://nssta.gov.in/programmes/p2',
        type: 'COURSE',
        difficulty: 'ADVANCED'
      },
      {
        externalId: 'nssta-p3',
        title: 'Survey Methodology Workshop',
        description: 'Workshop on modern survey design and sampling methodologies.',
        durationMinutes: 3 * 24 * 60,
        provider: 'NSSTA',
        competencyTags: ['Survey Design', 'Methodology', 'Data Collection'],
        url: 'https://nssta.gov.in/programmes/p3',
        type: 'COURSE',
        difficulty: 'INTERMEDIATE'
      }
    ];
  }
}

// Deprecated mock export for backwards compatibility
export class MockProgrammeProvider extends ProgrammeProvider {}

