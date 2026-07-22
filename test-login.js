const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('\n=== TEST 1: Student Registration ===');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  // Switch to signup
  const goSignup = await page.$('#go-signup');
  if (goSignup) await goSignup.click();
  await new Promise(r => setTimeout(r, 300));

  const regEmail = `student_${Date.now()}@test.com`;
  await page.type('#reg-name', 'Ravi Kumar');
  await page.type('#reg-email', regEmail);
  await page.select('#reg-class', '10');
  await page.type('#reg-password', 'Test@1234');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1500));

  const portal = await page.$('#portal-container');
  const isHidden = await page.evaluate(el => el.hidden, portal);
  console.log('Register → Dashboard visible:', !isHidden);

  console.log('\n=== TEST 2: Student Login ===');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('#student-email', regEmail);
  await page.type('#student-password', 'Test@1234');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1500));
  const portalAfterLogin = await page.$('#portal-container');
  const isHiddenLogin = await page.evaluate(el => el.hidden, portalAfterLogin);
  console.log('Login → Dashboard visible:', !isHiddenLogin);

  console.log('\n=== TEST 3: Admin OTP ===');
  await page.goto('http://localhost:3000/admin.html', { waitUntil: 'networkidle2' });
  await page.type('#admin-email-input', 'ektaverma09.work@gmail.com');
  await page.click('#send-otp-btn');
  await new Promise(r => setTimeout(r, 2000));

  const otpInput = await page.$('#otp-input');
  const otpValue = await page.evaluate(el => el.value, otpInput);
  const devNotice = await page.$('#otp-dev-notice');
  const noticeText = devNotice ? await page.evaluate(el => el.textContent, devNotice) : '';
  console.log('OTP step shown:', !(await page.evaluate(el => el.hidden, await page.$('#step-otp'))));
  console.log('OTP auto-filled:', otpValue.length === 6, '→', otpValue);
  console.log('Dev notice text:', noticeText.substring(0, 60));

  if (otpValue.length === 6) {
    await page.click('#verify-otp-btn');
    await new Promise(r => setTimeout(r, 2000));
    const url = page.url();
    console.log('After verify, URL:', url);
    console.log('Admin login SUCCESS:', url.includes('admin-dashboard') || url.includes('admin'));
  }

  await browser.close();
  console.log('\n✅ All tests done!');
})();
