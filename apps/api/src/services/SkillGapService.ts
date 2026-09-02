import { SkillGap, SkillGapLevel, RoleCompetency, CompetencyAssessment, Profile } from '../models';

export class SkillGapService {
  static calculateGapLevel(gapSize: number): SkillGapLevel {
    if (gapSize <= 0) return SkillGapLevel.NO_GAP;
    if (gapSize === 1) return SkillGapLevel.LOW;
    if (gapSize === 2) return SkillGapLevel.MODERATE;
    if (gapSize === 3) return SkillGapLevel.HIGH;
    return SkillGapLevel.CRITICAL;
  }

  static async recalculateLearnerGaps(learnerId: string) {
    const profile = await Profile.findOne({ user: learnerId });
    if (!profile || !profile.designation) return;
    
    const roleId = profile.designation;
    const requiredComps = await RoleCompetency.find({ role: roleId });

    const assessments = await CompetencyAssessment.find({ learner: learnerId }).sort({ assessedAt: -1 });
    
    const currentLevels = new Map<string, { level: number; source: string; date: Date }>();
    for (const a of assessments) {
      const compId = a.competency.toString();
      if (!currentLevels.has(compId)) {
        currentLevels.set(compId, { level: a.level, source: a.source || 'Unknown', date: a.assessedAt });
      }
    }

    for (const reqComp of requiredComps) {
      const compId = reqComp.competency.toString();
      const currentData = currentLevels.get(compId);
      const current = currentData ? currentData.level : 1;
      const required = reqComp.requiredLevel;
      const gapSize = Math.max(0, required - current);
      const gapClass = this.calculateGapLevel(gapSize);

      if (gapSize <= 0) {
        await SkillGap.findOneAndDelete({ learner: learnerId, competency: compId });
        continue;
      }

      let evidence = `Role requires Level ${required}. `;
      if (currentData) {
        evidence += `Current Level is ${current} based on '${currentData.source}' assessed on ${currentData.date.toDateString()}.`;
      } else {
        evidence += `No assessment history found. Defaulting to Level 1.`;
      }

      const gap = await SkillGap.findOneAndUpdate(
        { learner: learnerId, competency: compId },
        {
          currentLevel: current,
          requiredLevel: required,
          gapSize,
          gapClassification: gapClass,
          evidence,
          lastCalculatedAt: new Date()
        },
        { upsert: true, new: true }
      ).populate('competency');

      // Notify Learner of new gap if it's severe
      if (gapClass >= 3) {
        const { NotificationService } = require('./NotificationService');
        await NotificationService.createNotification(
          learnerId,
          'SKILL_GAP',
          'New Skill Gap Identified',
          `A ${['', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'][gapClass]} skill gap was identified in ${(gap.competency as any).name}.`,
          '/skill-gaps'
        );
      }
    }
  }
}
