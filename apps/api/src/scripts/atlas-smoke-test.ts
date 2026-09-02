import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, UserRole } from '../models';

dotenv.config({ path: '../../.env' });

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function runSmokeTest() {
  if (!MONGO_URI) {
    console.error('❌ MONGODB_URI is not set. Cannot run smoke test.');
    process.exit(1);
  }

  console.log(`🔌 Attempting to connect to MongoDB URI: ${MONGO_URI.split('@')[1] || 'Local/Hidden'}`);
  
  try {
    const start = Date.now();
    await mongoose.connect(MONGO_URI);
    const duration = Date.now() - start;
    
    console.log(`✅ Successfully connected to MongoDB Atlas in ${duration}ms`);
    console.log(`📂 Database Name: ${mongoose.connection.name}`);
    console.log(`🌍 Host: ${mongoose.connection.host}`);
    
    // 1. Ping test
    const pingResult = await mongoose.connection.db!.admin().ping();
    console.log(`🏓 Ping successful:`, pingResult);

    // 2. Read test
    console.log('📖 Attempting to read from Users collection...');
    const userCount = await User.countDocuments();
    console.log(`👥 Found ${userCount} users in the database.`);

    // 3. Write/Update/Delete test
    console.log('✍️ Attempting a non-destructive write operation...');
    const smokeTestEmail = 'smoke.test.temp@mospi.gov.in';
    
    // Cleanup if it already exists
    await User.deleteOne({ email: smokeTestEmail });
    
    // Write
    const tempUser = await User.create({
      email: smokeTestEmail,
      passwordHash: 'temporary_hash',
      role: UserRole.LEARNER
    });
    console.log(`💾 Successfully wrote temp user with ID: ${tempUser._id}`);
    
    // Read
    const fetchedUser = await User.findOne({ email: smokeTestEmail });
    if (!fetchedUser) throw new Error('Could not read the user just written');
    console.log('🔍 Successfully read back the temp user.');
    
    // Delete
    await User.deleteOne({ email: smokeTestEmail });
    console.log('🗑️ Successfully cleaned up the temp user.');

    console.log('🚀 ATLAS SMOKE TEST PASSED COMPLETELY.');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ ATLAS SMOKE TEST FAILED:');
    console.error(error);
    process.exit(1);
  }
}

runSmokeTest();
