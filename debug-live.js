const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Listen to console logs & errors
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    await page.goto('https://gyanlok-app.vercel.app', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Check chapter headers
    const chHeaders = await page.$$('.chapter-header');
    console.log('Chapter headers count:', chHeaders.length);

    if (chHeaders.length > 0) {
      await chHeaders[0].click();
      await new Promise(r => setTimeout(r, 500));
      const links = await page.$$('.ch-link-item');
      console.log('Dropdown links count after click:', links.length);
    }

    await browser.close();
  } catch (e) {
    console.error('Test error:', e);
  }
})();
