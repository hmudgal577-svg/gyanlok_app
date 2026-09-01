const { execSync } = require('child_process');

const smtpUser = 'hmudgal577@gmail.com';
const smtpPass = 'jaraudlxplmgotrw';

console.log('Adding SMTP_USER and SMTP_PASS to Vercel Production Environment...');

try {
  execSync(`npx vercel env rm SMTP_USER production -y`, { stdio: 'ignore' });
} catch (e) {}

try {
  execSync(`npx vercel env rm SMTP_PASS production -y`, { stdio: 'ignore' });
} catch (e) {}

try {
  execSync(`npx vercel env add SMTP_USER production`, {
    input: smtpUser,
    encoding: 'utf-8',
    stdio: ['pipe', 'inherit', 'inherit']
  });
  console.log('✅ Added SMTP_USER');
} catch (e) {
  console.error('Error adding SMTP_USER:', e.message);
}

try {
  execSync(`npx vercel env add SMTP_PASS production`, {
    input: smtpPass,
    encoding: 'utf-8',
    stdio: ['pipe', 'inherit', 'inherit']
  });
  console.log('✅ Added SMTP_PASS');
} catch (e) {
  console.error('Error adding SMTP_PASS:', e.message);
}

console.log('🎉 Vercel Environment Variables Updated Successfully!');
