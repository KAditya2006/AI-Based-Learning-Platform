import { LearningPath, Recommendation, Profile, SkillGap } from '../models';

export class LearningPathService {
  static async generateLearningPath(learnerId: string) {
    // We assume AILearnerService has already generated Recommendations.
    const recommendations = await Recommendation.find({ learnerId }).sort({ priority: -1 });

    if (recommendations.length === 0) {
      throw new Error('No recommendations available to build a learning path.');
    }

    // In a full implementation, AI might sequence these based on prerequisites.
    // For this prototype, we'll sort them by priority (already done by query)
    // and create a deterministic path sequence.
    
    const sequence = recommendations.map((rec, index) => {
      const seqItem: any = {
        stepIndex: index + 1,
        source: rec.source,
        title: rec.title,
        reasoning: `Recommended due to: ${rec.reason}`
      };

      if (rec.source === 'INTERNAL') {
        seqItem.resourceId = rec.resourceId;
      } else {
        seqItem.externalId = rec.externalId;
      }

      return seqItem;
    });

    // Invalidate old active paths
    await LearningPath.updateMany({ learnerId, isActive: true }, { isActive: false });

    const newPath = await LearningPath.create({
      learnerId,
      title: 'Personalized Remediation Path',
      description: 'A dynamic sequence of resources compiled to address your current skill gaps.',
      sequence,
      isActive: true
    });

    return newPath;
  }

  static async getActiveLearningPath(learnerId: string) {
    return LearningPath.findOne({ learnerId, isActive: true });
  }
}
