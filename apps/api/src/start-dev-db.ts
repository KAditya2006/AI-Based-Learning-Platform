import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import path from 'path';

// Load initial env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function start() {
  console.log('Starting MongoDB Memory Server...');
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  process.env.MONGODB_URI = mongoUri;
  console.log(`MongoDB Memory Server started at ${mongoUri}`);

  // Need to run seeder first
  process.env.NODE_ENV = 'development';
  process.env.PORT = '4000';
  
  // Seed the DB
  const { seed } = await import('./seed/seed');
  await seed();
  console.log('Database seeded successfully.');

  // Start the actual API server
  require('./index');
}

start().catch(console.error);
