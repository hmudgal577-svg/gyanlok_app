const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('https://gyanlok.vercel.app', { waitUntil: 'networkidle2' });

  // Take screenshot of #about section
  const aboutSec = await page.$('#about');
  if (aboutSec) {
    await aboutSec.screenshot({ path: 'public/about-section-preview.png' });
    console.log('Saved about-section-preview.png');
  }

  // Click About Us link in navbar
  await page.click('a[href="#about"]');
  await new Promise(r => setTimeout(r, 500));

  // Check modal state
  const isModalActive = await page.evaluate(() => {
    const m = document.getElementById('about-modal');
    return m ? m.classList.contains('active') : false;
  });
  console.log('Is About Modal Active after click?:', isModalActive);

  await browser.close();
})();
