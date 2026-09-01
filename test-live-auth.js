const https = require('https');

function apiCall(method, path, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'gyanlok.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...(cookie ? { 'Cookie': cookie } : {}),
      }
    };

    const req = https.request(options, (res) => {
      let resData = '';
      const setCookieHeader = res.headers['set-cookie'];
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            cookies: setCookieHeader,
            body: JSON.parse(resData)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            cookies: setCookieHeader,
            raw: resData
          });
        }
      });
    });

    req.on('error', err => reject(err));
    if (data) req.write(data);
    req.end();
  });
}

async function runAuthTests() {
  console.log('🚀 TESTING STUDENT & ADMIN AUTH ON GYANLOK PRODUCTION...\n');

  // Test 1: Student Me unauthenticated
  const me1 = await apiCall('GET', '/api/student/me');
  console.log('1. GET /api/student/me (Unauthenticated):', me1.status, me1.body);

  // Test 2: Student Registration
  const testEmail = `student_${Date.now()}@gyanlok.app`;
  const reg = await apiCall('POST', '/api/student/register', {
    name: 'Test Student',
    email: testEmail,
    class_num: 10,
    password: 'Password123!'
  });
  console.log('\n2. POST /api/student/register:', reg.status, reg.body);

  let studentCookie = null;
  if (reg.cookies) {
    studentCookie = reg.cookies.map(c => c.split(';')[0]).join('; ');
    console.log('   Received Auth Cookie from Register:', studentCookie);
  }

  // Test 3: Student Login
  const login = await apiCall('POST', '/api/student/login', {
    email: testEmail,
    password: 'Password123!'
  });
  console.log('\n3. POST /api/student/login:', login.status, login.body);

  if (login.cookies) {
    studentCookie = login.cookies.map(c => c.split(';')[0]).join('; ');
    console.log('   Received Auth Cookie from Login:', studentCookie);
  }

  // Test 4: Student Me with Session Cookie
  if (studentCookie) {
    const me2 = await apiCall('GET', '/api/student/me', null, studentCookie);
    console.log('\n4. GET /api/student/me (With Session Cookie):', me2.status, me2.body);
  }

  // Test 5: Admin OTP Request
  const adminEmail = 'hmudgal577@gmail.com';
  const otpReq = await apiCall('POST', '/api/admin/send-otp', { email: adminEmail });
  console.log('\n5. POST /api/admin/send-otp:', otpReq.status, otpReq.body);

  // Test 6: Verify OTP (if dev mode or devOtp returned)
  if (otpReq.body && otpReq.body.devOtp) {
    const otpVer = await apiCall('POST', '/api/admin/verify-otp', {
      email: adminEmail,
      otp: otpReq.body.devOtp
    });
    console.log('\n6. POST /api/admin/verify-otp:', otpVer.status, otpVer.body);
  }

  console.log('\n🎉 AUTH TEST SUITE COMPLETE!');
}

runAuthTests().catch(console.error);
