const https = require('https');

function makeRequest(method, path, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'gyanlok.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(cookie ? { 'Cookie': cookie } : {}),
      }
    };

    const req = https.request(options, res => {
      let data = '';
      const setCookies = res.headers['set-cookie'];
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch (e) { parsed = data; }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          setCookies: setCookies,
          body: parsed
        });
      });
    });

    req.on('error', err => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function debugAdminLogin() {
  console.log('🔍 DEBUGGING ADMIN LOGIN ENDPOINTS ON LIVE PRODUCTION...\n');

  // Step 1: Send OTP
  console.log('1. Calling POST /api/admin/send-otp...');
  const sendRes = await makeRequest('POST', '/api/admin/send-otp', { email: 'hmudgal577@gmail.com' });
  console.log('   Status Code:', sendRes.statusCode);
  console.log('   Body:', sendRes.body);

  let devOtp = sendRes.body ? sendRes.body.devOtp : null;

  // Step 2: Verify OTP
  if (devOtp) {
    console.log(`\n2. Calling POST /api/admin/verify-otp with OTP '${devOtp}'...`);
    const verifyRes = await makeRequest('POST', '/api/admin/verify-otp', {
      email: 'hmudgal577@gmail.com',
      otp: devOtp
    });
    console.log('   Status Code:', verifyRes.statusCode);
    console.log('   Set-Cookie:', verifyRes.setCookies);
    console.log('   Body:', verifyRes.body);

    if (verifyRes.setCookies) {
      const adminCookie = verifyRes.setCookies.map(c => c.split(';')[0]).join('; ');
      console.log('\n3. Testing GET /api/admin/me with received Cookie...');
      const meRes = await makeRequest('GET', '/api/admin/me', null, adminCookie);
      console.log('   Status Code:', meRes.statusCode);
      console.log('   Body:', meRes.body);
    }
  }

  // Step 3: Password Fallback Test
  console.log('\n4. Testing Password Fallback POST /api/admin/login...');
  const passRes = await makeRequest('POST', '/api/admin/login', {
    email: 'hmudgal577@gmail.com',
    password: 'Admin123!'
  });
  console.log('   Status Code:', passRes.statusCode);
  console.log('   Set-Cookie:', passRes.setCookies);
  console.log('   Body:', passRes.body);

  if (passRes.setCookies) {
    const adminCookie2 = passRes.setCookies.map(c => c.split(';')[0]).join('; ');
    console.log('\n5. Testing GET /api/admin/me with Password Login Cookie...');
    const meRes2 = await makeRequest('GET', '/api/admin/me', null, adminCookie2);
    console.log('   Status Code:', meRes2.statusCode);
    console.log('   Body:', meRes2.body);
  }
}

debugAdminLogin().catch(console.error);
