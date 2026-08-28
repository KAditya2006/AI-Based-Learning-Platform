import { User, Profile, SkillGap, CompetencyAssessment } from '../models';

export class AdminService {
  static async getWorkforceAnalytics() {
    const totalUsers = await User.countDocuments({ role: 'LEARNER' });
    
    // Departments aggregation
    const departments = await Profile.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Roles aggregation
    const roles = await Profile.aggregate([
      { $group: { _id: '$designation', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return { totalUsers, departments, roles };
  }

  static async getSkillGapAnalytics() {
    const gaps = await SkillGap.aggregate([
      { $group: { _id: '$gapClassification', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const topGaps = await SkillGap.aggregate([
      { $match: { gapSize: { $gt: 0 } } },
      { $group: { _id: '$competency', count: { $sum: 1 }, avgGap: { $avg: '$gapSize' } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'competencies', localField: '_id', foreignField: '_id', as: 'comp' } },
      { $unwind: '$comp' },
      { $project: { name: '$comp.name', count: 1, avgGap: 1 } }
    ]);

    return { gapDistribution: gaps, topGaps };
  }
}
