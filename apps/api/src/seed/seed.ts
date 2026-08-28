import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Profile, Role, Department, CompetencyFramework, Competency, RoleCompetency, UserRole, CompetencyDomain } from '../models';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mospi_skill_platform';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Role.deleteMany({});
    await Department.deleteMany({});
    await CompetencyFramework.deleteMany({});
    await Competency.deleteMany({});
    await RoleCompetency.deleteMany({});

    // 1. Departments
    const diid = await Department.create({ name: 'Data Informatics & Innovation Division', code: 'DIID' });
    const nad = await Department.create({ name: 'National Accounts Division', code: 'NAD' });
    const esd = await Department.create({ name: 'Economic Statistics Division', code: 'ESD' });

    // 2. Roles (Designations)
    const jso = await Role.create({ name: 'Junior Statistical Officer', code: 'JSO' });
    const sso = await Role.create({ name: 'Senior Statistical Officer', code: 'SSO' });
    const ad = await Role.create({ name: 'Assistant Director', code: 'AD' });

    // 3. Framework & Competencies
    const framework = await CompetencyFramework.create({ name: 'Official Statistical System Competency Framework', version: '1.0' });

    const compStat = await Competency.create({
      framework: framework._id,
      name: 'Advanced Sampling Techniques',
      code: 'STAT-01',
      domain: CompetencyDomain.STATISTICAL,
      description: 'Ability to design and evaluate complex survey samples.'
    });

    const compTech = await Competency.create({
      framework: framework._id,
      name: 'R for Data Science',
      code: 'TECH-01',
      domain: CompetencyDomain.TECHNICAL,
      description: 'Proficiency in R programming for statistical analysis.'
    });

    const compLead = await Competency.create({
      framework: framework._id,
      name: 'Project Management',
      code: 'LEAD-01',
      domain: CompetencyDomain.BEHAVIOURAL_MANAGERIAL,
      description: 'Managing large scale data collection projects.'
    });

    // 4. Role Competency Mappings
    await RoleCompetency.create({ role: jso._id, competency: compStat._id, requiredLevel: 2 });
    await RoleCompetency.create({ role: jso._id, competency: compTech._id, requiredLevel: 2 });
    
    await RoleCompetency.create({ role: sso._id, competency: compStat._id, requiredLevel: 4 });
    await RoleCompetency.create({ role: sso._id, competency: compTech._id, requiredLevel: 3 });
    await RoleCompetency.create({ role: sso._id, competency: compLead._id, requiredLevel: 2 });
    
    await RoleCompetency.create({ role: ad._id, competency: compStat._id, requiredLevel: 5 });
    await RoleCompetency.create({ role: ad._id, competency: compLead._id, requiredLevel: 4 });

    // 5. Admin User
    const adminUser = new User({ email: 'admin@mospi.gov.in', passwordHash: 'Admin@123', role: UserRole.ADMIN });
    await adminUser.save();
    await Profile.create({ user: adminUser._id, firstName: 'System', lastName: 'Admin', department: diid._id });

    // 6. Learner Users
    const learner1 = new User({ email: 'ajay.kumar@mospi.gov.in', passwordHash: 'Learner@123', role: UserRole.LEARNER });
    await learner1.save();
    await Profile.create({ user: learner1._id, firstName: 'Ajay', lastName: 'Kumar', department: nad._id, designation: jso._id });

    const learner2 = new User({ email: 'priya.sharma@mospi.gov.in', passwordHash: 'Learner@123', role: UserRole.LEARNER });
    await learner2.save();
    await Profile.create({ user: learner2._id, firstName: 'Priya', lastName: 'Sharma', department: esd._id, designation: sso._id });

    console.log('✅ Realistic Demo Data Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
