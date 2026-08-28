import { Profile, SkillGap, Competency, Enrollment, AssessmentAttempt } from '../models';
import { CacheService } from './CacheService';

export class AnalyticsService {
  /**
   * Generates Intelligence for all departments
   */
  static async getDepartmentIntelligence() {
    return CacheService.getOrSet('analytics:department-intelligence', async () => {
      return await Profile.aggregate([
      {
        $group: {
          _id: '$department',
          workforceSize: { $sum: 1 },
          users: { $push: '$user' }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'departmentDoc'
        }
      },
      { $unwind: { path: '$departmentDoc', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ['$departmentDoc.name', 'Unassigned'] },
          workforceSize: 1,
          users: 1
        }
      },
      { $sort: { workforceSize: -1 } }
    ]);
    }, 900); // 15 minutes TTL
  }

  /**
   * Generates Intelligence for all roles
   */
  static async getRoleIntelligence() {
    return CacheService.getOrSet('analytics:role-intelligence', async () => {
      return await Profile.aggregate([
      {
        $group: {
          _id: '$designation',
          workforceSize: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: '_id',
          foreignField: '_id',
          as: 'roleDoc'
        }
      },
      { $unwind: { path: '$roleDoc', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ['$roleDoc.title', 'Unassigned'] },
          workforceSize: 1
        }
      },
      { $sort: { workforceSize: -1 } }
    ]);
    }, 900); // 15 minutes TTL
  }

  /**
   * Generates a global competency heatmap based on departments
   */
  static async getCompetencyHeatmap() {
    return CacheService.getOrSet('analytics:competency-heatmap', async () => {
      // A simplified heatmap aggregation: (Competency) x (Department) = Avg Gap
      const heatmap = await SkillGap.aggregate([
      {
        $lookup: {
          from: 'profiles',
          localField: 'learner',
          foreignField: 'user',
          as: 'profile'
        }
      },
      { $unwind: '$profile' },
      {
        $group: {
          _id: { competency: '$competency', department: '$profile.department' },
          avgGap: { $avg: '$gapSize' },
          criticalGaps: { $sum: { $cond: [{ $eq: ['$gapClassification', 4] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'competencies',
          localField: '_id.competency',
          foreignField: '_id',
          as: 'competencyDoc'
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id.department',
          foreignField: '_id',
          as: 'deptDoc'
        }
      },
      { $unwind: { path: '$competencyDoc', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$deptDoc', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          competencyId: '$_id.competency',
          competencyName: '$competencyDoc.name',
          departmentId: '$_id.department',
          departmentName: { $ifNull: ['$deptDoc.name', 'Unassigned'] },
          avgGap: 1,
          criticalGaps: 1
        }
      }
    ]);
      return heatmap;
    }, 900); // 15 minutes TTL
  }

  /**
   * Computes relationship between enrollments, completion, and assessment scores
   */
  static async getLearningEffectiveness() {
    return CacheService.getOrSet('analytics:learning-effectiveness', async () => {
      const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ status: 'COMPLETED' });
    const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

    const attempts = await AssessmentAttempt.aggregate([
      {
        $group: {
          _id: null,
          avgScore: { $avg: '$percentage' },
          passRate: { $avg: { $cond: ['$passed', 100, 0] } }
        }
      }
    ]);

    const assessmentMetrics = attempts.length > 0 ? attempts[0] : { avgScore: 0, passRate: 0 };

    return {
      totalEnrollments,
      completedEnrollments,
      completionRate,
      averageAssessmentScore: assessmentMetrics.avgScore,
      averagePassRate: assessmentMetrics.passRate
    };
    }, 900); // 15 minutes TTL
  }
}
