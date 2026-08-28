export interface ExternalLearningResource {
  externalId: string;
  title: string;
  description: string;
  durationMinutes: number;
  provider: string; // 'IGOT' | 'NSSTA'
  competencyTags: string[];
  url: string;
  type: 'COURSE' | 'VIDEO' | 'DOCUMENT' | 'INTERACTIVE';
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export abstract class IntegrationProvider {
  /**
   * Returns a normalized identifier for the provider (e.g., 'IGOT', 'NSSTA')
   */
  abstract getProviderId(): string;

  /**
   * Health check to determine if the provider API is reachable.
   */
  abstract healthCheck(): Promise<boolean>;

  /**
   * Fetch a full catalog of courses/programmes from the external provider.
   * Useful for background sync jobs.
   */
  abstract fetchCatalog(): Promise<ExternalLearningResource[]>;

  /**
   * Fetch specific course details.
   */
  abstract getResourceDetails(externalId: string): Promise<ExternalLearningResource | null>;
}
