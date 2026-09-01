const fs = require('fs');
const path = require('path');

function fixMojibake(str) {
  let s = str;
  // Replace double-encoded UTF-8 mojibake patterns
  s = s.replace(/Ã¢â‚¬â€ /g, ' — ');
  s = s.replace(/Ã¢â‚¬â€/g, ' — ');
  s = s.replace(/Ã¢â‚¬â€œ/g, '–');
  s = s.replace(/Ã¢â‚¬ï¿½/g, '"');
  s = s.replace(/Ã¢â‚¬Å“/g, '"');
  s = s.replace(/Ã¢â‚¬/g, '—');
  s = s.replace(/Ã¢ÂÂ/g, '—');
  s = s.replace(/Ã¢ÂÂ/g, '–');
  s = s.replace(/Ã¢ÂÂ/g, '’');
  s = s.replace(/Ã‚Â²/g, '²');
  s = s.replace(/aÂ²/g, 'a²');
  s = s.replace(/bÂ²/g, 'b²');
  s = s.replace(/cÂ²/g, 'c²');
  s = s.replace(/Â²/g, '²');
  s = s.replace(/Ã/g, '');
  s = s.replace(/Ã¢/g, '');
  s = s.replace(/Ã/g, '');
  return s;
}

const targetFiles = [
  'public/index.html',
  'public/script.js',
  'public/style.css',
  'public/admin.html',
  'public/login.html',
  'public/chapter_html_content.json'
];

targetFiles.forEach(relPath => {
  const filePath = path.join(__dirname, relPath);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');

  // Check how many bad sequences exist
  const badCount = (content.match(/Ã/g) || []).length;
  console.log(`${relPath}: found ${badCount} corrupted character markers`);

  if (badCount > 0) {
    const fixed = fixMojibake(content);
    fs.writeFileSync(filePath, fixed, { encoding: 'utf8' });
    console.log(`  ✓ Fixed and saved ${relPath} in UTF-8`);
  }
});
