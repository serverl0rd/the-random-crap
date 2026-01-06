// Add comprehensive error logging to the frontend
const debugCode = `
// Add this to the signup function
async function sendSignupOTP() {
  const email = document.getElementById('signup-email').value;
  const username = document.getElementById('signup-username').value;
  const errorDiv = document.getElementById('signup-error');
  const button = document.getElementById('signup-button');
  
  console.log('sendSignupOTP called');
  console.log('Email:', email);
  console.log('Username:', username);
  
  if (!email || !username) {
    errorDiv.textContent = 'Please fill in all fields';
    console.log('Validation failed: empty fields');
    return;
  }
  
  // Disable button and show loading state
  button.disabled = true;
  button.textContent = 'Sending...';
  errorDiv.textContent = '';
  
  try {
    console.log('Sending request to /api/signup/send-otp');
    
    const res = await fetch('/api/signup/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username })
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    const data = await res.json();
    console.log('Response data:', data);
    
    if (res.ok) {
      console.log('Success! Moving to OTP step');
      document.getElementById('signup-step1').style.display = 'none';
      document.getElementById('signup-step2').style.display = 'block';
      document.querySelector('#signup-otp-inputs .otp-input').focus();
    } else {
      console.log('Error from server:', data.error);
      errorDiv.textContent = data.error || 'Failed to send code';
    }
  } catch (err) {
    console.error('Caught error:', err);
    errorDiv.textContent = 'Failed to send code: ' + err.message;
  } finally {
    // Re-enable button
    button.disabled = false;
    button.textContent = 'Send Code';
  }
}
`;

console.log(debugCode);