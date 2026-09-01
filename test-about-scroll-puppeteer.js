const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const filePath = 'file:///' + path.resolve('public/index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'load' });

  const targetOffset = await page.evaluate(() => {
    const el = document.querySelector('#about');
    return el ? el.getBoundingClientRect().top + window.pageYOffset - 80 : null;
  });
  console.log('Target #about offset position:', targetOffset);

  await page.click('a[href="#about"]');
  await new Promise(r => setTimeout(r, 1500));

  const scrollY = await page.evaluate(() => window.scrollY);
  console.log('ScrollY after clicking About Us:', scrollY);

  await browser.close();
})();
