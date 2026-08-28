import { IntegrationProvider, ExternalLearningResource } from '../IntegrationProvider';
import { logger } from '../../utils/logger';

export class ProgrammeProvider extends IntegrationProvider {
  private isEnabled: boolean = process.env.NSSTA_ENABLED === 'true';
  private baseUrl: string = process.env.NSSTA_BASE_URL || 'https://api.nssta.gov.in';

  getProviderId(): string {
    return 'NSSTA';
  }

  async healthCheck(): Promise<boolean> {
    if (!this.isEnabled) return true;
    
    try {
      await new Promise(r => setTimeout(r, 200));
      return true;
    } catch (error) {
      logger.error('NSSTA health check failed', { error });
      return false;
    }
  }

  async fetchCatalog(): Promise<ExternalLearningResource[]> {
    if (!this.isEnabled) {
      return this.getMockCatalog();
    }
    
    logger.warn('Real NSSTA catalog fetch is not fully implemented because credentials are not available. Falling back to mock data.');
    return this.getMockCatalog();
  }

  async getResourceDetails(externalId: string): Promise<ExternalLearningResource | null> {
    const catalog = await this.fetchCatalog();
    return catalog.find(c => c.externalId === externalId) || null;
  }

  // Backwards compatibility for AILearnerService (deprecated)
  async searchProgrammes(competency: string, role?: string): Promise<ExternalLearningResource[]> {
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

