import { Enrollment, EnrollmentStatus, LearningResource } from '../models';

export class LearningService {
  static async getEnrollments(learnerId: string) {
    return Enrollment.find({ learner: learnerId }).populate('resource');
  }

  static async enroll(learnerId: string, resourceId: string) {
    const existing = await Enrollment.findOne({ learner: learnerId, resource: resourceId });
    if (existing) {
      return existing; // Already enrolled
    }

    const resource = await LearningResource.findById(resourceId);
    if (!resource) {
      throw new Error('Learning resource not found');
    }

    return Enrollment.create({
      learner: learnerId,
      resource: resourceId,
      status: EnrollmentStatus.IN_PROGRESS,
      progressPercentage: 0,
    });
  }

  static async updateProgress(learnerId: string, resourceId: string, progress: number) {
    const enrollment = await Enrollment.findOne({ learner: learnerId, resource: resourceId });
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    enrollment.progressPercentage = Math.min(100, Math.max(0, progress));
    enrollment.lastAccessedAt = new Date();

    if (enrollment.progressPercentage === 100 && enrollment.status !== EnrollmentStatus.COMPLETED) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
      
      // Trigger downstreams (e.g. refresh recommendations/path)
      const { AILearnerService } = require('./AILearnerService');
      await AILearnerService.generateRecommendations(learnerId);
    }

    await enrollment.save();
    return enrollment;
  }
}
