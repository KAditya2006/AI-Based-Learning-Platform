import request from 'supertest';
import express from 'express';
import { integrationsRouter } from '../../routes/admin/integrations';
import { IntegrationConfig } from '../../models';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const app = express();
app.use(express.json());

// Mocking the auth middleware to simulate a Learner vs Admin
app.use((req, res, next) => {
  const role = req.headers['x-role'];
  if (!role) return res.status(401).json({ message: 'Unauthorized' });
  if (role === 'LEARNER' && req.originalUrl.includes('/admin/')) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
});

app.use('/admin/integrations', integrationsRouter);

describe('Phase 19: Integration Security and Modes', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await IntegrationConfig.deleteMany({});
    await IntegrationConfig.create({ provider: 'IGOT', isEnabled: true, status: 'CONFIGURED' });
  });

  it('should deny learners access to integration configs', async () => {
    const res = await request(app)
      .get('/admin/integrations')
      .set('x-role', 'LEARNER');
    
    expect(res.status).toBe(403);
  });

  it('should allow admins access to integration configs', async () => {
    const res = await request(app)
      .get('/admin/integrations')
      .set('x-role', 'ADMIN');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].provider).toBe('IGOT');
    expect(res.body[0].activeMode).toBeDefined();
  });
});
