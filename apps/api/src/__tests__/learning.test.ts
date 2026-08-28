import request from 'supertest';
import { app } from '../index';
import { UserRole } from '../models/User';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { generateToken } from '../utils/jwt';

let mongoServer: MongoMemoryServer;

describe('Learning API', () => {
  let learnerToken: string;
  let adminToken: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    // Generate valid mock JWT tokens
    learnerToken = generateToken(new mongoose.Types.ObjectId().toString(), UserRole.LEARNER);
    adminToken = generateToken(new mongoose.Types.ObjectId().toString(), UserRole.ADMIN);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/learning/library', () => {
    it('should block unauthenticated requests', async () => {
      const res = await request(app).get('/api/learning/library');
      expect(res.status).toBe(401);
    });

    it('should allow learners to fetch resources', async () => {
      // Mock db find or just let it hit the test DB
      const res = await request(app)
        .get('/api/learning/library')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/learning/path', () => {
    it('should allow learners to fetch their path', async () => {
      const res = await request(app)
        .get('/api/learning/path')
        .set('Authorization', `Bearer ${learnerToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
