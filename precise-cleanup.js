const fs = require('fs');

// --- 1. INDEX.HTML ---
let html = fs.readFileSync('public/index.html', 'utf8');

// Replace triple-spaced dashes in prose text with clean comma or colon
html = html.replace(/   -   /g, ', ');
html = html.replace(/\s+-\s+\?/g, '');
html = html.replace(/GyanLok - Learn/g, 'GyanLok | Learn');
html = html.replace(/Mathematics, Science, SST, Hindi, English/g, 'Hindi');
html = html.replace(/CBSE Class 6 - 10/g, 'CBSE Class 10');
html = html.replace(/ICSE Class 6 - 10/g, 'ICSE Class 10');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('✅ index.html precisely cleaned');

// --- 2. CHAPTER HTML CONTENT JSON ---
let json = fs.readFileSync('public/chapter_html_content.json', 'utf8');
// Clean ' — ' or ' - ' in JSON headings ONLY
json = json.replace(/ — /g, ' : ');
json = json.replace(/   -   /g, ', ');
fs.writeFileSync('public/chapter_html_content.json', json, 'utf8');
console.log('✅ chapter_html_content.json precisely cleaned');

console.log('Done!');
