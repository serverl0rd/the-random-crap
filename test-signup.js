const puppeteer = require('puppeteer');

async function testSignup() {
  console.log('Starting signup test...\n');
  
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--window-size=800,600']
  });
  
  const page = await browser.newPage();
  
  try {
    // Go to the site
    await page.goto('http://localhost:3000');
    console.log('✓ Loaded homepage');
    
    // Click signup tab
    const signupTab = await page.$$('.tab-button');
    await signupTab[1].click();
    console.log('✓ Clicked signup tab');
    
    // Fill in the form
    await page.type('#signup-email', 'test@example.com');
    await page.type('#signup-username', 'testuser');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for username check
    console.log('✓ Filled in signup form');
    
    // Intercept console logs
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('DEVELOPMENT MODE OTP')) {
        console.log('\n📧 OTP will be displayed in server console\n');
      }
    });
    
    // Click send code
    console.log('→ Clicking Send Code button...');
    await page.click('#signup-button');
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we moved to OTP step
    const otpStepVisible = await page.$eval('#signup-step2', el => {
      return window.getComputedStyle(el).display !== 'none';
    });
    
    if (otpStepVisible) {
      console.log('✓ Successfully moved to OTP entry step');
      console.log('\n📌 Check the server console for your OTP code!');
      console.log('   Look for "=== DEVELOPMENT MODE OTP ===" section\n');
      
      // Keep browser open for manual OTP entry
      console.log('Browser will stay open. Enter the OTP manually to test login.');
      console.log('Press Ctrl+C to close when done.\n');
      
      // Wait indefinitely
      await new Promise(() => {});
    } else {
      // Check for error
      const errorText = await page.$eval('#signup-error', el => el.textContent);
      console.log('✗ Error:', errorText || 'Unknown error');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    await browser.close();
  }
}

// Start the test
testSignup();