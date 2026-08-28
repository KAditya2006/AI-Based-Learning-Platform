import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../../index';
import { User, UserRole } from '../../models';
import { generateToken } from '../../utils/jwt';

describe('Phase 17 - Security Acceptance E2E', () => {
  let mongoServer: MongoMemoryServer;
  let learnerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const learner = await User.create({ email: 'learner@sec.gov.in', passwordHash: 'hash', role: UserRole.LEARNER });
    const admin = await User.create({ email: 'admin@sec.gov.in', passwordHash: 'hash', role: UserRole.ADMIN });

    learnerToken = generateToken(learner._id.toString(), UserRole.LEARNER);
    adminToken = generateToken(admin._id.toString(), UserRole.ADMIN);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('1. Should block Learners from accessing Admin API endpoints (RBAC Verification)', async () => {
    const response = await request(app)
      .post('/api/admin/integrations/sync')
      .set('Authorization', `Bearer ${learnerToken}`)
      .send({ provider: 'IGOT' });
    
    expect(response.status).toBe(403);
    expect(response.body.error).toHaveProperty('code', 'FORBIDDEN');
  });

  it('2. Should allow Admins to access Admin API endpoints', async () => {
    const response = await request(app)
      .post('/api/admin/integrations/sync')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ provider: 'IGOT' });
    
    expect(response.status).not.toBe(403);
    expect(response.status).not.toBe(401);
  });

  it('3. Should reject requests without authorization headers', async () => {
    const response = await request(app)
      .post('/api/admin/integrations/sync')
      .send({ provider: 'IGOT' });
    
    expect(response.status).toBe(401);
  });
});
