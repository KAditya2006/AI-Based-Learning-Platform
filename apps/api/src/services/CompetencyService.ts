import { Competency, CompetencyFramework, CompetencyDomain } from '../models';
import { CacheService } from './CacheService';

export class CompetencyService {
  static async createFramework(name: string, version: string, description?: string) {
    return await CompetencyFramework.create({ name, version, description });
  }

  static async createCompetency(frameworkId: string, name: string, code: string, domain: CompetencyDomain, description?: string) {
    return await Competency.create({
      framework: frameworkId,
      name,
      code,
      domain,
      description
    });
  }

  static async getAllCompetencies() {
    return CacheService.getOrSet('competencies:all', async () => {
      return await Competency.find().populate('framework').lean();
    }, 3600); // 1 hour TTL
  }
}
