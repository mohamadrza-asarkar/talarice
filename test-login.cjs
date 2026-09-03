const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      phone: '09171234567', // Or whatever admin phone is
      password: 'password123'
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.log(e.response?.data);
  }
}
test();
