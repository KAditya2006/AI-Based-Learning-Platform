const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://instantseva29_db_user:phcCo6HJ35W6xdFw@stackphantom.tej52rv.mongodb.net/mospi_skill_platform_atlas?retryWrites=true&w=majority&appName=StackPhantom";

mongoose.connect(MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const admin = await db.collection('users').findOne({ email: 'admin@mospi.gov.in' });
  console.log("Admin in DB:", admin);
  
  if (admin) {
    const isMatch = await bcrypt.compare('Admin@123', admin.passwordHash);
    console.log("Password matches Admin@123?", isMatch);
  } else {
    console.log("Admin not found. DB needs to be seeded.");
  }
  process.exit(0);
}).catch(console.error);
