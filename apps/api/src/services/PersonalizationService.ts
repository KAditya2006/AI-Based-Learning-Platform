import { SkillGap, Profile, LearningResource, Recommendation, ISkillGap } from '../models';
import { aiService } from '../ai/AIService';
import { CacheService } from './CacheService';
import crypto from 'crypto';

export class PersonalizationService {
  /**
   * Deterministically calculates priority based on Gap Classification and Role Context
   */
  static calculatePriority(gapClassification: number, gapSize: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (gapClassification === 4 || gapSize >= 3) return 'CRITICAL';
    if (gapClassification === 3) return 'HIGH';
    if (gapClassification === 2) return 'MEDIUM';
    return 'LOW';
  }

  static async generateDeterministicRecommendations(learnerId: string) {
    const { IGOTProvider } = require('../integrations/igot/IGOTProvider');
    const { ProgrammeProvider } = require('../integrations/nssta/ProgrammeProvider');
    const igotProvider = new IGOTProvider();
    const programmeProvider = new ProgrammeProvider();

    const profile = await Profile.findOne({ user: learnerId }).populate('department designation');
    const skillGaps = await SkillGap.find({ learner: learnerId, gapClassification: { $gte: 2 } }).populate('competency');

    if (skillGaps.length === 0) return [];

    const availableResources = await LearningResource.find({ isActive: true }).populate('competencies');
    let candidateOptions: any[] = [];

    // Filter Internal
    for (const gap of skillGaps) {
      const compId = (gap.competency as any)._id.toString();
      const compName = (gap.competency as any).name;
      const priority = this.calculatePriority(gap.gapClassification, gap.gapSize);
      
      availableResources.forEach(r => {
        const matchesGap = r.competencies.some((c: any) => c._id.toString() === compId);
        if (matchesGap) {
          candidateOptions.push({
            id: `INT_${r._id.toString()}`,
            source: 'INTERNAL',
            realId: r._id.toString(),
            title: r.title,
            targetCompetencyId: compId,
            relatedSkillGapId: gap._id,
            competencyName: compName,
            priority,
            estimatedEffortMinutes: r.durationMinutes || 60,
          });
        }
      });
    }

    // Filter External
    for (const gap of skillGaps) {
      const compName = (gap.competency as any).name;
      const priority = this.calculatePriority(gap.gapClassification, gap.gapSize);

      // Search iGOT
      try {
        const igotCourses = await igotProvider.searchCatalog(compName);
        igotCourses.forEach((c: any) => {
          candidateOptions.push({
            id: `IGOT_${c.externalId}`,
            source: 'IGOT',
            realId: c.externalId,
            title: c.title,
            targetCompetencyId: (gap.competency as any)._id.toString(),
            relatedSkillGapId: gap._id,
            competencyName: compName,
            priority,
            estimatedEffortMinutes: c.durationMinutes || 120,
          });
        });
      } catch (e) {}

      // Search NSSTA
      try {
        const nsstaProgrammes = await programmeProvider.searchProgrammes(compName);
        nsstaProgrammes.forEach((p: any) => {
          candidateOptions.push({
            id: `NSSTA_${p.externalId}`,
            source: 'NSSTA',
            realId: p.externalId,
            title: p.title,
            targetCompetencyId: (gap.competency as any)._id.toString(),
            relatedSkillGapId: gap._id,
            competencyName: compName,
            priority,
            estimatedEffortMinutes: p.durationMinutes || 240,
          });
        });
      } catch (e) {}
    }

    // Deduplicate mapping
    const uniqueOptionsMap = new Map();
    candidateOptions.forEach(o => {
      // Prioritize INTERNAL over IGOT/NSSTA if they address the same gap
      const existing = uniqueOptionsMap.get(o.targetCompetencyId);
      if (!existing) {
        uniqueOptionsMap.set(o.targetCompetencyId, o);
      } else if (existing.source !== 'INTERNAL' && o.source === 'INTERNAL') {
        uniqueOptionsMap.set(o.targetCompetencyId, o); // Override with internal
      }
    });

    const finalOptions = Array.from(uniqueOptionsMap.values());

    // AI Enrichment (Explain why)
    const context = {
      role: (profile?.designation as any)?.title || 'Learner',
      department: (profile?.department as any)?.name || 'General',
      skillGaps: skillGaps.map(g => ({
        competency: (g.competency as any).name,
        gapSize: g.gapSize,
        classification: g.gapClassification
      }))
    };

    // Ask AI for explanations only, not authoritative choices
    let aiExplanations = [];
    try {
      const cacheKey = 'ai-recs:' + crypto.createHash('sha256').update(JSON.stringify({ 
        role: context.role, 
        dept: context.department, 
        gaps: context.skillGaps,
        options: finalOptions.map(o => o.id)
      })).digest('hex');

      aiExplanations = await CacheService.getOrSet(cacheKey, async () => {
        const aiResult = await aiService.generateRecommendations(learnerId, context, finalOptions);
        return aiResult.recommendations;
      }, 86400); // Cache explanations for 24 hours
    } catch (e) {
      console.error('AI Fallback: Skipping explanations', e);
    }

    await Recommendation.deleteMany({ learnerId });
    const saved = [];

    for (const option of finalOptions) {
      // Find matching explanation if AI succeeded
      const explanationRec = aiExplanations.find((r: any) => r.resourceId === option.id);
      
      const recDoc: any = {
        learnerId,
        source: option.source,
        title: option.title,
        reason: explanationRec?.reason || `Deterministically recommended to close the gap in ${option.competencyName}.`,
        priority: option.priority,
        targetCompetencyId: option.targetCompetencyId,
        relatedSkillGapId: option.relatedSkillGapId,
        estimatedEffortMinutes: option.estimatedEffortMinutes,
        expectedOutcome: `Improve ${option.competencyName} competency by closing a gap of size 1+`
      };

      if (option.source === 'INTERNAL') {
        recDoc.resourceId = option.realId;
      } else {
        recDoc.externalId = option.realId;
      }

      saved.push(await Recommendation.create(recDoc));
    }

    return saved;
  }
}
