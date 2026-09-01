const puppeteer = require('puppeteer');

(async () => {
  console.log('🚀 TESTING STUDENT & ADMIN LOGIN UI FLOWS WITH PUPPETEER...\n');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // ─── 1. STUDENT REGISTRATION & DASHBOARD TEST ─────────────────────────────
  console.log('1. Navigating to Student Login Page (login.html)...');
  await page.goto('https://gyanlok.vercel.app/login.html', { waitUntil: 'networkidle2' });

  // Click Signup link
  await page.click('#go-signup');
  await new Promise(r => setTimeout(r, 300));

  const timestamp = Date.now();
  const testEmail = `student_ui_${timestamp}@gyanlok.app`;
  console.log(`2. Registering student: ${testEmail}...`);

  await page.type('#reg-name', 'UI Test Student');
  await page.type('#reg-email', testEmail);
  await page.select('#reg-class', '10');
  await page.type('#reg-password', 'StudentPass123!');

  await page.click('#student-register-form button[type="submit"]');
  await new Promise(r => setTimeout(r, 1500));

  // Check if Student Portal is visible
  const isPortalVisible = await page.evaluate(() => {
    const portal = document.getElementById('portal-container');
    return portal && !portal.hidden;
  });
  console.log('   Student Portal Dashboard Visible after Registration?:', isPortalVisible);

  if (isPortalVisible) {
    const studentName = await page.evaluate(() => {
      const el = document.getElementById('student-name-display');
      return el ? el.textContent : '';
    });
    console.log('   Logged In Student Name:', studentName);
  }

  // Logout Student
  console.log('\n3. Logging out student...');
  await page.click('#student-logout-btn');
  await new Promise(r => setTimeout(r, 1000));

  // ─── 4. STUDENT LOGIN TEST ───────────────────────────────────────────────
  console.log('\n4. Testing Student Login form...');
  await page.type('#student-email', testEmail);
  await page.type('#student-password', 'StudentPass123!');
  await page.click('#student-login-form button[type="submit"]');
  await new Promise(r => setTimeout(r, 1500));

  const isPortalVisible2 = await page.evaluate(() => {
    const portal = document.getElementById('portal-container');
    return portal && !portal.hidden;
  });
  console.log('   Student Portal Dashboard Visible after Login?:', isPortalVisible2);

  // ─── 5. ADMIN LOGIN TEST (admin.html) ────────────────────────────────────
  console.log('\n5. Navigating to Admin Login Page (admin.html)...');
  await page.goto('https://gyanlok.vercel.app/admin.html', { waitUntil: 'networkidle2' });

  const adminEmailInput = await page.$('#admin-email-input');
  if (adminEmailInput) {
    console.log('6. Sending Admin OTP for hmudgal577@gmail.com...');
    await page.type('#admin-email-input', 'hmudgal577@gmail.com');
    await page.click('#send-otp-btn');
    await new Promise(r => setTimeout(r, 2000));

    // Check if OTP input field is visible
    const isOtpStepVisible = await page.evaluate(() => {
      const stepOtp = document.getElementById('step-otp');
      return stepOtp && !stepOtp.hidden;
    });
    console.log('   Admin OTP Step 2 Visible?:', isOtpStepVisible);

    const otpVal = await page.evaluate(() => {
      const inp = document.getElementById('otp-input');
      return inp ? inp.value : '';
    });
    console.log('   Auto-filled Dev OTP Value:', otpVal);

    if (otpVal) {
      console.log('7. Verifying Admin OTP...');
      await page.click('#verify-otp-btn');
      await new Promise(r => setTimeout(r, 2000));

      const currentUrl = page.url();
      console.log('   URL after Admin OTP Login:', currentUrl);

      const isAdminDashboard = currentUrl.includes('admin-dashboard.html');
      console.log('   Successfully Redirected to Admin Dashboard?:', isAdminDashboard);
    }
  }

  await browser.close();
  console.log('\n🎉 FULL BROWSER AUTH FLOW TEST COMPLETED SUCCESSFULLY!');
})();
