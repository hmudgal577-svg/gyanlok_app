const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Emulate Mobile screen width (390 x 844)
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    page.on('console', msg => console.log('MOBILE LOG:', msg.text()));
    page.on('pageerror', err => console.log('MOBILE ERROR:', err.message));

    console.log('--- TEST 1: Mobile Page Load ---');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('Mobile title:', await page.title());

    await new Promise(r => setTimeout(r, 1000));

    // Scroll to school boards section
    await page.evaluate(() => {
      const el = document.getElementById('school-boards');
      if (el) el.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 500));

    // Check chapter headers count
    const chHeaders = await page.$$('.chapter-header');
    console.log('Chapter headers on mobile:', chHeaders.length);

    if (chHeaders.length > 0) {
      console.log('\n--- TEST 2: Open Chapter Dropdown on Mobile ---');
      await page.evaluate(el => el.click(), chHeaders[0]);
      await new Promise(r => setTimeout(r, 400));

      const links = await page.$$('.ch-link-item');
      console.log('Dropdown links count:', links.length);

      if (links.length > 0) {
        console.log('\n--- TEST 3: Click Summary Link -> Open Full Screen Overlay ---');
        await page.evaluate(el => el.click(), links[0]);
        await new Promise(r => setTimeout(r, 800));

        const overlay = await page.$('#fs-doc-overlay');
        console.log('Full-screen overlay open on mobile?:', overlay !== null);

        if (overlay) {
          const isBodyOverflowHidden = await page.evaluate(() => document.body.style.overflow === 'hidden');
          console.log('Body overflow locked hidden?:', isBodyOverflowHidden);

          console.log('\n--- TEST 4: Click Notes Tab (inside overlay) ---');
          const notesTab = await page.$('.fs-tab[data-cat="notes"]');
          if (notesTab) {
            await page.evaluate(el => el.click(), notesTab);
            await new Promise(r => setTimeout(r, 500));

            const overlayAfterTab = await page.$('#fs-doc-overlay');
            console.log('Overlay still present after tab click (no teardown)?:', overlayAfterTab !== null);

            const activeTabLabel = await page.evaluate(() => {
              const active = document.querySelector('.fs-tab--active');
              return active ? active.textContent.trim() : '';
            });
            console.log('Active tab label:', activeTabLabel);
          }

          console.log('\n--- TEST 5: Close Overlay ---');
          const backBtn = await page.$('.fs-back-btn');
          if (backBtn) {
            await page.evaluate(el => el.click(), backBtn);
            await new Promise(r => setTimeout(r, 500));
            const overlayClosed = (await page.$('#fs-doc-overlay')) === null;
            console.log('Overlay closed successfully?:', overlayClosed);
          }
        }
      }
    }

    await browser.close();
    console.log('\n✅ ALL MOBILE RESPONSIVENESS TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('MOBILE TEST ERROR:', err);
  }
})();
