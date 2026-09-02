import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Profile, Role, Department, CompetencyFramework, Competency, RoleCompetency, UserRole, CompetencyDomain } from '../models';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

export async function seed() {
  if (!MONGO_URI) {
    console.error('CRITICAL: MONGODB_URI is missing. Cannot seed.');
    throw new Error('MONGODB_URI missing');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB for seeding. Database: ${mongoose.connection.name}`);

    if (process.env.NODE_ENV === 'production' && process.env.FORCE_SEED !== 'true') {
      console.warn('WARNING: Running seed in production requires FORCE_SEED=true.');
      return;
    }

    console.log('Running safe, idempotent seeding (upsert mode)...');

    // 1. Departments
    const diid = await Department.findOneAndUpdate({ code: 'DIID' }, { name: 'Data Informatics & Innovation Division' }, { upsert: true, new: true });
    const nad = await Department.findOneAndUpdate({ code: 'NAD' }, { name: 'National Accounts Division' }, { upsert: true, new: true });
    const esd = await Department.findOneAndUpdate({ code: 'ESD' }, { name: 'Economic Statistics Division' }, { upsert: true, new: true });

    // 2. Roles (Designations)
    const jso = await Role.findOneAndUpdate({ code: 'JSO' }, { name: 'Junior Statistical Officer' }, { upsert: true, new: true });
    const sso = await Role.findOneAndUpdate({ code: 'SSO' }, { name: 'Senior Statistical Officer' }, { upsert: true, new: true });
    const ad = await Role.findOneAndUpdate({ code: 'AD' }, { name: 'Assistant Director' }, { upsert: true, new: true });

    // 3. Framework & Competencies
    const framework = await CompetencyFramework.findOneAndUpdate({ version: '1.0' }, { name: 'Official Statistical System Competency Framework' }, { upsert: true, new: true });

    const compStat = await Competency.findOneAndUpdate({ code: 'STAT-01' }, {
      framework: framework._id,
      name: 'Advanced Sampling Techniques',
      domain: CompetencyDomain.STATISTICAL,
      description: 'Ability to design and evaluate complex survey samples.'
    }, { upsert: true, new: true });

    const compTech = await Competency.findOneAndUpdate({ code: 'TECH-01' }, {
      framework: framework._id,
      name: 'R for Data Science',
      domain: CompetencyDomain.TECHNICAL,
      description: 'Proficiency in R programming for statistical analysis.'
    }, { upsert: true, new: true });

    const compLead = await Competency.findOneAndUpdate({ code: 'LEAD-01' }, {
      framework: framework._id,
      name: 'Project Management',
      domain: CompetencyDomain.BEHAVIOURAL_MANAGERIAL,
      description: 'Managing large scale data collection projects.'
    }, { upsert: true, new: true });

    // 4. Role Competency Mappings
    await RoleCompetency.findOneAndUpdate({ role: jso._id, competency: compStat._id }, { requiredLevel: 2 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: jso._id, competency: compTech._id }, { requiredLevel: 2 }, { upsert: true });
    
    await RoleCompetency.findOneAndUpdate({ role: sso._id, competency: compStat._id }, { requiredLevel: 4 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: sso._id, competency: compTech._id }, { requiredLevel: 3 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: sso._id, competency: compLead._id }, { requiredLevel: 2 }, { upsert: true });
    
    await RoleCompetency.findOneAndUpdate({ role: ad._id, competency: compStat._id }, { requiredLevel: 5 }, { upsert: true });
    await RoleCompetency.findOneAndUpdate({ role: ad._id, competency: compLead._id }, { requiredLevel: 4 }, { upsert: true });

    // 5. Admin User
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const adminUser = await User.findOneAndUpdate({ email: 'admin@mospi.gov.in' }, {
      passwordHash: adminHash, role: UserRole.ADMIN
    }, { upsert: true, new: true });
    await Profile.findOneAndUpdate({ user: adminUser._id }, {
      firstName: 'System', lastName: 'Admin', department: diid._id
    }, { upsert: true });

    // 6. Learner Users
    const learnerHash = await bcrypt.hash('Learner@123', 10);
    const learner1 = await User.findOneAndUpdate({ email: 'ajay.kumar@mospi.gov.in' }, {
      passwordHash: learnerHash, role: UserRole.LEARNER
    }, { upsert: true, new: true });
    await Profile.findOneAndUpdate({ user: learner1._id }, {
      firstName: 'Ajay', lastName: 'Kumar', department: nad._id, designation: jso._id
    }, { upsert: true });

    const learner2 = await User.findOneAndUpdate({ email: 'priya.sharma@mospi.gov.in' }, {
      passwordHash: learnerHash, role: UserRole.LEARNER
    }, { upsert: true, new: true });
    await Profile.findOneAndUpdate({ user: learner2._id }, {
      firstName: 'Priya', lastName: 'Sharma', department: esd._id, designation: sso._id
    }, { upsert: true });

    console.log('✅ Realistic Demo Data Seeding completed safely!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}
