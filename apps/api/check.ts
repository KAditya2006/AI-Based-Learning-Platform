const mongoose = require('mongoose');
const { User, Profile } = require('./src/models');

async function check() {
  await mongoose.connect('mongodb+srv://instantseva29_db_user:phcCo6HJ35W6xdFw@stackphantom.tej52rv.mongodb.net/mospi_skill_platform_atlas?retryWrites=true&w=majority&appName=StackPhantom');
  
  const user = await User.findOne({ email: 'http_reg@example.com' });
  if (user) {
    const profile = await Profile.findOne({ user: user._id });
    console.log("Profile Data from HTTP POST:");
    console.log(profile);
  } else {
    console.log("User not found!");
  }
  
  mongoose.disconnect();
}
check();
