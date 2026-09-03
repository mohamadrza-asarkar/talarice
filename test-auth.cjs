const axios = require('axios');
async function test() {
  try {
    const res = await axios.post('https://ais-dev-rpvkewlvjilhjnoamjgjvq-240344892228.europe-west1.run.app/api/auth/login', {
      phone: '09171234567',
      password: 'password123'
    });
    console.log(res.data);
  } catch(e) {
    console.log(e.response?.data || e.message);
  }
}
test();
