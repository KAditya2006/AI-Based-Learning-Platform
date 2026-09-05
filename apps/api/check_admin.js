const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/mospi-skill-platform').then(async () => {
  const db = mongoose.connection.db;
  const admin = await db.collection('users').findOne({ email: 'admin@mospi.gov.in' });
  console.log("Admin in DB:", admin);
  
  if (admin) {
    const isMatch = await bcrypt.compare('Admin@123', admin.passwordHash);
    console.log("Password matches Admin@123?", isMatch);
  }
  process.exit(0);
});
