import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, Profile, Role, Department, CompetencyFramework, Competency, RoleCompetency, UserRole, CompetencyDomain, SkillGap, Recommendation, Enrollment, CompetencyHistory, CompetencyAssessment, LearningResource } from '../../models';
import { PersonalizationService } from '../../services/PersonalizationService';
import { SkillGapService } from '../../services/SkillGapService';
import { AssessmentService } from '../../services/AssessmentService';

describe('Phase 17 - Learning Intelligence Loop E2E', () => {
  let mongoServer: MongoMemoryServer;
  let learnerId: string;
  let comp1Id: string;
  let resourceId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const dept = await Department.create({ name: 'Test Dept', code: 'TEST' });
    const role = await Role.create({ name: 'Test Role', code: 'TR' });
    const fw = await CompetencyFramework.create({ name: 'Test FW', version: '1.0' });
    const comp1 = await Competency.create({ framework: fw._id, name: 'Sampling', code: 'C1', domain: CompetencyDomain.STATISTICAL });
    comp1Id = comp1._id.toString();

    await RoleCompetency.create({ role: role._id, competency: comp1._id, requiredLevel: 3 });

    const learner = await User.create({ email: 'e2e@test.com', passwordHash: 'hash', role: UserRole.LEARNER });
    learnerId = learner._id.toString();
    await Profile.create({ user: learner._id, firstName: 'E2E', lastName: 'Learner', department: dept._id, designation: role._id });

    const res = await LearningResource.create({ provider: 'INTERNAL', title: 'Internal Guide', description: 'Desc', durationMinutes: 60, competencies: [comp1._id], source: 'INTERNAL', type: 'COURSE', difficulty: 'BEGINNER', isActive: true });
    resourceId = res._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('1. Should calculate initial skill gaps based on role', async () => {
    await SkillGapService.recalculateLearnerGaps(learnerId);
    
    const gaps = await SkillGap.find({ learner: learnerId });
    expect(gaps.length).toBe(1);
    expect(gaps[0].requiredLevel).toBe(3);
    expect(gaps[0].currentLevel).toBe(1); // Default
    expect(gaps[0].gapSize).toBe(2); // 3 - 1
  });

  it('2. Should generate recommendations based on the gap', async () => {
    const recs = await PersonalizationService.generateDeterministicRecommendations(learnerId);
    expect(recs.length).toBe(1);
    expect(recs[0].source).toBe('INTERNAL');
    expect(recs[0].resourceId!.toString()).toBe(resourceId);
  }, 30000);

  it('3. Should simulate taking an assessment and passing with a strong score', async () => {
    const assessment = await AssessmentService.submitAssessment(
      learnerId,
      comp1Id,
      AssessmentService.evaluateCompetencyLevel(1, 85), // 85% -> +1 level
      'QUIZ' as any,
      'Internal Guide Quiz'
    );
    
    expect(assessment.level).toBe(2);

    const history = await CompetencyHistory.findOne({ learner: learnerId, competency: comp1Id });
    expect(history).toBeDefined();
    expect(history!.newLevel).toBe(2);
  });

  it('4. Should automatically recalculate the skill gap to the new level', async () => {
    // Gap should have been recalculated inside AssessmentService
    const gap = await SkillGap.findOne({ learner: learnerId, competency: comp1Id });
    expect(gap!.currentLevel).toBe(2);
    expect(gap!.gapSize).toBe(1); // 3 - 2
  });
});
