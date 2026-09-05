const mongoose = require('mongoose');
const { User, Profile } = require('./src/models');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mospi_skill_platform');
  
  const user = await User.findOne({ email: 'http_reg@example.com' });
  if (user) {
    const profile = await Profile.findOne({ user: user._id });
    console.log("Profile Data from HTTP POST on LOCAL DB:");
    console.log(profile);
  } else {
    console.log("User not found in LOCAL DB!");
  }
  
  mongoose.disconnect();
}
check();
