import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../index';
import { User, Profile, Competency, Role, Department, RoleCompetency } from '../models';

describe('End-to-End Workflow: Register -> Recommend', () => {
  let learnerToken: string;
  let learnerId: string;
  let compId: string;
  let roleId: string;
  let deptId: string;

  beforeAll(async () => {
    // Note: Jest should be configured with mongodb-memory-server
    // So we don't connect here, assuming a global setup or test env handles it.
    
    // Seed some prerequisite data
    const dept = await Department.create({ name: 'Statistics', code: 'STAT' });
    deptId = dept._id.toString();

    const role = await Role.create({ name: 'Data Analyst', code: 'DA', department: dept._id });
    roleId = role._id.toString();

    const comp = await Competency.create({ 
      name: 'Data Analysis', 
      code: 'COMP-DA', 
      domain: 'Technical', 
      description: 'Analyze data' 
    });
    compId = comp._id.toString();

    await RoleCompetency.create({
      role: role._id,
      competency: comp._id,
      requiredLevel: 4
    });
  });

  afterAll(async () => {
    // cleanup
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('1. Registers a new learner', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'e2e@test.com',
        password: 'Password123!',
        firstName: 'End',
        lastName: 'ToEnd'
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    learnerToken = res.body.token;
    learnerId = res.body.user.id;
  });

  it('2. Completes Onboarding', async () => {
    const res = await request(app)
      .post('/api/profile/onboarding')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        department: deptId,
        designation: roleId
      });

    expect(res.status).toBe(200);
    expect(res.body.onboardingStatus).toBe('COMPLETED');
  });

  it('3. Learner takes an Assessment', async () => {
    // Submitting assessment directly
    const res = await request(app)
      .post('/api/assessments/submit')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({
        competencyId: compId,
        answers: [], // Mock answers since deterministic scoring is based on level/score in this E2E
        scorePercentage: 60 // Should map to level 2 if previous was 1
      });

    expect(res.status).toBe(201);
    expect(res.body.level).toBe(2);
  });

  it('4. Asserts Skill Gap was recalculated correctly', async () => {
    const res = await request(app)
      .get('/api/skill-gaps')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].currentLevel).toBe(2);
    expect(res.body[0].requiredLevel).toBe(4);
    expect(res.body[0].gapSize).toBe(2);
  });

  it('5. Asserts Recommendation is created and Learning Path can be generated', async () => {
    const res = await request(app)
      .post('/api/learning/path/generate')
      .set('Authorization', `Bearer ${learnerToken}`);

    expect(res.status).toBe(201);
    expect(res.body.isActive).toBe(true);
    // Even if we mocked AI, the path should be generated using fallback deterministic sort
  });
});
