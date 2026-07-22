const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    // Set viewport to standard desktop
    await page.setViewport({ width: 1280, height: 800 });

    // Catch any page errors
    page.on('pageerror', err => {
      console.log('PAGE ERROR:', err.toString());
    });
    page.on('console', msg => {
      console.log('CONSOLE LOG:', msg.text());
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('Loaded homepage:', await page.title());

    // Take initial screenshot
    await page.screenshot({ path: 'screenshot-home.png' });
    console.log('Saved screenshot-home.png');

    // Click the first chapter header (e.g., "Harihar Kaka" under Sanchayan)
    // Sanchayan Ch 1:
    const chHeaders = await page.$$('.chapter-header');
    console.log('Chapter headers count:', chHeaders.length);

    if (chHeaders.length > 0) {
      console.log('Clicking first chapter header...');
      await chHeaders[0].click();
      await new Promise(r => setTimeout(r, 1000));

      await page.screenshot({ path: 'screenshot-chapter-clicked.png' });
      console.log('Saved screenshot-chapter-clicked.png');

      const optBtns = await page.$$('.rp-opt-btn');
      console.log('Option buttons count:', optBtns.length);

      if (optBtns.length > 0) {
        console.log('Clicking first option button (Summary)...');
        await optBtns[0].click();
        await new Promise(r => setTimeout(r, 1500));

        await page.screenshot({ path: 'screenshot-summary-clicked.png' });
        console.log('Saved screenshot-summary-clicked.png');

        const overlay = await page.$('#fs-doc-overlay');
        if (overlay) {
          const isVisible = await page.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none';
          }, overlay);
          console.log('Overlay visible on screen?', isVisible);
          const computedStyle = await page.evaluate((el) => {
            const style = window.getComputedStyle(el);
            return {
              position: style.position,
              zIndex: style.zIndex,
              width: style.width,
              height: style.height,
              display: style.display,
              top: style.top,
              left: style.left
            };
          }, overlay);
          console.log('Overlay styles:', computedStyle);
        } else {
          console.log('Overlay not found in DOM!');
        }
      } else {
        console.log('No option buttons found! Trying to click again or check if mobile view.');
      }
    }

    await browser.close();
  } catch (err) {
    console.error('ERROR IN TEST:', err);
  }
})();
