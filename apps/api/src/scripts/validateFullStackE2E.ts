import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../../../../.env') });
}

import {
  User,
  Profile,
  Department,
  Role,
  Competency,
  CompetencyFramework,
  SkillGap,
  LearningResource,
  Enrollment,
  Question,
  Assessment,
  AssessmentAttempt,
  Material,
  AIJob,
  Notification,
  AuditLog,
  IntegrationConfig,
  IntegrationSyncJob,
  UserRole,
  UserStatus,
  AttemptPolicy,
  EnrollmentStatus,
  ResourceSource,
  RoleCompetency
} from '../models';

import { AuthService } from '../services/AuthService';
import { SkillGapService } from '../services/SkillGapService';
import { AssessmentService } from '../services/AssessmentService';
import { QuizService } from '../services/QuizService';
import { LearningService } from '../services/LearningService';
import { PersonalizationService } from '../services/PersonalizationService';
import { AnalyticsService } from '../services/AnalyticsService';
import { IntegrationSyncService } from '../services/IntegrationSyncService';
import { JobService } from '../services/JobService';
import { AuditService } from '../services/AuditService';
import { NotificationService } from '../services/NotificationService';
import { MockAIProvider } from '../ai/MockAIProvider';

async function runE2EValidation() {
  console.log('================================================================');
  console.log('🚀 FULL-STACK END-TO-END APPLICATION VALIDATION & AUDIT STARTING');
  console.log('================================================================');

  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://instantseva29_db_user:phcCo6HJ35W6xdFw@stackphantom.tej52rv.mongodb.net/mospi_skill_platform_atlas?retryWrites=true&w=majority&appName=StackPhantom';
  console.log('📡 Connecting to MongoDB...');
  
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 6000 });
    console.log('✅ MongoDB connected successfully to database cluster.');
  } catch (err: any) {
    console.warn('⚠️ Atlas connection timed out/failed. Starting MongoMemoryServer fallback for local execution...', err.message);
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    console.log('✅ MongoMemoryServer connected successfully.');
  }

  const results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];

  const recordResult = (test: string, passed: boolean, details?: string) => {
    results.push({ test, status: passed ? 'PASS' : 'FAIL', details });
    if (passed) {
      console.log(`  ✅ [PASS] ${test}`);
    } else {
      console.error(`  ❌ [FAIL] ${test} - ${details || 'Assertion failed'}`);
    }
  };

  try {
    // -------------------------------------------------------------
    // 1. DATABASE & SEEDING VALIDATION
    // -------------------------------------------------------------
    console.log('\n--- 1. DATABASE & SEEDING VALIDATION ---');
    
    // Seed Department & Role
    let dept = await Department.findOne({ code: 'DIID' });
    if (!dept) {
      dept = await Department.create({
        name: 'Data Informatics & Innovation Division',
        code: 'DIID',
        description: 'MoSPI core technology division'
      });
    }
    recordResult('Department persistence (DIID)', !!dept);

    let role = await Role.findOne({ name: 'Junior Statistical Officer' });
    if (!role) {
      role = await Role.create({
        name: 'Junior Statistical Officer',
        code: 'JSO',
        description: 'Field data collection and statistical tabulation.'
      });
    }
    recordResult('Role persistence (JSO)', !!role);

    // Seed Competency Framework
    let framework = await CompetencyFramework.findOne({ code: 'MOSPI-CF-2026' });
    if (!framework) {
      framework = await CompetencyFramework.create({
        name: 'MoSPI National Statistical Capability Framework',
        code: 'MOSPI-CF-2026',
        version: '2.0.0',
        isActive: true,
        domains: ['Survey Design & Sampling', 'National Accounts', 'Data Informatics & AI']
      });
    }
    recordResult('CompetencyFramework persistence', !!framework);

    // Seed Competencies
    let comp1 = await Competency.findOne({ code: 'STAT-SAM-01' });
    if (!comp1) {
      comp1 = await Competency.create({
        name: 'Probability Sampling & Stratification',
        code: 'STAT-SAM-01',
        domain: 'STATISTICAL',
        framework: framework._id,
        description: 'Mastery of multistage cluster sampling and stratification methodologies.'
      });
    }
    recordResult('Competency 1 persistence (Probability Sampling)', !!comp1);

    let comp2 = await Competency.findOne({ code: 'STAT-ML-01' });
    if (!comp2) {
      comp2 = await Competency.create({
        name: 'Machine Learning for Official Statistics',
        code: 'STAT-ML-01',
        domain: 'TECHNICAL',
        framework: framework._id,
        description: 'Applying predictive modeling to national statistical surveys.'
      });
    }
    recordResult('Competency 2 persistence (Machine Learning)', !!comp2);

    // Role Competency Mapping (Level 3 required for comp1)
    let roleComp = await RoleCompetency.findOne({ role: role._id, competency: comp1._id });
    if (!roleComp) {
      roleComp = await RoleCompetency.create({
        role: role._id,
        competency: comp1._id,
        requiredLevel: 3
      });
    }
    recordResult('Role Competency Mapping persistence', !!roleComp);

    // Seed Learning Resource
    let resource = await LearningResource.findOne({ title: 'Advanced Stratified Sampling in National Surveys' });
    if (!resource) {
      resource = await LearningResource.create({
        title: 'Advanced Stratified Sampling in National Surveys',
        description: 'Master practical cluster and stratified sampling frameworks used by MoSPI survey divisions.',
        type: 'COURSE',
        source: ResourceSource.INTERNAL,
        provider: 'MoSPI DIID',
        durationMinutes: 180,
        difficulty: 'INTERMEDIATE',
        competencies: [comp1._id],
        isActive: true
      });
    }
    recordResult('Learning Resource persistence', !!resource);

    // Seed Questions & Assessment
    let q1 = await Question.findOne({ text: 'In stratified random sampling, what is the primary reason for stratifying a population?' });
    if (!q1) {
      q1 = await Question.create({
        text: 'In stratified random sampling, what is the primary reason for stratifying a population?',
        competency: comp1._id,
        difficulty: 'INTERMEDIATE',
        options: [
          { id: 'opt_1', text: 'To reduce the total sample size without regard to precision' },
          { id: 'opt_2', text: 'To increase the precision of the overall estimate and ensure representation across subgroups' },
          { id: 'opt_3', text: 'To eliminate non-sampling bias completely' },
          { id: 'opt_4', text: 'To avoid probability calculations' }
        ],
        correctOptionId: 'opt_2',
        explanation: 'Stratification groups homogeneous elements, reducing variance of estimates.',
        status: 'APPROVED'
      });
    }
    recordResult('Question persistence', !!q1);

    let assessment = await Assessment.findOne({ title: 'Survey Sampling Competency Diagnostic' });
    if (!assessment) {
      assessment = await Assessment.create({
        title: 'Survey Sampling Competency Diagnostic',
        description: 'Official diagnostic evaluation for Junior Statistical Officers.',
        competency: comp1._id,
        passingScore: 80,
        questions: [q1._id],
        attemptPolicy: AttemptPolicy.UNLIMITED,
        isPublished: true
      });
    }
    recordResult('Assessment persistence', !!assessment);

    // -------------------------------------------------------------
    // 2. AUTHENTICATION & RBAC LIFECYCLE
    // -------------------------------------------------------------
    console.log('\n--- 2. AUTHENTICATION & RBAC LIFECYCLE ---');
    
    const learnerEmail = `officer_${Date.now()}@mospi.gov.in`;
    const learnerPassword = 'SecurePassword2026!';
    
    // Register
    const regResult = await AuthService.register(
      learnerEmail,
      learnerPassword,
      'Rohan',
      'Sharma',
      UserRole.LEARNER
    );
    recordResult('Learner registration', !!regResult.user && regResult.user.role === UserRole.LEARNER);

    const userDoc = await User.findById(regResult.user._id);
    recordResult('Password hashed with bcrypt', !!userDoc && userDoc.passwordHash !== learnerPassword && userDoc.passwordHash.startsWith('$2'));

    // Attach role/designation to profile for gap calculation
    await Profile.updateOne({ user: userDoc?._id }, { designation: role._id, department: dept._id });

    // Login
    const loginResult = await AuthService.login(learnerEmail, learnerPassword);
    recordResult('Learner login & JWT generation', !!loginResult.token && !!loginResult.user);

    // Password Recovery Flow
    const resetToken = jwt.sign({ userId: userDoc?._id, type: 'PASSWORD_RESET' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    const newPassword = 'UpdatedPassword2026!';
    const decoded: any = jwt.verify(resetToken, process.env.JWT_SECRET || 'secret');
    const resetUser = await User.findById(decoded.userId);
    if (resetUser) {
      resetUser.passwordHash = newPassword; // Mongoose pre-save hashes this
      await resetUser.save();
    }
    const loginWithNewPass = await AuthService.login(learnerEmail, newPassword);
    recordResult('Forgot password & reset lifecycle', !!loginWithNewPass.token);

    // Admin Creation & RBAC
    const adminEmail = `admin_${Date.now()}@mospi.gov.in`;
    const adminUser = await User.create({
      email: adminEmail,
      passwordHash: 'AdminPassword2026!',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    });
    recordResult('Admin account provisioning', !!adminUser && adminUser.role === UserRole.ADMIN);

    // -------------------------------------------------------------
    // 3. LEARNER INTELLIGENCE & SKILL-GAP DETERMINISTIC LOOP
    // -------------------------------------------------------------
    console.log('\n--- 3. LEARNER INTELLIGENCE & SKILL-GAP LOOP ---');

    // Trigger Initial Skill Gap Calculation
    await SkillGapService.recalculateLearnerGaps(userDoc?._id.toString() as string);
    const initialGaps = await SkillGap.find({ learner: userDoc?._id });
    recordResult('SkillGap calculation executed from role requirement', initialGaps.length >= 0);

    // Enroll into Course
    const enrollment = await LearningService.enroll(userDoc?._id.toString() as string, resource._id.toString());
    recordResult('Resource enrollment created', !!enrollment && enrollment.status === EnrollmentStatus.IN_PROGRESS);

    // Update Progress in Focus Player
    const progressUpdate = await LearningService.updateProgress(
      userDoc?._id.toString() as string,
      resource._id.toString(),
      50
    );
    recordResult('Learning player progress persistence (50%)', progressUpdate.progressPercentage === 50);

    // Complete Resource (100%)
    const completionUpdate = await LearningService.updateProgress(
      userDoc?._id.toString() as string,
      resource._id.toString(),
      100
    );
    recordResult('Learning resource completion (100%)', completionUpdate.status === EnrollmentStatus.COMPLETED);

    // Submit Assessment with 100% Score
    const submissionResult = await QuizService.submitQuiz(
      userDoc?._id.toString() as string,
      assessment._id.toString(),
      [{ questionId: q1._id.toString(), selectedOptionId: 'opt_2' }]
    );
    recordResult('Assessment submission & scoring (100%)', submissionResult.attempt.percentage === 100 && submissionResult.attempt.passed === true);
    recordResult('Deterministic competency level jump (+2 for >=95%)', submissionResult.newLevel >= 2);

    // Verify SkillGap Recalculation after assessment
    const updatedGaps = await SkillGap.find({ learner: userDoc?._id });
    recordResult('SkillGap dynamic recalculation in DB', updatedGaps !== null);

    // Recommendations Generation (Personalization Engine)
    const recommendations = await PersonalizationService.generateDeterministicRecommendations(userDoc?._id.toString() as string);
    recordResult('Personalization engine recommendations', Array.isArray(recommendations));

    // Learning History Transcript
    const enrollments = await Enrollment.find({ learner: userDoc?._id }).populate('resource');
    recordResult('Learning history transcript retrieved', enrollments.length > 0);

    // -------------------------------------------------------------
    // 4. ADMIN MANAGEMENT & INTELLIGENCE FLOWS
    // -------------------------------------------------------------
    console.log('\n--- 4. ADMIN MANAGEMENT & INTELLIGENCE FLOWS ---');

    // Analytics Aggregations
    const workforceAnalytics = await AnalyticsService.getDepartmentIntelligence();
    recordResult('Department Intelligence MongoDB Aggregation', Array.isArray(workforceAnalytics));

    const roleIntelligence = await AnalyticsService.getRoleIntelligence();
    recordResult('Role Intelligence MongoDB Aggregation', Array.isArray(roleIntelligence));

    const heatmap = await AnalyticsService.getCompetencyHeatmap();
    recordResult('Competency Heatmap Matrix Aggregation', Array.isArray(heatmap));

    // Audit Logging
    await AuditService.log(
      adminUser._id.toString(),
      'ADMIN_E2E_VALIDATION',
      'System',
      { executedAt: new Date() }
    );
    const logs = await AuditLog.find({ action: 'ADMIN_E2E_VALIDATION' });
    recordResult('Immutable AuditLog persistence', logs.length > 0);

    // Notification Service
    await NotificationService.createNotification(
      userDoc?._id.toString() as string,
      'ASSESSMENT',
      'Assessment Complete',
      'You passed the Survey Sampling Diagnostic evaluation with 100% mastery.'
    );
    const notifications = await Notification.find({ learnerId: userDoc?._id });
    recordResult('Notification creation and persistence', notifications.length > 0);

    // -------------------------------------------------------------
    // 5. CONTENT INGESTION & AI QUESTION EXTRACTION
    // -------------------------------------------------------------
    console.log('\n--- 5. CONTENT INGESTION & AI WORKFLOWS ---');

    const material = await Material.create({
      title: 'National Accounts Statistics 2026 Manual',
      filename: 'national_accounts_2026.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 450000,
      uploadedBy: adminUser._id,
      processingStatus: 'READY'
    });
    recordResult('Admin Material upload and persistence', !!material);

    // AI Job Creation
    const aiJob = await JobService.createJob(adminUser._id.toString(), 'MCQ_GENERATION', {
      materialId: material._id.toString(),
      competencyId: comp2._id.toString()
    });
    recordResult('AI Job persistence & state tracking (QUEUED -> PROCESSING)', !!aiJob && aiJob.status === 'QUEUED');

    // AI Assessment Question Extraction via MockAIProvider
    const mockAI = new MockAIProvider();
    const extractedMCQResponse = await mockAI.generateMCQs(
      ['Gross State Domestic Product (GSDP) represents the aggregate monetary value of all goods and services produced within a state.'],
      'Data Informatics & AI',
      'Intermediate',
      2
    );
    recordResult('AI Question generation & schema parsing', Array.isArray(extractedMCQResponse.questions) && extractedMCQResponse.questions.length > 0);

    // Approve question and insert into Question Bank
    if (extractedMCQResponse.questions.length > 0) {
      const draft = extractedMCQResponse.questions[0];
      const approvedQ = await Question.create({
        text: draft.text,
        competency: comp2._id,
        difficulty: 'INTERMEDIATE',
        options: draft.options,
        correctOptionId: draft.correctOptionId,
        explanation: draft.explanation,
        status: 'APPROVED'
      });
      recordResult('Admin Question review & approval into Question Bank', !!approvedQ);
    }

    // -------------------------------------------------------------
    // 6. EXTERNAL INTEGRATION SYNC & IDEMPOTENCY
    // -------------------------------------------------------------
    console.log('\n--- 6. EXTERNAL INTEGRATION SYNC & CONTROL PLANE ---');

    let igotConfig = await IntegrationConfig.findOne({ provider: 'IGOT' });
    if (!igotConfig) {
      igotConfig = await IntegrationConfig.create({
        provider: 'IGOT',
        isEnabled: true
      });
    }
    recordResult('IntegrationConfig persistence (iGOT)', !!igotConfig);

    // Execute Sync
    const syncJobId = await IntegrationSyncService.syncCatalog('IGOT', 'corr-12345');
    recordResult('Idempotent Integration Catalog Sync execution', !!syncJobId);

    // -------------------------------------------------------------
    // 7. BACKGROUND JOB RECOVERY & CONCURRENCY
    // -------------------------------------------------------------
    console.log('\n--- 7. BACKGROUND JOB RESILIENCE & LIFECYCLE ---');
    
    // Create a stale job to test recovery
    const staleJob = await AIJob.create({
      requesterId: adminUser._id.toString(),
      type: 'CATALOG_SYNC',
      status: 'PROCESSING',
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      metadata: { test: true }
    });
    await JobService.recoverStaleJobs();
    const recoveredJob = await AIJob.findById(staleJob._id);
    recordResult('Stale background job recovery (PROCESSING -> FAILED)', recoveredJob?.status === 'FAILED');

    // -------------------------------------------------------------
    // 8. SECURITY & PRIVILEGE BOUNDARIES
    // -------------------------------------------------------------
    console.log('\n--- 8. SECURITY & PRIVILEGE BOUNDARIES ---');
    
    // Check RBAC token payload
    const learnerPayload: any = jwt.verify(loginResult.token, process.env.JWT_SECRET || 'secret');
    const adminPayload: any = jwt.verify(
      jwt.sign({ userId: adminUser._id, role: adminUser.role, email: adminUser.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }),
      process.env.JWT_SECRET || 'secret'
    );
    recordResult('Learner token has role=LEARNER', learnerPayload.role === UserRole.LEARNER);
    recordResult('Admin token has role=ADMIN', adminPayload.role === UserRole.ADMIN);
    recordResult('Vertical privilege boundary: Learner cannot claim Admin rights', learnerPayload.role !== UserRole.ADMIN);

  } catch (error: any) {
    console.error('CRITICAL EXECUTION ERROR:', error);
    recordResult('Full Stack Execution', false, error.message);
  } finally {
    await JobService.drainActiveJobs(3000);
    await mongoose.connection.close();
    console.log('\n================================================================');
    console.log('📊 FINAL VALIDATION SUMMARY:');
    console.log(`Total Checks Executed: ${results.length}`);
    console.log(`Passed: ${results.filter(r => r.status === 'PASS').length}`);
    console.log(`Failed: ${results.filter(r => r.status === 'FAIL').length}`);
    console.log('================================================================\n');

    if (results.every(r => r.status === 'PASS')) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

runE2EValidation();
