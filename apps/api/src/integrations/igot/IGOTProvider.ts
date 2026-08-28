import { IntegrationProvider, ExternalLearningResource } from '../IntegrationProvider';
import { logger } from '../../utils/logger';

export class IGOTProvider extends IntegrationProvider {
  private isEnabled: boolean = process.env.IGOT_ENABLED === 'true';
  private baseUrl: string = process.env.IGOT_BASE_URL || 'https://api.igot.gov.in';

  getProviderId(): string {
    return 'IGOT';
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isEnabled) return true; // Mock healthy if flag is off
    
    try {
      // In production, we'd use axios.get(`${this.baseUrl}/health`)
      // For now, we simulate a network call that succeeds.
      await new Promise(r => setTimeout(r, 200));
      return true;
    } catch (error) {
      logger.error('IGOT health check failed', { error });
      return false;
    }
  }

  async fetchCatalog(): Promise<ExternalLearningResource[]> {
    if (!this.isEnabled) {
      return this.getMockCatalog();
    }
    
    // In production:
    // const response = await axios.get(`${this.baseUrl}/api/v1/catalog`, { headers: ... });
    // return response.data.map(this.normalizeCourse);
    
    logger.warn('Real IGOT catalog fetch is not fully implemented because credentials are not available. Falling back to mock data.');
    return this.getMockCatalog();
  }

  async getResourceDetails(externalId: string): Promise<ExternalLearningResource | null> {
    const catalog = await this.fetchCatalog();
    return catalog.find(c => c.externalId === externalId) || null;
  }

  // Backwards compatibility for AILearnerService (deprecated)
  async searchCatalog(competency: string): Promise<ExternalLearningResource[]> {
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

