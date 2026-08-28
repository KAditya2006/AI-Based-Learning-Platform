import { AnalyticsService } from '../AnalyticsService';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('AnalyticsService', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should expose getDepartmentIntelligence method', () => {
    expect(AnalyticsService.getDepartmentIntelligence).toBeDefined();
  });

  it('should expose getRoleIntelligence method', () => {
    expect(AnalyticsService.getRoleIntelligence).toBeDefined();
  });

  it('should expose getCompetencyHeatmap method', () => {
    expect(AnalyticsService.getCompetencyHeatmap).toBeDefined();
  });

  it('should expose getLearningEffectiveness method', () => {
    expect(AnalyticsService.getLearningEffectiveness).toBeDefined();
  });
});
