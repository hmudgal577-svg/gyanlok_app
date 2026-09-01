const apiKey = 'BREVO_API_KEY_REDACTED';

async function testBrevoDirect() {
  console.log('Testing Brevo API directly with key...');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'GyanLok Admin', email: 'hmudgal577@gmail.com' },
      to: [{ email: 'hmudgal577@gmail.com' }],
      subject: '🔐 Test Brevo OTP Direct',
      htmlContent: '<p>Your test OTP is 123456</p>'
    })
  });

  const status = res.status;
  const body = await res.json().catch(() => ({}));
  console.log('Brevo Status:', status);
  console.log('Brevo Response:', body);
}

testBrevoDirect().catch(console.error);
