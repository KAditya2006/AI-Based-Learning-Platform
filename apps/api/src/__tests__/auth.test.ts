import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../index';
import { User, Profile } from '../models';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@mospi.gov.in',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('test@mospi.gov.in');
    expect(res.body.data.token).toBeDefined();

    const user = await User.findOne({ email: 'test@mospi.gov.in' });
    expect(user).not.toBeNull();
    
    const profile = await Profile.findOne({ user: user?._id });
    expect(profile).not.toBeNull();
    expect(profile?.firstName).toBe('Test');
  });

  it('should fail registration with invalid input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: '123'
      });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
