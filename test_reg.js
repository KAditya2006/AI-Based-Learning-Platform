const axios = require('axios');

async function testRegistration() {
  const email = `atlas-debug-${Date.now()}@example.com`;
  
  try {
    const res = await axios.post('http://localhost:4000/api/auth/register', {
      email,
      password: 'TestPassword123!',
      firstName: 'Debug',
      lastName: 'User',
      organization: 'MoSPI',
      department: 'CSO',
      designation: 'Director',
      functionalRole: 'Data Scientist',
      experienceLevel: 'Senior',
      skills: ['Python']
    });
    console.log('Registration success:', res.data);
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
  }
}

testRegistration();
