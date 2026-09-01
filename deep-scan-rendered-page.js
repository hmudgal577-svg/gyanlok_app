const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('--- DEEP SCANNING RENDERED DOM ON LIVE SITE ---');
  await page.goto('https://gyanlok.vercel.app', { waitUntil: 'networkidle2' });

  // Get full rendered text
  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('Full Text Length:', fullText.length);

  // Find all suspicious substrings: ' - ', ' - ?', '', 'Ã', 'Â', 'â', 'dY"'
  const lines = fullText.split('\n');
  let count = 0;
  lines.forEach((l, idx) => {
    if (/\s+-\s+|\s+-\s+\?|[\uFFFD]|Ã|Â|â|dY"|\?/.test(l)) {
      console.log(`Rendered Line ${idx + 1}: ${l.trim()}`);
      count++;
    }
  });

  console.log(`Total suspicious rendered lines: ${count}`);

  // Also check dynamic board content HTML
  const boardHtml = await page.evaluate(() => {
    const el = document.getElementById('board-content');
    return el ? el.innerHTML : '';
  });

  const boardLines = boardHtml.split('\n');
  boardLines.forEach((l, idx) => {
    if (/\s+-\s+|\s+-\s+\?|[\uFFFD]|Ã|Â|â|dY"/.test(l)) {
      console.log(`Board HTML Line ${idx + 1}: ${l.trim().slice(0, 100)}`);
    }
  });

  await browser.close();
})();
