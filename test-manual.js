// Simple script to test the OTP functionality
const fetch = require('node-fetch');

async function testSignupOTP() {
  console.log('Testing signup OTP...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/signup/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser123'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('\n✓ OTP request successful!');
      console.log('Check server-output.log for the OTP code');
    } else {
      console.log('\n✗ Error:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

testSignupOTP();