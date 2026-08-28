import { CompetencyAssessment, CompetencyHistory, AssessmentType } from '../models';
import { SkillGapService } from './SkillGapService';
import { AuditService } from './AuditService';

export class AssessmentService {
  // Deterministic Competency Scoring Model
  static evaluateCompetencyLevel(previousLevel: number = 1, percentage: number): number {
    let newLevel = previousLevel;
    
    // Core logic: 
    // Exceptional score (95+) -> jump up to 2 levels
    // Strong score (80+) -> jump 1 level
    // Failing score (<50) -> drop 1 level (if possible)
    
    if (percentage >= 95) {
      newLevel = Math.min(5, previousLevel + 2);
    } else if (percentage >= 80) {
      newLevel = Math.min(5, previousLevel + 1);
    } else if (percentage < 50) {
      newLevel = Math.max(1, previousLevel - 1);
    }

    return newLevel;
  }

  static async getPreviousLevel(learnerId: string, competencyId: string): Promise<number> {
    const previous = await CompetencyAssessment.findOne({
      learner: learnerId,
      competency: competencyId
    }).sort({ assessedAt: -1 });
    return previous ? previous.level : 1;
  }

  static async submitAssessment(
    learnerId: string, 
    competencyId: string, 
    level: number, 
    type: AssessmentType, 
    source: string, 
    evidence?: string
  ) {
    // 1. Save Assessment
    const assessment = await CompetencyAssessment.create({
      learner: learnerId,
      competency: competencyId,
      assessmentType: type,
      level,
      source,
      evidence
    });

    // 2. Determine previous level
    const previous = await CompetencyAssessment.findOne({
      learner: learnerId,
      competency: competencyId,
      _id: { $ne: assessment._id }
    }).sort({ assessedAt: -1 });

    const prevLevel = previous ? previous.level : undefined;

    // 3. Create History
    await CompetencyHistory.create({
      learner: learnerId,
      competency: competencyId,
      previousLevel: prevLevel,
      newLevel: level,
      source,
      assessmentReference: assessment._id
    });

    // 4. Recalculate skill gaps
    await SkillGapService.recalculateLearnerGaps(learnerId);

    // 5. Refresh Recommendations
    const { AILearnerService } = require('./AILearnerService');
    await AILearnerService.generateRecommendations(learnerId);

    // 6. Notify Learner
    const { NotificationService } = require('./NotificationService');
    await NotificationService.createNotification(
      learnerId,
      'ASSESSMENT',
      'Assessment Scored',
      `Your assessment for this competency has been scored. Your new level is ${level}.`,
      `/competencies/${competencyId}`
    );

    // 7. Audit Log
    await AuditService.log(learnerId, 'SUBMIT_ASSESSMENT', assessment._id.toString(), { competencyId, level, type });

    return assessment;
  }
}
