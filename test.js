const puppeteer = require('puppeteer');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_USERNAME = 'testuser123';
const TEST_POST = 'This is my first test post!';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Test results tracking
let passedTests = 0;
let failedTests = 0;
const testResults = [];

// Helper functions
async function logTest(testName, passed, details = '') {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`${status} ${testName}`);
  if (details) {
    console.log(`  ${colors.yellow}Details: ${details}${colors.reset}`);
  }
  testResults.push({ testName, passed, details });
  if (passed) passedTests++;
  else failedTests++;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clearTestData() {
  // Clean up test data files
  const fs = require('fs');
  try {
    if (fs.existsSync('posts.json')) {
      fs.writeFileSync('posts.json', JSON.stringify({ posts: [] }));
    }
    if (fs.existsSync('users.json')) {
      fs.writeFileSync('users.json', JSON.stringify({ users: {} }));
    }
  } catch (error) {
    console.log('Could not clear test data:', error.message);
  }
}

// Main test suite
async function runTests() {
  console.log(`${colors.blue}Starting The Random Crap Test Suite...${colors.reset}\n`);
  
  // Clear test data before starting
  await clearTestData();
  
  let browser;
  let page;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      slowMo: 50, // Slow down for visibility
      devtools: true
    });
    
    page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`${colors.red}Browser Console Error: ${msg.text()}${colors.reset}`);
      }
    });
    
    // Test 1: Homepage loads correctly
    console.log(`\n${colors.blue}Test Group: Homepage Loading${colors.reset}`);
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const title = await page.title();
      await logTest('Homepage loads with correct title', title === 'The Random Crap');
      
      const h1Exists = await page.$('h1.brand-title') !== null;
      await logTest('Brand title is visible', h1Exists);
      
      const tabsExist = await page.$$('.tab-button');
      await logTest('Login/Signup tabs are visible', tabsExist.length === 2);
    } catch (error) {
      await logTest('Homepage loading', false, error.message);
    }
    
    // Test 2: Signup flow
    console.log(`\n${colors.blue}Test Group: Signup Flow${colors.reset}`);
    
    // Click signup tab
    try {
      const signupTab = await page.$$('.tab-button');
      await signupTab[1].click();
      await delay(500);
      
      const signupFormVisible = await page.$('#signup-form');
      const signupFormDisplay = await page.evaluate(el => window.getComputedStyle(el).display, signupFormVisible);
      await logTest('Signup form becomes visible after clicking tab', signupFormDisplay !== 'none');
    } catch (error) {
      await logTest('Signup tab click', false, error.message);
    }
    
    // Test empty form submission
    try {
      await page.click('#signup-button');
      await delay(500);
      
      const errorText = await page.$eval('#signup-error', el => el.textContent);
      await logTest('Empty form shows error message', errorText.includes('Please fill in all fields'));
    } catch (error) {
      await logTest('Empty signup form validation', false, error.message);
    }
    
    // Test username validation
    try {
      await page.type('#signup-username', 'a');
      await delay(600);
      
      const checkDiv = await page.$('#username-check');
      const checkText = await page.evaluate(el => el.textContent, checkDiv);
      await logTest('Short username shows no availability check', checkText === '');
      
      await page.evaluate(() => document.querySelector('#signup-username').value = '');
      await page.type('#signup-username', 'test@user');
      await delay(600);
      
      const invalidCheckText = await page.$eval('#username-check', el => el.textContent);
      await logTest('Invalid username characters show error', invalidCheckText.includes('Only letters'));
    } catch (error) {
      await logTest('Username validation', false, error.message);
    }
    
    // Test valid signup attempt
    try {
      await page.evaluate(() => document.querySelector('#signup-username').value = '');
      await page.evaluate(() => document.querySelector('#signup-email').value = '');
      
      await page.type('#signup-email', TEST_EMAIL);
      await page.type('#signup-username', TEST_USERNAME);
      await delay(600);
      
      const availableText = await page.$eval('#username-check', el => el.textContent);
      await logTest('Valid username shows as available', availableText.includes('Available'));
      
      // Check network request when clicking send code
      const [response] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/api/signup/send-otp'), { timeout: 5000 }).catch(() => null),
        page.click('#signup-button')
      ]);
      
      if (response) {
        const responseData = await response.json().catch(() => ({}));
        await logTest('Send OTP API responds', response.status() === 200 || response.status() === 500);
        
        if (response.status() === 500) {
          await logTest('Email sending (expected to fail locally)', false, 'Email configuration needed');
        }
      } else {
        await logTest('Send OTP API request', false, 'No response received');
      }
    } catch (error) {
      await logTest('Signup API interaction', false, error.message);
    }
    
    // Test 3: Login flow
    console.log(`\n${colors.blue}Test Group: Login Flow${colors.reset}`);
    
    try {
      // Switch to login tab
      await page.click('.tab-button');
      await delay(500);
      
      const loginFormVisible = await page.$('#login-form');
      const loginFormDisplay = await page.evaluate(el => window.getComputedStyle(el).display, loginFormVisible);
      await logTest('Login form becomes visible after clicking tab', loginFormDisplay !== 'none');
      
      // Test empty email
      await page.click('button[onclick="sendLoginOTP()"]');
      await delay(500);
      
      const loginErrorText = await page.$eval('#login-error', el => el.textContent);
      await logTest('Empty login email shows error', loginErrorText.includes('Please enter your email'));
      
      // Test unregistered email
      await page.type('#login-email', 'unregistered@example.com');
      
      const [loginResponse] = await Promise.all([
        page.waitForResponse(response => response.url().includes('/api/login/send-otp'), { timeout: 5000 }).catch(() => null),
        page.click('button[onclick="sendLoginOTP()"]')
      ]);
      
      if (loginResponse) {
        const loginData = await loginResponse.json().catch(() => ({}));
        await logTest('Login with unregistered email shows error', loginResponse.status() === 400);
      }
    } catch (error) {
      await logTest('Login flow', false, error.message);
    }
    
    // Test 4: API Endpoints directly
    console.log(`\n${colors.blue}Test Group: API Endpoints${colors.reset}`);
    
    try {
      // Test username check endpoint
      const usernameCheckResponse = await page.evaluate(async () => {
        const response = await fetch('/api/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'testuser' })
        });
        return { status: response.status, data: await response.json() };
      });
      
      await logTest('Username check API works', usernameCheckResponse.status === 200);
    } catch (error) {
      await logTest('API endpoint testing', false, error.message);
    }
    
    // Test 5: Console errors check
    console.log(`\n${colors.blue}Test Group: JavaScript Errors${colors.reset}`);
    
    const jsErrors = [];
    page.on('pageerror', error => jsErrors.push(error.message));
    
    await page.reload({ waitUntil: 'networkidle0' });
    await delay(1000);
    
    await logTest('No JavaScript errors on page load', jsErrors.length === 0, 
      jsErrors.length > 0 ? jsErrors.join(', ') : '');
    
    // Test 6: Responsive design
    console.log(`\n${colors.blue}Test Group: Responsive Design${colors.reset}`);
    
    try {
      await page.setViewport({ width: 375, height: 667 }); // iPhone size
      await delay(500);
      
      const mobileH1Visible = await page.$eval('h1.brand-title', el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      
      await logTest('Mobile view displays correctly', mobileH1Visible);
      
      await page.setViewport({ width: 1280, height: 800 }); // Reset
    } catch (error) {
      await logTest('Responsive design', false, error.message);
    }
    
  } catch (error) {
    console.error(`${colors.red}Fatal test error: ${error.message}${colors.reset}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Print summary
  console.log(`\n${colors.blue}Test Summary:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Total: ${passedTests + failedTests}`);
  
  // Print failed tests details
  if (failedTests > 0) {
    console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
    testResults.filter(t => !t.passed).forEach(t => {
      console.log(`- ${t.testName}: ${t.details || 'No details'}`);
    });
  }
  
  return failedTests === 0;
}

// Check for server before running tests
async function checkServer() {
  const http = require('http');
  return new Promise((resolve) => {
    http.get(BASE_URL, (res) => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Main execution
(async () => {
  console.log('Checking if server is running...');
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log(`${colors.red}Server is not running! Please start the server with 'npm start' in another terminal.${colors.reset}`);
    process.exit(1);
  }
  
  console.log('Server is running. Starting tests...\n');
  
  const allTestsPassed = await runTests();
  process.exit(allTestsPassed ? 0 : 1);
})();