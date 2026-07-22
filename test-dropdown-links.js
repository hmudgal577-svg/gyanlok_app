const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 1. Visit homepage
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('TEST: Loaded homepage:', await page.title());
    await new Promise(r => setTimeout(r, 1500));

    // 2. Click chapter header
    const chHeaders = await page.$$('.chapter-header');
    console.log('TEST: Found chapter headers:', chHeaders.length);

    if (chHeaders.length > 0) {
      await chHeaders[0].click();
      await new Promise(r => setTimeout(r, 500));

      // 3. Find <a> links in dropdown
      const links = await page.$$('.ch-link-item');
      console.log('TEST: Found anchor links in dropdown:', links.length);

      for (let i = 0; i < links.length; i++) {
        const href = await page.evaluate(el => el.getAttribute('href'), links[i]);
        const text = await page.evaluate(el => el.innerText.replace(/\n/g, ' '), links[i]);
        console.log(`  Link [${i+1}]: href="${href}" | text="${text}"`);
      }

      if (links.length > 0) {
        const firstHref = await page.evaluate(el => el.getAttribute('href'), links[0]);
        console.log('\nTEST: Navigating directly to URL:', firstHref);
        await page.goto(`http://localhost:3000${firstHref}`, { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 1500));

        const overlay = await page.$('#fs-doc-overlay');
        console.log('TEST RESULT: Direct URL auto-opened full-screen reader?:', overlay !== null);
      }
    }

    await browser.close();
  } catch (err) {
    console.error('TEST ERROR:', err);
  }
})();
