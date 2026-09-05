const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'http_reg@example.com',
      password: 'password123'
    });
    const token = loginRes.data.data.token;
    
    const profileRes = await axios.get('http://localhost:3000/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("PROFILE API RESPONSE:", profileRes.data);
  } catch (e) {
    console.error("Error:", e.response?.data || e.message);
  }
}
test();
