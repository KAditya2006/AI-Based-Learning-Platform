import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Profile, Role, Department, CompetencyFramework, Competency, RoleCompetency, UserRole, CompetencyDomain, SkillGap, SkillGapLevel, LearningResource, IntegrationConfig, IntegrationStatus } from '../models';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function seedPhase17() {
  if (!MONGO_URI) {
    console.error('CRITICAL: MONGODB_URI is missing. Cannot seed.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB for Phase 17 E2E Seeding. Database: ${mongoose.connection.name}`);

    if (process.env.NODE_ENV === 'production' && process.env.FORCE_SEED !== 'true') {
      console.warn('WARNING: Running seed in production requires FORCE_SEED=true.');
      process.exit(0);
    }

    console.log('Running safe, idempotent Phase 17 seeding (upsert mode)...');

    // 1. Core Structure
    const diid = await Department.findOneAndUpdate({ code: 'DIID' }, { name: 'Data Informatics & Innovation Division' }, { upsert: true, new: true });
    const esd = await Department.findOneAndUpdate({ code: 'ESD' }, { name: 'Economic Statistics Division' }, { upsert: true, new: true });
    const nad = await Department.findOneAndUpdate({ code: 'NAD' }, { name: 'National Accounts Division' }, { upsert: true, new: true });

    const jso = await Role.findOneAndUpdate({ code: 'JSO' }, { name: 'Junior Statistical Officer' }, { upsert: true, new: true });
    const sso = await Role.findOneAndUpdate({ code: 'SSO' }, { name: 'Senior Statistical Officer' }, { upsert: true, new: true });
    const ad = await Role.findOneAndUpdate({ code: 'AD' }, { name: 'Assistant Director' }, { upsert: true, new: true });
    const jd = await Role.findOneAndUpdate({ code: 'JD' }, { name: 'Joint Director' }, { upsert: true, new: true });

    // 2. Framework & Competencies
    const framework = await CompetencyFramework.findOneAndUpdate({ version: '2.0' }, { name: 'MoSPI Competency Framework 2026' }, { upsert: true, new: true });

    const c1 = await Competency.findOneAndUpdate({ code: 'STAT-01', framework: framework._id }, { name: 'Advanced Sampling Techniques', domain: CompetencyDomain.STATISTICAL, description: 'Design complex surveys.' }, { upsert: true, new: true });
    const c2 = await Competency.findOneAndUpdate({ code: 'TECH-02', framework: framework._id }, { name: 'Data Privacy & Security', domain: CompetencyDomain.TECHNICAL, description: 'Handling PII data securely.' }, { upsert: true, new: true });
    const c3 = await Competency.findOneAndUpdate({ code: 'LEAD-03', framework: framework._id }, { name: 'Strategic Leadership', domain: CompetencyDomain.BEHAVIOURAL_MANAGERIAL, description: 'Leading large divisions.' }, { upsert: true, new: true });
    const c4 = await Competency.findOneAndUpdate({ code: 'TECH-01', framework: framework._id }, { name: 'R for Data Science', domain: CompetencyDomain.TECHNICAL, description: 'Statistical programming.' }, { upsert: true, new: true });

    // Role Requirements
    await RoleCompetency.findOneAndUpdate({ role: jso._id, competency: c1._id }, { requiredLevel: 2 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: jso._id, competency: c4._id }, { requiredLevel: 2 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: jd._id, competency: c3._id }, { requiredLevel: 5 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: jd._id, competency: c2._id }, { requiredLevel: 4 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: sso._id, competency: c1._id }, { requiredLevel: 4 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: sso._id, competency: c4._id }, { requiredLevel: 3 }, { upsert: true });

    // 3. Admin Identity
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const adminUser = await User.findOneAndUpdate({ email: 'admin.mospi@gov.in' }, { passwordHash: adminHash, role: UserRole.ADMIN }, { upsert: true, new: true });
    await Profile.findOneAndUpdate({ user: adminUser._id }, { firstName: 'Master', lastName: 'Admin', department: diid._id }, { upsert: true });

    // 4. Learner Identities
    const learnerHash = await bcrypt.hash('Learner@123', 10);
    const learnerA = await User.findOneAndUpdate({ email: 'highperformer@mospi.gov.in' }, { passwordHash: learnerHash, role: UserRole.LEARNER }, { upsert: true, new: true });
    await Profile.findOneAndUpdate({ user: learnerA._id }, { firstName: 'Aarav', lastName: 'High', department: esd._id, designation: jso._id }, { upsert: true });
    await SkillGap.findOneAndUpdate({ learner: learnerA._id, competency: c1._id }, { currentLevel: 5, requiredLevel: 2, gapSize: 0, gapClassification: SkillGapLevel.NO_GAP, evidence: 'Mock Assessed' }, { upsert: true });
    await SkillGap.findOneAndUpdate({ learner: learnerA._id, competency: c4._id }, { currentLevel: 4, requiredLevel: 2, gapSize: 0, gapClassification: SkillGapLevel.NO_GAP, evidence: 'Mock Assessed' }, { upsert: true });

    const learnerB = await User.findOneAndUpdate({ email: 'moderate@mospi.gov.in' }, { passwordHash: learnerHash, role: UserRole.LEARNER }, { upsert: true, new: true });
    await Profile.findOneAndUpdate({ user: learnerB._id }, { firstName: 'Bhavna', lastName: 'Mid', department: nad._id, designation: sso._id }, { upsert: true });
    await SkillGap.findOneAndUpdate({ learner: learnerB._id, competency: c1._id }, { currentLevel: 2, requiredLevel: 4, gapSize: 2, gapClassification: SkillGapLevel.MODERATE, evidence: 'Default' }, { upsert: true });
    await SkillGap.findOneAndUpdate({ learner: learnerB._id, competency: c4._id }, { currentLevel: 2, requiredLevel: 3, gapSize: 1, gapClassification: SkillGapLevel.LOW, evidence: 'Default' }, { upsert: true });

    const learnerC = await User.findOneAndUpdate({ email: 'severe@mospi.gov.in' }, { passwordHash: learnerHash, role: UserRole.LEARNER }, { upsert: true, new: true });
    await Profile.findOneAndUpdate({ user: learnerC._id }, { firstName: 'Chirag', lastName: 'Low', department: diid._id, designation: jd._id }, { upsert: true });
    await SkillGap.findOneAndUpdate({ learner: learnerC._id, competency: c3._id }, { currentLevel: 1, requiredLevel: 5, gapSize: 4, gapClassification: SkillGapLevel.CRITICAL, evidence: 'Default' }, { upsert: true });
    await SkillGap.findOneAndUpdate({ learner: learnerC._id, competency: c2._id }, { currentLevel: 1, requiredLevel: 4, gapSize: 3, gapClassification: SkillGapLevel.CRITICAL, evidence: 'Default' }, { upsert: true });

    // 5. Internal Catalogs
    await LearningResource.findOneAndUpdate({ title: 'Internal Guide to R', provider: 'INTERNAL' }, { description: 'MoSPI internal guide.', durationMinutes: 60, competencies: [c4._id], source: 'INTERNAL', type: 'COURSE', difficulty: 'BEGINNER', isActive: true }, { upsert: true });
    await LearningResource.findOneAndUpdate({ title: 'Executive Leadership Seminar', provider: 'INTERNAL' }, { description: 'Internal seminar.', durationMinutes: 120, competencies: [c3._id], source: 'INTERNAL', type: 'COURSE', difficulty: 'ADVANCED', isActive: true }, { upsert: true });

    // 6. Integration Configurations
    await IntegrationConfig.findOneAndUpdate({ provider: 'IGOT' }, { isEnabled: true, status: IntegrationStatus.HEALTHY, lastSuccessfulSyncAt: new Date() }, { upsert: true });
    await IntegrationConfig.findOneAndUpdate({ provider: 'NSSTA' }, { isEnabled: true, status: IntegrationStatus.CONFIGURED }, { upsert: true });

    console.log('✅ Phase 17 E2E Seed completed safely!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedPhase17();
