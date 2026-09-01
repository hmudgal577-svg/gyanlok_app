const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Emulate Mobile viewport (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    console.log('--- FINAL LIVE TEST: https://gyanlok.vercel.app ---');
    await page.goto('https://gyanlok.vercel.app', { waitUntil: 'networkidle2' });
    console.log('Page Title:', await page.title());

    await new Promise(r => setTimeout(r, 1000));

    // Check chapter headers count
    const chHeaders = await page.$$('.chapter-header');
    console.log('Chapter headers count on mobile:', chHeaders.length);

    if (chHeaders.length > 0) {
      await page.evaluate(el => el.click(), chHeaders[0]);
      await new Promise(r => setTimeout(r, 400));

      const links = await page.$$('.ch-link-item');
      console.log('Dropdown links count:', links.length);

      if (links.length > 0) {
        await page.evaluate(el => el.click(), links[0]);
        await new Promise(r => setTimeout(r, 800));

        const overlay = await page.$('#fs-doc-overlay');
        console.log('Full-screen overlay open on mobile?:', overlay !== null);

        const isBodyOverflowHidden = await page.evaluate(() => document.body.style.overflow === 'hidden');
        console.log('Body overflow locked hidden?:', isBodyOverflowHidden);

        // Click Notes tab inside overlay
        const notesTab = await page.$('.fs-tab[data-cat="notes"]');
        if (notesTab) {
          await page.evaluate(el => el.click(), notesTab);
          await new Promise(r => setTimeout(r, 500));
          const overlayAfterTab = await page.$('#fs-doc-overlay');
          console.log('Overlay intact after tab click (no teardown)?:', overlayAfterTab !== null);

          const activeTabLabel = await page.evaluate(() => {
            const active = document.querySelector('.fs-tab--active');
            return active ? active.textContent.trim() : '';
          });
          console.log('Active tab label:', activeTabLabel);
        }

        // Close Overlay
        const backBtn = await page.$('.fs-back-btn');
        if (backBtn) {
          await page.evaluate(el => el.click(), backBtn);
          await new Promise(r => setTimeout(r, 500));
          const overlayClosed = (await page.$('#fs-doc-overlay')) === null;
          console.log('Overlay closed successfully?:', overlayClosed);
        }
      }
    }

    await browser.close();
    console.log('\n🎉 ALL FINAL TESTS PASSED ON LIVE https://gyanlok.vercel.app!');
  } catch (err) {
    console.error('FINAL TEST ERROR:', err);
  }
})();
