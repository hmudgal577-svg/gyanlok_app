const { execSync } = require('child_process');

const apiKey = 'BREVO_API_KEY_REDACTED';

try {
  console.log('Adding BREVO_API_KEY to Vercel production environment...');
  execSync(`npx vercel env rm BREVO_API_KEY production -y`, { stdio: 'ignore' });
} catch (e) {}

try {
  execSync(`npx vercel env add BREVO_API_KEY production`, {
    input: apiKey,
    encoding: 'utf-8',
    stdio: ['pipe', 'inherit', 'inherit']
  });
  console.log('✅ BREVO_API_KEY successfully added to Vercel Production!');
} catch (e) {
  console.error('Error adding env to Vercel:', e.message);
}
