const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('https://gyanlok.vercel.app', { waitUntil: 'networkidle2' });
  
  const chHeaders = await page.$$('.chapter-header');
  console.log('Live Mobile Chapter Headers Count:', chHeaders.length);
  
  if (chHeaders.length > 0) {
    const text = await page.evaluate(el => el.textContent, chHeaders[0]);
    console.log('First Chapter Title on Live Mobile:', text.trim());
  }

  await browser.close();
})();
