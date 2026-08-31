const fs = require('fs');

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if string contains double-encoded utf8 (à¤, à¥, ðŸ, etc.)
  if (/à¤|à¥|ðŸ|â€“|â€”|Ã¢/.test(content)) {
    console.log(`Fixing double-encoded Mojibake in ${filePath}...`);
    // Convert latin1 bytes back to proper UTF-8 string
    const fixed = Buffer.from(content, 'latin1').toString('utf8');
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`✅ ${filePath} fixed!`);
  } else {
    console.log(`No Mojibake found in ${filePath}`);
  }
}

fixFile('public/index.html');
fixFile('public/script.js');
fixFile('public/chapter_html_content.json');
