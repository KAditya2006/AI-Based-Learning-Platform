process.env.AI_PROVIDER = 'mock';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AssessmentService } from '../AssessmentService';
import { QuizService } from '../QuizService';
import { AILearnerService } from '../AILearnerService';
import { LearningPathService } from '../LearningPathService';
import { User, Profile, Role, RoleCompetency, CompetencyFramework, Competency, Assessment, Question, SkillGap, Recommendation, LearningPath } from '../../models';

let mongoServer: MongoMemoryServer;

describe('Learning Intelligence Loop E2E', () => {
  let learnerId: string;
  let competencyId: string;
  let assessmentId: string;
  let questionId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Role.deleteMany({});
    await RoleCompetency.deleteMany({});
    await CompetencyFramework.deleteMany({});
    await Competency.deleteMany({});
    await Assessment.deleteMany({});
    await Question.deleteMany({});
    await SkillGap.deleteMany({});
    await Recommendation.deleteMany({});
    await LearningPath.deleteMany({});

    // 1. Create a Learner
    const user = await User.create({
      email: 'learner.e2e@mospi.gov.in',
      passwordHash: 'hash',
      role: 'LEARNER'
    });
    learnerId = user._id.toString();

    // 2. Create Role and RoleCompetency
    const role = await Role.create({
      name: 'Data Analyst',
      code: 'DATA_ANALYST',
      description: 'Test Role'
    });

    // 2.5 Create Profile with Target Role
    await Profile.create({
      user: learnerId,
      firstName: 'Test',
      lastName: 'Learner',
      designation: role._id
    });

    // 3. Create Competency Framework & Competency
    const framework = await CompetencyFramework.create({
      name: 'Default Framework',
      version: '1.0'
    });

    const comp = await Competency.create({
      framework: framework._id,
      name: 'Data Privacy',
      code: 'DP-101',
      domain: 'TECHNICAL',
      description: 'Handling PII safely'
    });
    competencyId = comp._id.toString();

    // Link Role to Competency with Required Level 4
    await RoleCompetency.create({
      role: role._id,
      competency: competencyId,
      requiredLevel: 4
    });

    // 4. Set Initial Skill Gap (Required: 4, Current: 1 -> Gap: 3 -> HIGH GAP)
    await SkillGap.create({
      learner: learnerId,
      competency: competencyId,
      currentLevel: 1,
      requiredLevel: 4,
      gapSize: 3,
      gapClassification: 3, // HIGH
      status: 'OPEN'
    });

    // 5. Create Assessment & Question (Passing score: 80%)
    const question = await Question.create({
      text: 'What is PII?',
      options: [
        { id: 'opt_0', text: 'Public Internet Info' },
        { id: 'opt_1', text: 'Personally Identifiable Information' }
      ],
      correctOptionId: 'opt_1',
      explanation: 'PII stands for Personally Identifiable Information.',
      competency: competencyId,
      difficulty: 'MEDIUM',
      source: 'INTERNAL'
    });
    questionId = question._id.toString();

    const assessment = await Assessment.create({
      title: 'Data Privacy Basics',
      description: 'Intro to PII',
      competency: competencyId,
      passingScore: 80,
      questions: [questionId],
      attemptPolicy: 'UNLIMITED',
      isPublished: true
    });
    assessmentId = assessment._id.toString();
  });

  it('should run through the entire intelligence loop deterministically', async () => {
    // 1. Submit Assessment successfully (100% score)
    const result = await QuizService.submitQuiz(learnerId, assessmentId, [
      { questionId, selectedOptionId: (await Question.findById(questionId))!.correctOptionId! }
    ]);
    
    expect(result.attempt.passed).toBe(true);
    expect(result.previousLevel).toBe(1);
    expect(result.newLevel).toBe(3); // 100% score -> +2 jump

    // 2. Verify Skill Gap was updated
    const gap = await SkillGap.findOne({ learner: learnerId, competency: competencyId });
    expect(gap?.currentLevel).toBe(3);
    expect(gap?.gapSize).toBe(1); // 4 - 3 = 1
    expect(gap?.gapClassification).toBe(1); // MINOR GAP

    // 3. Generate Recommendations via AILearnerService (simulating AI response)
    const recs = await AILearnerService.generateRecommendations(learnerId);
    expect(recs).toBeDefined();
    // Since gap is 1 (minor), it shouldn't hit IGOT or NSSTA in our current logic (gte 2).
    // Let's assume there are internal resources. We didn't seed them, but it shouldn't throw.
    
    // 4. Generate Learning Path
    // Since recs might be empty due to no seeded resources, let's seed one recommendation to test LearningPathService
    await Recommendation.create({
      learnerId,
      source: 'INTERNAL',
      title: 'Internal Guide to PII',
      reason: 'Addresses minor gap in Data Privacy',
      priority: 'MEDIUM',
      resourceId: new mongoose.Types.ObjectId()
    });

    const path = await LearningPathService.generateLearningPath(learnerId);
    expect(path).toBeDefined();
    expect(path.sequence.length).toBeGreaterThan(0);
    expect(path.sequence[0].title).toBe('Internal Guide to PII');
  });
});
