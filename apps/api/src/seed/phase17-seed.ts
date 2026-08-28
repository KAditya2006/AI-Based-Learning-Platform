import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Profile, Role, Department, CompetencyFramework, Competency, RoleCompetency, UserRole, CompetencyDomain, SkillGap, SkillGapLevel, LearningResource, IntegrationConfig, IntegrationStatus } from '../models';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mospi_skill_platform';

async function seedPhase17() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for Phase 17 E2E Seeding');

    // Nuke database for clean state
    await mongoose.connection.db!.dropDatabase();
    console.log('Database dropped.');

    // 1. Core Structure
    const diid = await Department.create({ name: 'Data Informatics & Innovation Division', code: 'DIID' });
    const esd = await Department.create({ name: 'Economic Statistics Division', code: 'ESD' });
    const nad = await Department.create({ name: 'National Accounts Division', code: 'NAD' });

    const jso = await Role.create({ name: 'Junior Statistical Officer', code: 'JSO' });
    const sso = await Role.create({ name: 'Senior Statistical Officer', code: 'SSO' });
    const ad = await Role.create({ name: 'Assistant Director', code: 'AD' });
    const jd = await Role.create({ name: 'Joint Director', code: 'JD' });

    // 2. Framework & Competencies
    const framework = await CompetencyFramework.create({ name: 'MoSPI Competency Framework 2026', version: '2.0' });

    const c1 = await Competency.create({ framework: framework._id, name: 'Advanced Sampling Techniques', code: 'STAT-01', domain: CompetencyDomain.STATISTICAL, description: 'Design complex surveys.' });
    const c2 = await Competency.create({ framework: framework._id, name: 'Data Privacy & Security', code: 'TECH-02', domain: CompetencyDomain.TECHNICAL, description: 'Handling PII data securely.' });
    const c3 = await Competency.create({ framework: framework._id, name: 'Strategic Leadership', code: 'LEAD-03', domain: CompetencyDomain.BEHAVIOURAL_MANAGERIAL, description: 'Leading large divisions.' });
    const c4 = await Competency.create({ framework: framework._id, name: 'R for Data Science', code: 'TECH-01', domain: CompetencyDomain.TECHNICAL, description: 'Statistical programming.' });

    // Role Requirements
    // JSO requires Level 2 in Sampling and R
    await RoleCompetency.create({ role: jso._id, competency: c1._id, requiredLevel: 2 });
    await RoleCompetency.create({ role: jso._id, competency: c4._id, requiredLevel: 2 });
    // JD requires Level 5 Leadership, Level 4 Privacy
    await RoleCompetency.create({ role: jd._id, competency: c3._id, requiredLevel: 5 });
    await RoleCompetency.create({ role: jd._id, competency: c2._id, requiredLevel: 4 });
    // SSO requires Level 4 Sampling, Level 3 R
    await RoleCompetency.create({ role: sso._id, competency: c1._id, requiredLevel: 4 });
    await RoleCompetency.create({ role: sso._id, competency: c4._id, requiredLevel: 3 });

    // 3. Admin Identity
    const adminUser = await User.create({ email: 'admin.mospi@gov.in', passwordHash: await bcrypt.hash('Admin@123', 10), role: UserRole.ADMIN });
    await Profile.create({ user: adminUser._id, firstName: 'Master', lastName: 'Admin', department: diid._id });

    // 4. Learner Identities (Edge Cases)
    // A. High-performing learner (No Gaps)
    const learnerA = await User.create({ email: 'highperformer@mospi.gov.in', passwordHash: await bcrypt.hash('Learner@123', 10), role: UserRole.LEARNER });
    await Profile.create({ user: learnerA._id, firstName: 'Aarav', lastName: 'High', department: esd._id, designation: jso._id });
    // Simulate assessment creating Level 5s
    await SkillGap.create({ learner: learnerA._id, competency: c1._id, currentLevel: 5, requiredLevel: 2, gapSize: 0, gapClassification: SkillGapLevel.NO_GAP, evidence: 'Mock Assessed' });
    await SkillGap.create({ learner: learnerA._id, competency: c4._id, currentLevel: 4, requiredLevel: 2, gapSize: 0, gapClassification: SkillGapLevel.NO_GAP, evidence: 'Mock Assessed' });

    // B. Moderate Learner (Moderate Gaps)
    const learnerB = await User.create({ email: 'moderate@mospi.gov.in', passwordHash: await bcrypt.hash('Learner@123', 10), role: UserRole.LEARNER });
    await Profile.create({ user: learnerB._id, firstName: 'Bhavna', lastName: 'Mid', department: nad._id, designation: sso._id });
    await SkillGap.create({ learner: learnerB._id, competency: c1._id, currentLevel: 2, requiredLevel: 4, gapSize: 2, gapClassification: SkillGapLevel.MODERATE, evidence: 'Default' });
    await SkillGap.create({ learner: learnerB._id, competency: c4._id, currentLevel: 2, requiredLevel: 3, gapSize: 1, gapClassification: SkillGapLevel.LOW, evidence: 'Default' });

    // C. Severe Learner (Critical Gaps)
    const learnerC = await User.create({ email: 'severe@mospi.gov.in', passwordHash: await bcrypt.hash('Learner@123', 10), role: UserRole.LEARNER });
    await Profile.create({ user: learnerC._id, firstName: 'Chirag', lastName: 'Low', department: diid._id, designation: jd._id });
    await SkillGap.create({ learner: learnerC._id, competency: c3._id, currentLevel: 1, requiredLevel: 5, gapSize: 4, gapClassification: SkillGapLevel.CRITICAL, evidence: 'Default' });
    await SkillGap.create({ learner: learnerC._id, competency: c2._id, currentLevel: 1, requiredLevel: 4, gapSize: 3, gapClassification: SkillGapLevel.CRITICAL, evidence: 'Default' });

    // 5. Internal Catalogs
    await LearningResource.create({ provider: 'INTERNAL', title: 'Internal Guide to R', description: 'MoSPI internal guide.', durationMinutes: 60, competencies: [c4._id], source: 'INTERNAL', type: 'COURSE', difficulty: 'BEGINNER', isActive: true });
    await LearningResource.create({ provider: 'INTERNAL', title: 'Executive Leadership Seminar', description: 'Internal seminar.', durationMinutes: 120, competencies: [c3._id], source: 'INTERNAL', type: 'COURSE', difficulty: 'ADVANCED', isActive: true });

    // 6. Integration Configurations
    await IntegrationConfig.create({ provider: 'IGOT', isEnabled: true, status: IntegrationStatus.HEALTHY, lastSuccessfulSyncAt: new Date() });
    await IntegrationConfig.create({ provider: 'NSSTA', isEnabled: true, status: IntegrationStatus.CONFIGURED });

    console.log('✅ Phase 17 E2E Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedPhase17();
