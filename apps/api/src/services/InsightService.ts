import { Insight, InsightType, InsightSeverity, InsightScope, SkillGap, Profile, Enrollment, EnrollmentStatus } from '../models';

export class InsightService {
  /**
   * Evaluates the workforce and generates meaningful insights.
   * Runs as a cron job or manually triggered by Admin.
   */
  static async generateWorkforceInsights() {
    const newInsights = [];

    // 1. Identify Critical Workforce Gaps across the org
    const criticalGapsCount = await SkillGap.countDocuments({ gapClassification: 4 });
    if (criticalGapsCount > 0) {
      newInsights.push({
        type: InsightType.CRITICAL_WORKFORCE_GAP,
        severity: InsightSeverity.CRITICAL,
        scope: InsightScope.GLOBAL,
        title: 'Critical Skill Gaps Detected',
        explanation: `There are currently ${criticalGapsCount} critical skill gaps across the entire workforce that require immediate intervention.`,
        supportingMetrics: { criticalGapsCount }
      });
    }

    // 2. Identify Stagnant Competencies (High enrollments, low completion/passing)
    const droppedEnrollments = await Enrollment.countDocuments({ status: EnrollmentStatus.DROPPED });
    const totalEnrollments = await Enrollment.countDocuments();
    if (totalEnrollments > 0) {
      const dropRate = (droppedEnrollments / totalEnrollments) * 100;
      if (dropRate > 15) {
        newInsights.push({
          type: InsightType.LOW_LEARNING_ENGAGEMENT,
          severity: InsightSeverity.WARNING,
          scope: InsightScope.GLOBAL,
          title: 'High Course Drop Rate',
          explanation: `The organizational drop rate is currently ${dropRate.toFixed(1)}%, indicating a potential issue with learning engagement or resource difficulty.`,
          supportingMetrics: { dropRate, droppedEnrollments, totalEnrollments }
        });
      }
    }

    // Save all to database (avoiding spam by checking recent insights)
    for (const insight of newInsights) {
      const recent = await Insight.findOne({ type: insight.type, scope: insight.scope, isRead: false });
      if (!recent) {
        await Insight.create(insight);
      }
    }

    return newInsights;
  }
}
