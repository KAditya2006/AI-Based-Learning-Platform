const mongoose = require('mongoose');
const { User, Profile } = require('./src/models');
const { AuthService } = require('./src/services/AuthService');

async function testRegistration() {
  await mongoose.connect('mongodb+srv://instantseva29_db_user:phcCo6HJ35W6xdFw@stackphantom.tej52rv.mongodb.net/mospi_skill_platform_atlas?retryWrites=true&w=majority&appName=StackPhantom');
  
  try {
    const existing = await User.findOne({ email: 'test_reg3@example.com' });
    if (existing) {
      await Profile.deleteOne({ user: existing._id });
      await User.deleteOne({ _id: existing._id });
    }

    const payload = {
      email: 'test_reg3@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'Official',
      organization: 'ORG_1',
      departmentName: 'DEP_1',
      designationName: 'DES_1_3',
      functionalRole: 'FR_1_3_1',
      experience: { totalExperience: '3 Years' },
      skills: [{ skill: 'Python', proficiency: 'Advanced' }]
    };

    const res = await AuthService.register(payload);
    console.log("Registration returned:", res.user.email);

    const savedProfile = await Profile.findOne({ user: res.user.id });
    console.log("Saved Profile in DB:");
    console.log(savedProfile);
  } catch (e) {
    console.error("Error:", e);
  }
  
  mongoose.disconnect();
}
testRegistration();
